from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine.scraper import JobScraper
from engine.processor import JobProcessor
import json
import os

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

# Initialize tools
scraper = JobScraper()
ai_processor = JobProcessor()

@app.get("/")
async def root():
    return {"message": "AI Job Agent Backend API"}

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
        print(final_jd_text[:1000])  # Print first 1000 characters to console
        print("--- DEBUG: JD CONTENT END ---")

        result = ai_processor.analyze(request.cv_text, final_jd_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))