import os
import json
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel, Field


class LanguageRequirement(BaseModel):
    language: str = Field(description="Language name (e.g. 'Finnish', 'English')")
    level: str = Field(description="Required proficiency level as stated in JD (e.g. 'Fluent', 'Native', 'Good to have', 'Basic')")
    is_required: bool = Field(description="Whether this language is mandatory ('required'/'must') or just 'good to have'/'nice to have'")
    candidate_has: bool = Field(description="Whether the candidate's CV shows proficiency in this language")


class ScoreBreakdown(BaseModel):
    technical_skills: int = Field(
        description="Max 40 points. Score for matching programming languages, frameworks, and tools (e.g., React, Python, FastAPI)."
    )
    experience_and_projects: int = Field(
        description="Max 30 points. Score for relevant project experience, internships, or building core system components. Consider years-of-experience match proportionally (e.g., 1yr vs 3yr required = ~33% in this category)."
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
    job_title: str = Field(description="Job title extracted from the job description (e.g. 'IT-harjoittelija', 'Frontend Developer')")
    company: str = Field(description="Company name extracted from the job description (e.g. 'Talenom Oyj')")
    location: str = Field(description="Job location extracted from the job description (e.g. 'Oulu, Finland')")
    years_of_experience_required: int = Field(description="Number of years of experience the JD requires. 0 if it's an entry-level/internship position.")
    candidate_years_of_experience: int = Field(description="Candidate's relevant years of experience extracted from the CV. 0 for fresh graduates.")
    language_requirements: List[LanguageRequirement] = Field(description="List of language requirements from the JD with their status and candidate match.")
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
                "job_title": "",
                "company": "",
                "location": "",
                "score_breakdown": {"technical_skills": 0, "experience_and_projects": 0, "education_and_soft_skills": 0, "bonus_points": 0, "total_match_score": 0},
                "strengths": [],
                "missing_skills": ["Install google-genai in the active environment"],
                "summary": "Backend started without the Gemini SDK loaded",
            }

        try:
            prompt = f"""
You are a Senior Technical Recruiter. Evaluate the candidate's CV against the Job Description (JD) strictly using the 100-point rubric provided below.

### IMPORTANT RULES

1. **Language Requirements**: Extract ALL language requirements from the JD. Mark each as `is_required: true` if the JD says "must", "required", "mandatory", "edellytämme" (Finnish), "vaaditaan" etc. Mark as `is_required: false` if it says "good to have", "nice to have", "beneficial", "katsotaan eduksi", "suotavaa". Set `candidate_has` based on whether the CV shows proficiency. Language requirements are for INFORMATION only — do NOT include them in the point score.

2. **Years of Experience**: Extract `years_of_experience_required` from the JD and `candidate_years_of_experience` from the CV. Score the `experience_and_projects` category PROPORTIONALLY to how the candidate's years match the requirement. Example: 1yr candidate vs 3yr required → score at ~33% of max (10/30 pts). 0yr vs 3yr or entry-level → score at 0% but give 5 pts for potential if internship role.

### SCORING RUBRIC (Max 100 Points)

1. Technical Skills (Max 40 points):
   - 40 pts: Matches all core tech stack (e.g., React, Python, FastAPI).
   - 25-35 pts: Matches major tech stack but misses 1-2 secondary libraries/tools.
   - <25 pts: Missing core programming languages or critical frameworks required.

2. Experience & Projects (Max 30 points):
   - Consider years-of-experience match proportionally as a base:
     * candidate_years / required_years × 30 (capped at 30)
   - Then adjust upward/downward based on project relevance and quality.
   - For entry-level/internship (required=0): base at 15, adjust up/down based on projects.
   - 30 pts: Outstanding practical experience directly matching the role's scope.
   - <10 pts: Little to no relevant experience, or experience far below requirement.

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

            models_to_try = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash']
            last_error = None
            for model_name in models_to_try:
                try:
                    response = self.client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config={
                            'response_mime_type': 'application/json',
                            'response_schema': JobAnalysisResponse,
                            'temperature': 0,
                        },
                    )
                    return json.loads(response.text)
                except Exception as e:
                    last_error = e
                    continue
            raise last_error

        except Exception as e:
            return {
                "error": str(e),
                "job_title": "",
                "company": "",
                "location": "",
                "score_breakdown": {"technical_skills": 0, "experience_and_projects": 0, "education_and_soft_skills": 0, "bonus_points": 0, "total_match_score": 0},
                "strengths": [],
                "missing_skills": ["System error occurred"],
                "summary": "Error during analysis execution."
            }