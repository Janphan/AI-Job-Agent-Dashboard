import google.generativeai as genai
import os
from dotenv import load_dotenv

class JobProcessor:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Get the API key
        api_key = os.getenv("GEMINI_API_KEY")
        print(f"DEBUG: API Key loaded: {api_key[:10]}..." if api_key else "DEBUG: No API key found")
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        # Configure the API
        genai.configure(api_key=api_key)

    def analyze(self, cv_text: str, jd_text: str):
        try:
            # Use models/gemini-2.5-flash model with full path
            model = genai.GenerativeModel('models/gemini-2.5-flash')
            
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

            response = model.generate_content(prompt)
            return {"analysis": response.text}
            
        except Exception as e:
            return {"error": str(e)}