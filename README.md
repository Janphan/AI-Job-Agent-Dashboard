
# AI Job Agent Dashboard

[![Python](https://img.shields.io/badge/Python-3.14+-blue.svg)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-latest-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-yellow.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.60-2E8B57.svg)](https://playwright.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Paste a job URL, upload your CV, and get an intelligent match analysis from Google Gemini. Track your analysis history, scores, and application status on an interactive dashboard.

## Features

- **AI-Powered Job Analysis**: Google Gemini (2.5-flash-lite / 2.5-flash) evaluates your CV against any job description
- **URL Scraping**: Playwright-based scraping from any job board (LinkedIn, JobTeaser, etc.)
- **PDF CV Upload**: Drag-and-drop PDF upload with text extraction
- **Smart Match Scoring**: 100-point rubric with category breakdowns (Technical Skills, Experience, Education, Bonus)
- **Job Status Tracking**: Saved → Applied → Interviewing → Rejected
- **Database Persistence**: SQLite via SQLAlchemy — all analyses saved and reloaded
- **Responsive Dashboard**: Dark theme with semantic design tokens, WCAG AA contrast

## Architecture

```
┌──────────────┐     ┌──────────────────────────────────────┐
│  Frontend    │     │  Backend (FastAPI)                    │
│  React/Vite  │────▶│  /analyze    — AI analysis           │
│  Tailwind 4  │     │  /jobs       — list all jobs          │
│  :5173       │     │  /extract_pdf — PDF text extraction   │
└──────────────┘     │  /analyses/{id} — update status       │
                     │  SQLite DB ← SQLAlchemy ORM           │
                     └──────────────────────────────────────┘
```

### Backend
- **Framework**: FastAPI
- **AI**: Google Gemini (`google-genai` SDK) with Pydantic structured outputs
- **Scraper**: Playwright-based, auto-scrapes job URLs
- **Database**: SQLite via SQLAlchemy, tables `jobs` + `analyses`
- **Documents**: `docs/design.md` — design token reference, `docs/development.md` — dev log

### Frontend
- **Build**: Vite 6 + React 18
- **Styling**: Tailwind CSS 4 with `@theme inline` design tokens (`theme.css`)
- **Components**: `JobAnalyzer.jsx` (feed + detail modal), `AddJobModal.jsx` (URL + CV input)

## Project Structure

```
ai-job-agent/
├── backend/                # Python FastAPI backend
│   ├── main.py             # App routes — /analyze, /jobs, etc.
│   ├── database.py         # SQLAlchemy engine/session config
│   ├── models.py           # ORM models: Job, Analysis
│   ├── engine/
│   │   ├── scraper.py      # Playwright web scraper
│   │   ├── processor.py    # Gemini AI analysis
│   │   └── utils.py        # PDF reader, text cleaning
│   ├── data/               # SQLite DB (analyses.db) created at runtime
│   ├── venv/               # Python virtual environment
│   ├── .env                # GEMINI_API_KEY=your_key
│   └── requirements.txt
├── src/
│   ├── components/
│   │   ├── JobAnalyzer.jsx  # Main dashboard — feed + detail modal
│   │   └── AddJobModal.jsx  # URL + CV input modal
│   ├── styles/
│   │   └── theme.css        # Design tokens (surface, text, score, etc.)
│   ├── App.jsx
│   └── main.tsx
├── .github/workflows/
│   └── fly-deploy.yml       # CI/CD to Fly.io
├── index.html
├── vite.config.ts
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.14+
- Node.js 18+
- Google Gemini API key ([get one free](https://aistudio.google.com/apikey))

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium        # Install Playwright browser
echo "GEMINI_API_KEY=your_key_here" > .env
venv/bin/uvicorn main:app --reload --port 8000
```

API docs available at `http://0.0.0.0:8000/docs`.

### Frontend Setup

```bash
# In project root (separate terminal)
npm install
npm run dev
```

Open `http://0.0.0.0:5173` — both servers must be running.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/analyze` | Analyze job URL/text with CV → saves to DB |
| `GET` | `/jobs` | List all analyzed jobs |
| `GET` | `/jobs/{id}` | Job detail with all analyses |
| `PATCH` | `/analyses/{id}?status=` | Update status (Saved/Applied/Interviewing/Rejected) |
| `DELETE` | `/jobs/{id}` | Delete job and its analyses |
| `POST` | `/extract_pdf` | Extract text from PDF CV |

## Match Score Categories

| Score | Label | Color |
|-------|-------|-------|
| 90%+ | Excellent Match | `text-score-excellent` |
| 75–89% | Strong Match | `text-score-strong` |
| 60–74% | Good Match | `text-score-good` |
| 40–59% | Fair Match | `text-score-fair` |
| <40% | Low Match | `text-score-low` |

## Design System

Semantic design tokens are defined in `src/styles/theme.css` via `@theme inline`:

- `surface-*` — backgrounds (page, card, modal, input, elevated)
- `text-*` — foregrounds (heading, body, muted, placeholder)
- `interactive-*` — buttons/links (primary, ghost, hover states)
- `status-*` — status colors (success, warning, error, info)
- `score-*` — match score colors (excellent, strong, good, fair, low)
- `border-*` — borders (default, active)
- `focus-ring` — focus ring

See `docs/design.md` for full token table and accessibility checklist (WCAG AA).

## Deployment

The project deploys to **Fly.io** via GitHub Actions (push to `main` or `enhancement`).

### Required GitHub Secrets

| Secret | Value |
|--------|-------|
| `FLY_API_TOKEN` | Fly.io deploy token |

```bash
flyctl auth login
flyctl auth token   # Copy output → GitHub repo Settings → Secrets
```

### Manual Deploy

```bash
flyctl deploy --remote-only                                    # Frontend
flyctl deploy --remote-only --config backend/fly.toml backend/  # Backend
```

## License

MIT
