# AI Job Agent Backend

## Quick Start

Run the FastAPI server:
```
uvicorn main:app --reload
```

Check the API documentation at: http://127.0.0.1:8000/docs

Run in a virtual environment
```
# Create a virtual environment (recommended)
python -m venv .venv

# Activate the virtual environment (Git Bash / bash.exe on Windows)
source .venv/Scripts/activate

# On PowerShell (Windows) use:
# .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```