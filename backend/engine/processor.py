import os
import json
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel, Field


class ScoreBreakdown(BaseModel):
    technical_skills: int = Field(
        description="Max 40 points. Score for matching programming languages, frameworks, and tools (e.g., React, Python, FastAPI)."
    )
    experience_and_projects: int = Field(
        description="Max 30 points. Score for relevant project experience, internships, or building core system components."
    )
    education_and_soft_skills: int = Field(
        description="Max 20 points. Score for matching educational background (IT/CS degrees, Master's tracks) and soft skills."
    )
    bonus_points: int = Field(
        description="Max 10 points. Extra points for nice-to-have skills mentioned in the JD (e.g., Gemini API, Cloud, Web scraping)."
    )
    total_match_score: int = Field(
        description="The mathematical sum of technical_skills, experience_and_projects, education_and_soft_skills, and bonus_points. Strictly between 0 and 100."
    )

class JobAnalysisResponse(BaseModel):
    score_breakdown: ScoreBreakdown = Field(description="Detailed scoring breakdown based on the 100-point rubric.")
    strengths: List[str] = Field(description="Key strengths and direct alignments found in the CV.")
    missing_skills: List[str] = Field(description="Critical technical skills, tools, or domain knowledge missing from the CV.")
    summary: str = Field(description="A concise summary (2-3 sentences) evaluating the candidate's fit and actionable advice.")


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
                "error": f"Google Gen AI SDK is not available: {self.sdk_error}",
                "score_breakdown": {"technical_skills": 0, "experience_and_projects": 0, "education_and_soft_skills": 0, "bonus_points": 0, "total_match_score": 0},
                "strengths": [],
                "missing_skills": ["Install google-genai in the active environment"],
                "summary": "Backend started without the Gemini SDK loaded",
            }

        try:
            prompt = f"""
You are a Senior Technical Recruiter. Evaluate the candidate's CV against the Job Description (JD) strictly using the 100-point rubric provided below.

### SCORING RUBRIC (Max 100 Points)

1. Technical Skills (Max 40 points):
   - 40 pts: Matches all core tech stack (e.g., React, Python, FastAPI).
   - 25-35 pts: Matches major tech stack but misses 1-2 secondary libraries/tools.
   - <25 pts: Missing core programming languages or critical frameworks required.

2. Experience & Projects (Max 30 points):
   - 30 pts: Outstanding practical experience, core internship, or independent projects directly matching the role's scope (e.g., building dashboards, AI integrations).
   - 15-24 pts: Has relevant tech experience but in a slightly different domain.
   - <15 pts: Little to no practical project experience or relevant professional background.

3. Education & Soft Skills (Max 20 points):
   - 20 pts: Relevant academic path (e.g., Business IT, Computer Science) or pursuing higher education (Master's track).
   - 10-15 pts: Non-IT degree but has verified technical certifications/bootcamps.

4. Bonus / Nice-to-have (Max 10 points):
   - 10 pts: Possesses extra specialized skills listed in the JD (e.g., Google Gemini API, cloud deployment, web scraping/automation).

Calculate each component meticulously and sum them up to populate the `total_match_score`.

---

### INPUT DATA

#### [Candidate CV]
{cv_text}

#### [Job Description]
{jd_text}
"""

            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': JobAnalysisResponse,
                    'temperature': 0,
                },
            )

            return json.loads(response.text)

        except Exception as e:
            return {
                "error": str(e),
                "score_breakdown": {"technical_skills": 0, "experience_and_projects": 0, "education_and_soft_skills": 0, "bonus_points": 0, "total_match_score": 0},
                "strengths": [],
                "missing_skills": ["System error occurred"],
                "summary": "Error during analysis execution."
            }