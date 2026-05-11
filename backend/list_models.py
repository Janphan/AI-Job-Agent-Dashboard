from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

try:
    models = client.models.list()
    print("Available models:")
    for model in models:
        print(f"- {model.name}")
except Exception as e:
    print("ERROR:", str(e))