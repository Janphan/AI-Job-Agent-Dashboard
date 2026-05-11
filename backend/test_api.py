from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
print(f"API Key: {api_key[:10]}..." if api_key else "No API key found")

client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents='Say hello',
    )
    print("SUCCESS:", response.text)
except Exception as e:
    print("ERROR:", str(e))