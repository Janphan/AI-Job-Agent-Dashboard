# AI Job Agent Backend

Python 3.12+ backend with FastAPI, Playwright scraping, and Google Gemini analysis.

## Quick Start

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install

# Set your API key
echo "GOOGLE_API_KEY=your_key_here" > .env

# Start the server
uvicorn main:app --reload
```

Check the API documentation at: http://127.0.0.1:8000/docs

## Environment variables / API keys

Do NOT commit secrets to the repository. Add any API keys or secrets to a local `.env` file that is git-ignored.

1. Copy the example file at the project root to a real `.env` (or create `backend/.env`):

```bash
# create backend/.env manually if it does not exist yet
echo "GOOGLE_API_KEY=YOUR_REAL_KEY_HERE" > .env
```

2. Edit the file and set your real key (do NOT paste it into the repo or a commit):

```bash
# Example (Linux/macOS)
printf "GOOGLE_API_KEY=YOUR_REAL_KEY_HERE\n" > backend/.env

# PowerShell (Windows)
# "GOOGLE_API_KEY=YOUR_REAL_KEY_HERE" | Out-File -Encoding ASCII backend\\.env
```

The backend accepts `GOOGLE_API_KEY` first, and falls back to `GEMINI_API_KEY` for older local setups.

3. The repository already ignores `.env` and `backend/.env` via `.gitignore`, so the file will not be committed.

If you have already committed a secret, remove it from git history before pushing (ask if you want help).
