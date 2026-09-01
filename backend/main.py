from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from engine.scraper import JobScraper
from engine.processor import JobProcessor
import json
import os
import PyPDF2
from typing import Optional
import tempfile
from dotenv import load_dotenv

load_dotenv()

from database import get_db, Base, engine
from models import Job, Analysis
app = FastAPI(title="AI Job Agent Backend", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://0.0.0.0:5173",
        "https://ai-job-agent-dashboard.fly.dev",
        "https://backend-ai-job-agent-dashboard.fly.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for job analysis request
class JobRequest(BaseModel):
    jd_text: str
    cv_text: str

class JobRequestWithFile(BaseModel):
    jd_text: str

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file) -> str:
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

# Initialize tools
scraper = JobScraper()
ai_processor = JobProcessor()

# Create tables on startup
Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "AI Job Agent Backend API"}


@app.post("/analyze")
def analyze_job(request: JobRequest, db: Session = Depends(get_db)):
    final_jd_text = request.jd_text
    url = request.jd_text if request.jd_text.startswith(("http://", "https://")) else None

    if url:
        scraped_content = scraper.scrape_url(url)
        if not scraped_content:
            raise HTTPException(status_code=400, detail="Failed to scrape content from URL. Please paste the job description text directly instead.")
        if scraper.is_blocked(scraped_content):
            raise HTTPException(
                status_code=400,
                detail="This site blocked the scraper. Please paste the job description text directly instead of a URL."
            )
        final_jd_text = scraped_content

    print("--- DEBUG: JD CONTENT START ---")
    print(final_jd_text[:1000])
    print("--- DEBUG: JD CONTENT END ---")

    try:
        result = ai_processor.analyze(request.cv_text, final_jd_text)
    except Exception as e:
        print(f"ERROR in analyze_job: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    score_breakdown = result.get("score_breakdown", {})
    total_score = score_breakdown.get("total_match_score") if isinstance(score_breakdown, dict) else None

    job = Job(
        url=url or "",
        title=result.get("job_title"),
        company=result.get("company"),
        location=result.get("location"),
        key_requirements=json.dumps(result.get("missing_skills", [])),
    )
    db.add(job)
    db.flush()

    stored_breakdown = score_breakdown.copy() if isinstance(score_breakdown, dict) else {}
    stored_breakdown["language_requirements"] = result.get("language_requirements", [])
    stored_breakdown["years_of_experience_required"] = result.get("years_of_experience_required", 0)
    stored_breakdown["candidate_years_of_experience"] = result.get("candidate_years_of_experience", 0)

    analysis = Analysis(
        job_id=job.id,
        total_score=total_score,
        score_breakdown=json.dumps(stored_breakdown),
        strengths=json.dumps(result.get("strengths", [])),
        missing_skills=json.dumps(result.get("missing_skills", [])),
        summary=result.get("summary"),
        cv_text=request.cv_text,
        status="Saved",
    )
    db.add(analysis)
    db.commit()
    db.refresh(job)
    db.refresh(analysis)

    return {
        "id": job.id,
        "analysis_id": analysis.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "url": job.url,
        "date": job.created_at.isoformat() if job.created_at else None,
        "score_breakdown": score_breakdown,
        "strengths": result.get("strengths", []),
        "missing_skills": result.get("missing_skills", []),
        "summary": result.get("summary"),
        "language_requirements": result.get("language_requirements", []),
        "years_of_experience_required": result.get("years_of_experience_required", 0),
        "candidate_years_of_experience": result.get("candidate_years_of_experience", 0),
    }

@app.get("/jobs")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).all()
    result = []
    for job in jobs:
        analysis = db.query(Analysis).filter(Analysis.job_id == job.id).order_by(Analysis.created_at.desc()).first()
        result.append({
            "id": job.id,
            "url": job.url,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "key_requirements": json.loads(job.key_requirements) if job.key_requirements else [],
            "date": job.created_at.isoformat() if job.created_at else None,
            "analysis": {
                "id": analysis.id,
                "total_score": analysis.total_score,
                "score_breakdown": json.loads(analysis.score_breakdown) if analysis and analysis.score_breakdown else None,
                "strengths": json.loads(analysis.strengths) if analysis and analysis.strengths else [],
                "missing_skills": json.loads(analysis.missing_skills) if analysis and analysis.missing_skills else [],
                "summary": analysis.summary if analysis else None,
                "status": analysis.status if analysis else None,
                "language_requirements": json.loads(analysis.score_breakdown).get("language_requirements", []) if analysis and analysis.score_breakdown else [],
                "years_of_experience_required": json.loads(analysis.score_breakdown).get("years_of_experience_required", 0) if analysis and analysis.score_breakdown else 0,
                "candidate_years_of_experience": json.loads(analysis.score_breakdown).get("candidate_years_of_experience", 0) if analysis and analysis.score_breakdown else 0,
            } if analysis else None,
        })
    return result


