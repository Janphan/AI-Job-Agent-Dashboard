import os
import json
from dotenv import load_dotenv

class JobProcessor:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Get the API key
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY not found in .env file")
        
        # print(f"[DEBUG] Using GEMINI_API_KEY: {api_key[:8]}...{api_key[-4:]}")

        self.client = None
        self.sdk_error = None

        try:
            try:
                from google import genai
            except ImportError:
                import google.genai as genai

            # Configure the API
            self.client = genai.Client(api_key=api_key)
        except ImportError as exc:
            self.sdk_error = exc
        except Exception as exc:
            self.sdk_error = exc

    def _mock_analyze(self, cv_text: str, jd_text: str):
        """Returns a fake response without calling the API. Enable with MOCK_AI=true in .env"""
        return {
            "match_score": 72,
            "strengths": [
                "Mock: Strong educational background",
                "Mock: Relevant project experience",
                "Mock: Good communication skills"
            ],
            "missing_skills": [
                "Mock: Docker / containerization",
                "Mock: Cloud platform experience (AWS/GCP)"
            ],
            "summary": "[MOCK MODE] This is a fake response for testing. Set MOCK_AI=false in backend/.env to use the real API."
        }

    def analyze(self, cv_text: str, jd_text: str):
        if os.getenv("MOCK_AI", "false").lower() == "true":
            return self._mock_analyze(cv_text, jd_text)

        if self.client is None:
            return {
                "error": f"Google Gen AI SDK is not available in the active Python environment: {self.sdk_error}",
                "match_score": 0,
                "strengths": [],
                "missing_skills": ["Install google-genai in the active environment"],
                "summary": "Backend started without the Gemini SDK loaded",
            }

        try:
            # Use models/gemini-2.5-flash model with full path
            prompt = f"""
You are a Senior Technical Recruiter. Compare the CV and JD provided.
Return ONLY a valid JSON object. Do not include markdown or backticks.

JSON structure:
{{
    "match_score": 60,
    "strengths": ["Directly aligns with Junior AI Engineer role", "Experience with AI/Data"],
    "missing_skills": ["Python libraries", "Cloud platforms", "Practical project experience"],
    "summary": "The candidate has a foundational interest but lacks specific technical toolsets mentioned in the JD."
}}

CV: {cv_text}
JD: {jd_text}
"""

            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'temperature': 0,
                },
            )
            
            # Parse the JSON response from Gemini and return as object (not string)
            try:
                analysis_json = json.loads(response.text)
                return analysis_json  # Return direct object, not {"analysis": "..."}
            except json.JSONDecodeError:
                # If Gemini returns invalid JSON, wrap it
                return {
                    "error": "Invalid JSON from AI",
                    "raw_response": response.text,
                    "match_score": 0,
                    "strengths": [],
                    "missing_skills": ["AI response error"],
                    "summary": "Error parsing AI analysis"
                }
            
        except Exception as e:
            return {
                "error": str(e),
                "match_score": 0,
                "strengths": [],
                "missing_skills": ["System error"],
                "summary": "Error during analysis"
            }