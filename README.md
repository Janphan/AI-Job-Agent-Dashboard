
  # AI Job Agent Dashboard

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-latest-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-yellow.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.60-2E8B57.svg)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A modern full-stack application for AI-powered job matching with automated job scraping, intelligent analysis using Google Gemini, and an intuitive React dashboard for job seekers.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [How to Use](#how-to-use)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Data Pipeline](#data-pipeline)
- [Categories](#categories)
- [Data Schema & Customization](#data-schema--customization)
- [User Experience](#user-experience)
- [Development](#development)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)

## Demo

## Features

- **AI-Powered Job Analysis**: Google Gemini integration for intelligent job matching
- **Automated Job Scraping**: Playwright-based web scraping for comprehensive job listings
- **Smart Match Scoring**: AI-generated compatibility scores with detailed explanations
- **Resume Processing**: PDF resume analysis and skill extraction
- **Interactive Dashboard**: Modern React interface with job cards and detailed views
- **Real-time Data**: Live job data updates through FastAPI backend
- **Responsive Design**: Optimized for desktop and mobile devices

## Architecture

The application follows a full-stack architecture with separate backend and frontend:

### Backend (Python/FastAPI)
- **Framework**: FastAPI for high-performance API development
- **AI Engine**: Custom job analysis engine with multiple components:
  - **Scraper**: Playwright-based web scraping for job listings
  - **Processor**: Google Gemini API integration for job analysis
  - **Utils**: PDF processing and text cleaning utilities
- **Data Storage**: JSON-based storage for job listings
- **Environment**: Secure API key management with .env files

### Frontend (React)
- **Framework**: React with JSX for component-based UI
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling
- **Components**: Modular components for job cards, sidebar, and analysis views

### Data Flow
1. Backend scrapes job listings using Playwright
2. Jobs are processed through Gemini API for AI analysis
3. Processed data is stored in JSON format
4. Frontend fetches and displays job data with match analysis

## Project Structure

```
ai-job-agent/
├── backend/                # Python backend with FastAPI
│   ├── main.py             # FastAPI application with routes
│   ├── engine/             # AI Agent engine
│   │   ├── scraper.py      # Job scraping using Playwright
│   │   ├── processor.py    # AI processing with Gemini API
│   │   └── utils.py        # PDF reading and text cleaning
│   ├── venv/               # Python virtual environment
│   ├── .env                # Environment variables (GOOGLE_API_KEY)
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
├── src/                    # React frontend application
│   ├── components/         # React components
│   ├── services/           # API service layer
│   ├── styles/             # CSS styles
│   ├── App.jsx             # Main React application
│   └── main.tsx            # Application entry point
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── package.json            # Node.js dependencies
└── README.md               # Project documentation
```

## Data Pipeline

The data pipeline consists of several stages:

1. **Job Scraping**: Playwright scrapes job listings from various sources
2. **AI Processing**: Gemini API analyzes job requirements and generates match scores
3. **Data Storage**: Processed jobs are stored in JSON format
4. **API Serving**: FastAPI serves job data to the frontend
5. **Frontend Display**: React components render job listings with analysis

### Key Components:
- **Scraper** (`backend/engine/scraper.py`): Automated job collection
- **Processor** (`backend/engine/processor.py`): AI-powered job analysis
- **Storage** (`backend/data/jobs.json`): Persistent job data storage

## Categories

Jobs are displayed with match score categories:
- **High Match (90%+)**: Violet colored scores
- **Good Match (80-89%)**: Cyan colored scores
- **Fair Match (70-79%)**: Green colored scores
- **Low Match (<70%)**: Amber colored scores

## Data Schema & Customization

The core data structure is defined in `src/app/types/job.ts`:

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  logo?: string;
  whyMatch: string[];
  missingKeywords: string[];
  description: string;
  requirements: string[];
  posted: string;
}
```

## User Experience

- **Two-Panel Layout**: Sidebar for job list, main panel for details
- **Interactive Selection**: Click job cards to view details
- **Visual Match Indicators**: Color-coded match scores
- **Responsive Layout**: Adapts to different screen sizes
- **Dark Theme**: Modern dark UI with violet accents
- **Loading States**: Simulated analysis with loading indicators

## Development

### Backend Development
- **Language**: Python 3.8+
- **Framework**: FastAPI
- **Key Dependencies**: Playwright, Google Gemini API
- **Environment**: Virtual environment recommended
- **API Documentation**: Available at `http://localhost:8000/docs` when running

### Frontend Development
- **Language**: JavaScript (JSX)
- **Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Scripts**:
  - `npm run dev` - Start development server
  - `npm run build` - Build for production

### Current Status
- ✅ Frontend: Complete React application with job display
- ✅ Backend: FastAPI server running with all endpoints
- ✅ Job scraping: Playwright-based scraper for job URLs
- ✅ AI processing: Google Gemini API integration
- ✅ PDF resume processing and text extraction
- ✅ API integration: REST endpoints for CV upload and job analysis

## Deployment

The project is deployed on **Fly.io** with two separate apps:

| App | URL |
|-----|-----|
| Frontend | [ai-job-agent-dashboard.fly.dev](https://ai-job-agent-dashboard.fly.dev) |
| Backend | [backend-ai-job-agent-dashboard.fly.dev](https://backend-ai-job-agent-dashboard.fly.dev) |

### GitHub Actions (CI/CD)

On every push to `main` or `enhancement`, the workflow `.github/workflows/fly-deploy.yml` automatically deploys both apps:

- **Deploy frontend** — builds and deploys from the root `Dockerfile` and `fly.toml`
- **Deploy Backend to Fly.io** — builds and deploys from `backend/Dockerfile` and `backend/fly.toml`

#### Required GitHub Secrets

| Secret | Value |
|--------|-------|
| `FLY_API_TOKEN` | Fly.io deploy token |

To create the token:
```bash
flyctl auth login           # Login via browser
flyctl auth token           # Print token to copy
```

Then add it at: GitHub repo → Settings → Secrets and variables → Actions → **New repository secret** → Name: `FLY_API_TOKEN`

### Manual Deploy

```bash
# Frontend
flyctl deploy --remote-only

# Backend
flyctl deploy --remote-only --config backend/fly.toml backend/
```

## Future Improvements

- [ ] Connect frontend to backend API
- [ ] Add user authentication and profiles
- [ ] Implement advanced filtering and search
- [ ] Add job application tracking
- [ ] Real-time notifications for new matches
- [ ] Multi-language support
- [ ] PWA capabilities for mobile experience

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- Google Gemini API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   echo "GOOGLE_API_KEY=your_key_here" > .env
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Full Application
- Backend API will be available at `http://localhost:8000`
- Frontend will be available at `http://localhost:5173`
- Make sure both servers are running for full functionality

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## Testing

No automated tests are currently implemented. Future updates will include:
- Unit tests with Jest and React Testing Library
- Integration tests
- E2E tests with Playwright or Cypress

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
