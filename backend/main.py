import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine.scraper import JobScraper
from engine.processor import JobProcessor
import google.generativeai as genai

app = FastAPI(title="AI Job Agent Backend", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for job analysis request
class JobRequest(BaseModel):
    jd_text: str
    cv_text: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "jd_text": "We are looking for a Python developer with experience in FastAPI...",
                "cv_text": "John Doe - Software Engineer with 5 years experience in Python..."
            }
        }

# Initialize tools
scraper = JobScraper()
ai_processor = JobProcessor()

@app.get("/")
async def root():
    return {"message": "AI Job Agent Backend API"}

@app.get("/jobs")
async def get_jobs():
    # Load jobs from data/jobs.json
    if os.path.exists("data/jobs.json"):
        with open("data/jobs.json", "r") as f:
            jobs = json.load(f)
        return {"jobs": jobs}
    return {"jobs": []}

@app.post("/scrape")
async def scrape_and_process():
    # Scrape jobs using Playwright
    raw_jobs = scrape_jobs()
    
    # Process with Gemini AI
    processed_jobs = process_job_data(raw_jobs)
    
    # Save to data/jobs.json
    with open("data/jobs.json", "w") as f:
        json.dump(processed_jobs, f, indent=2)
    
    return {"message": "Jobs scraped and processed", "count": len(processed_jobs)}

@app.post("/analyze")
def analyze_job(request: JobRequest):
    try:
        final_jd_text = request.jd_text
        
        if request.jd_text.startswith(("http://", "https://")):
            # Now the Playwright Sync API will run smoothly
            scraped_content = scraper.scrape_url(request.jd_text)
            if not scraped_content:
                raise HTTPException(status_code=400, detail="Failed to scrape content.")
            final_jd_text = scraped_content

        print("--- DEBUG: JD CONTENT START ---")
        print(final_jd_text[:1000])  
        print("--- DEBUG: JD CONTENT END ---")

        result = ai_processor.analyze(request.cv_text, final_jd_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))