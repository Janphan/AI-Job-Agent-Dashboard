import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

class JobProcessor:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Get the API key
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        # Configure the API
        genai.configure(api_key=api_key)

    def analyze(self, cv_text: str, jd_text: str):
        try:
            # Use models/gemini-2.5-flash model with full path
            model = genai.GenerativeModel('gemini-2.5-flash')
            
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