@app.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    analyses = db.query(Analysis).filter(Analysis.job_id == job_id).order_by(Analysis.created_at.desc()).all()

    return {
        "id": job.id,
        "url": job.url,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "key_requirements": json.loads(job.key_requirements) if job.key_requirements else [],
        "date": job.created_at.isoformat() if job.created_at else None,
        "analyses": [
            {
                "id": a.id,
                "total_score": a.total_score,
                "score_breakdown": json.loads(a.score_breakdown) if a.score_breakdown else None,
                "strengths": json.loads(a.strengths) if a.strengths else [],
                "missing_skills": json.loads(a.missing_skills) if a.missing_skills else [],
                "summary": a.summary,
                "status": a.status,
                "created_at": a.created_at.isoformat() if a.created_at else None,
                "language_requirements": json.loads(a.score_breakdown).get("language_requirements", []) if a.score_breakdown else [],
                "years_of_experience_required": json.loads(a.score_breakdown).get("years_of_experience_required", 0) if a.score_breakdown else 0,
                "candidate_years_of_experience": json.loads(a.score_breakdown).get("candidate_years_of_experience", 0) if a.score_breakdown else 0,
            }
            for a in analyses
        ],
    }


@app.patch("/analyses/{analysis_id}")
def update_analysis_status(analysis_id: int, status: str, db: Session = Depends(get_db)):
    valid_statuses = {"Saved", "Applied", "Interviewing", "Rejected"}
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis.status = status
    db.commit()
    return {"message": "Status updated", "analysis_id": analysis_id, "status": status}


@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted", "job_id": job_id}


@app.post("/upload-cv")
async def upload_cv(cv_file: UploadFile = File(...)):
    """
    Upload a PDF CV and extract text content
    """
    if not cv_file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Extract text from uploaded PDF
        cv_text = extract_text_from_pdf(cv_file.file)
        return {
            "filename": cv_file.filename,
            "cv_text": cv_text,
            "message": "CV uploaded and processed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CV: {str(e)}")

@app.post("/analyze-with-pdf")
async def analyze_with_pdf(
    jd_text: str,
    cv_file: UploadFile = File(...)
):
    """
    Analyze job with uploaded PDF CV
    """
    if not cv_file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    cv_text = extract_text_from_pdf(cv_file.file)

    final_jd_text = jd_text

    if jd_text.startswith(("http://", "https://")):
        scraped_content = scraper.scrape_url(jd_text)
        if not scraped_content:
            raise HTTPException(status_code=400, detail="Failed to scrape job description.")
        final_jd_text = scraped_content

    print("--- DEBUG: JD CONTENT START ---")
    print(final_jd_text[:1000])
    print("--- DEBUG: JD CONTENT END ---")

    print("--- DEBUG: CV CONTENT START ---")
    print(cv_text[:500])
    print("--- DEBUG: CV CONTENT END ---")

    try:
        result = ai_processor.analyze(cv_text, final_jd_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract_pdf")
async def extract_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files supported")
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    try:
        text = extract_text_from_pdf(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
    return {"text": text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)