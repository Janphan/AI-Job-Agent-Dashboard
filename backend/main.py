from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine.scraper import JobScraper
from engine.processor import JobProcessor
import json
import os
import PyPDF2
from typing import Optional

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
    
    try:
        # Extract text from uploaded PDF
        cv_text = extract_text_from_pdf(cv_file.file)
        
        final_jd_text = jd_text
        
        if jd_text.startswith(("http://", "https://")):
            # Scrape job description from URL
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

        result = ai_processor.analyze(cv_text, final_jd_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))