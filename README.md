
  # AI Job Agent Dashboard

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0.0-yellow.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC.svg)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40.0-2E8B57.svg)](https://playwright.dev/)
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
│   ├── main.py             # Main FastAPI application with routes
│   ├── engine/             # AI Agent engine
│   │   ├── scraper.py      # Job scraping logic using Playwright
│   │   ├── processor.py    # AI processing with Gemini API
│   │   └── utils.py        # PDF reading and text cleaning utilities
│   ├── data/               # Data storage
│   │   └── jobs.json       # Job listings storage
│   ├── .env                # Environment variables (GOOGLE_API_KEY)
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── JobCard.jsx # Job listing card component
│   │   │   ├── Sidebar.jsx # Application sidebar
│   │   │   └── AnalysisView.jsx # Job analysis view
│   │   └── App.jsx         # Main React application
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json        # Node.js dependencies
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
- ✅ Backend: FastAPI structure defined (implementation pending)
- ✅ Project structure: Organized into backend/frontend directories
- ❌ Backend implementation: Needs to be built
- ❌ API integration: Frontend needs to connect to backend
- ❌ Job scraping: Playwright scraper needs implementation
- ❌ AI processing: Gemini API integration needs setup

## Deployment

### Backend Deployment
1. Set up Python environment on your server
2. Install dependencies: `pip install -r requirements.txt`
3. Configure environment variables (API keys)
4. Run the FastAPI server: `python main.py`
5. The API will be available on the configured port (default: 8000)

### Frontend Deployment
1. Build the React application: `npm run build`
2. The built files will be in the `dist/` directory
3. Deploy the contents of `dist/` to any static hosting service
4. Configure the frontend to point to your backend API URL

### Full Stack Deployment
- Backend can be deployed to services like Railway, Render, or Heroku
- Frontend can be deployed to Netlify, Vercel, or GitHub Pages
- Ensure CORS is properly configured for cross-origin requests

## Future Improvements

- [ ] Complete backend implementation (FastAPI routes, database integration)
- [ ] Implement job scraping with Playwright
- [ ] Integrate Google Gemini API for job analysis
- [ ] Connect frontend to backend API
- [ ] Add user authentication and profiles
- [ ] Implement advanced filtering and search
- [ ] Add job application tracking
- [ ] Real-time notifications for new matches
- [ ] PDF resume processing and analysis
- [ ] Multi-language support
- [ ] PWA capabilities for mobile experience

## Getting Started

### Prerequisites
- Python 3.8+
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
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
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

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env if you need to change the API URL
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Environment Variables

#### Backend (.env)
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

#### Frontend (.env)
```env
VITE_API_URL=http://127.0.0.1:8000
```

### Full Application
- Backend API will be available at `http://127.0.0.1:8000`
- Frontend will be available at `http://localhost:5173`
- API documentation at `http://127.0.0.1:8000/docs`
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
