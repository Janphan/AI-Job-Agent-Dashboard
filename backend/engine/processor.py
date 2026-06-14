import os
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel, Field


class JobAnalysis(BaseModel):
    match_score: int = Field(..., description="Match score from 0 to 100 based on JD requirements")
    strengths: List[str] = Field(..., description="List of candidate's strengths matching the JD")
    missing_skills: List[str] = Field(..., description="Key technical/soft skills or tools missing in the CV but required by the JD")
    summary: str = Field(..., description="A concise summary of 2-3 sentences assessing the fit and giving advice")


class JobProcessor:
    def __init__(self):
        load_dotenv()

        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY not found in .env file")

        self.client = None
        self.sdk_error = None

        try:
            try:
                from google import genai
            except ImportError:
                import google.genai as genai

            self.client = genai.Client(api_key=api_key)
        except ImportError as exc:
            self.sdk_error = exc
        except Exception as exc:
            self.sdk_error = exc

    def analyze(self, cv_text: str, jd_text: str):
        if self.client is None:
            return {
                "error": f"Google Gen AI SDK is not available in the active Python environment: {self.sdk_error}",
                "match_score": 0,
                "strengths": [],
                "missing_skills": ["Install google-genai in the active environment"],
                "summary": "Backend started without the Gemini SDK loaded",
            }

        try:
            prompt = f"""
You are a Senior Technical Recruiter. Compare the CV and JD provided below.

## CV (Candidate's Resume)
{cv_text}

## JD (Job Description)
{jd_text}
"""

            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': JobAnalysis,
                    'temperature': 0,
                },
            )

            return response.parsed.model_dump()

        except Exception as e:
            return {
                "error": str(e),
                "match_score": 0,
                "strengths": [],
                "missing_skills": ["System error"],
                "summary": "Error during analysis"
            }