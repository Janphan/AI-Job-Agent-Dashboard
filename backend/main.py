from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime

from engine.scraper import JobScraper
from engine.processor import JobProcessor
from engine.utils import PDFProcessor

app = FastAPI(title="AI Job Agent API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Job(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary: str
    matchScore: int
    logo: Optional[str] = None
    whyMatch: List[str]
    missingKeywords: List[str]
    description: str
    requirements: List[str]
    posted: str

class JobMatchRequest(BaseModel):
    resume_text: str
    job_criteria: Optional[dict] = None

# Global instances
scraper = JobScraper()
processor = JobProcessor()
pdf_processor = PDFProcessor()

# Routes
@app.get("/")
async def root():
    return {"message": "AI Job Agent API", "status": "running"}

@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    """Analyze uploaded resume PDF"""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        # Read and process PDF
        content = await file.read()
        resume_text = pdf_processor.extract_text_from_pdf(content)

        # Process with AI
        analysis = await processor.analyze_resume(resume_text)

        return {
            "resume_text": resume_text,
            "analysis": analysis,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

@app.post("/api/scrape-jobs")
async def scrape_jobs(request: JobMatchRequest):
    """Scrape jobs and match with resume"""
    try:
        # Scrape jobs
        jobs_data = await scraper.scrape_jobs()

        # Process and match jobs
        matched_jobs = []
        for job_data in jobs_data:
            match_result = await processor.match_job_with_resume(
                job_data, request.resume_text
            )
            matched_jobs.append(match_result)

        # Save to file
        save_jobs_to_file(matched_jobs)

        return {
            "jobs": matched_jobs,
            "total_jobs": len(matched_jobs),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job scraping failed: {str(e)}")

@app.get("/api/jobs", response_model=List[Job])
async def get_jobs():
    """Get all stored jobs"""
    try:
        jobs = load_jobs_from_file()
        return jobs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load jobs: {str(e)}")

@app.get("/api/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    """Get specific job by ID"""
    try:
        jobs = load_jobs_from_file()
        job = next((j for j in jobs if j["id"] == job_id), None)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return job
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load job: {str(e)}")

# Helper functions
def save_jobs_to_file(jobs: List[dict]):
    """Save jobs to JSON file"""
    os.makedirs("backend/data", exist_ok=True)
    with open("backend/data/jobs.json", "w", encoding="utf-8") as f:
        json.dump({
            "jobs": jobs,
            "last_updated": datetime.now().isoformat(),
            "total_jobs": len(jobs)
        }, f, indent=2, ensure_ascii=False)

def load_jobs_from_file() -> List[dict]:
    """Load jobs from JSON file"""
    try:
        with open("backend/data/jobs.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("jobs", [])
    except FileNotFoundError:
        return []
    except Exception as e:
        print(f"Error loading jobs: {e}")
        return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)