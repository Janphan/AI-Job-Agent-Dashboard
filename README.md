# AI Job Agent Dashboard

![React](https://img.shields.io/badge/React-18.x-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript) ![Python](https://img.shields.io/badge/Python-3.9+-green?logo=python) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?logo=fastapi) ![Playwright](https://img.shields.io/badge/Playwright-1.40+-purple?logo=playwright) ![Vite](https://img.shields.io/badge/Vite-5.x-yellow?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-cyan?logo=tailwindcss) ![License](https://img.shields.io/badge/License-MIT-red)

A modern AI-powered job matching platform that analyzes CV compatibility with job postings using automated scraping, intelligent processing, and real-time analysis.

## Table of Contents
- [Demo](#demo)
- [Current Status](#current-status)
- [Features](#features)
- [How to Use](#how-to-use)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Development](#development)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Demo

**Figma Design**: [AI Job Agent Dashboard](https://www.figma.com/design/ZHFv0eoiNnGpbXkF4e2L5w/ai-job-agent?node-id=0-1&t=6LNqaKJm2J0I6Uhn-1)

## Current Status

### ✅ **Completed**
- **Frontend**: Complete React application with PDF upload functionality
- **UI/UX**: Modern dark theme with job analysis interface
- **File Upload**: PDF CV upload with validation
- **Backend Structure**: FastAPI project structure defined
- **Environment Config**: `.env` setup for API configuration
- **Project Architecture**: Organized backend/frontend separation

### 🔄 **In Progress** 
- **Backend Implementation**: Basic FastAPI endpoints created, needs full implementation
- **PDF Processing**: PyPDF2 integration for CV text extraction
- **Gemini AI Integration**: Configured but needs prompt optimization

### ❌ **Pending**
- **Job Scraping Engine**: Playwright scraper implementation
- **Full API Integration**: Frontend-backend connection
- **Advanced AI Analysis**: Structured JSON response parsing
- **Real-time Notifications**: Job match alerts
- **User Authentication**: Profile management system

## Features

### Current Implementation
- 📱 **Modern React Interface** with clean job analysis dashboard
- 📄 **PDF CV Upload** with file validation and processing
- 🤖 **AI Integration Ready** with Gemini API configuration
- 🎨 **Responsive Design** with Tailwind CSS dark theme
- 💾 **Environment Configuration** for different deployment stages

### Planned Features
- 🔍 **Automated Job Scraping** from multiple job board URLs
- 🧠 **AI-Powered Analysis** with detailed match scoring
- 📊 **Match Visualization** with interactive scoring displays
- 🔔 **Real-time Alerts** for new job matches
- 👤 **User Profiles** with CV management
- 📈 **Analytics Dashboard** with job market insights

## How to Use

### Current Workflow
1. **Upload CV**: Select your PDF resume file
2. **Input Job URL**: Paste job posting URL or raw job description
3. **Analyze Match**: Click analyze to process compatibility
4. **View Results**: See AI-generated match analysis

### Planned Workflow
1. **Profile Setup**: Upload CV and set preferences
2. **Job Discovery**: Automated scraping finds relevant positions
3. **Smart Matching**: AI analyzes compatibility with detailed scoring
4. **Application Support**: Generate tailored cover letters
5. **Progress Tracking**: Monitor application status and feedback

## Architecture

### Current Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + Python 3.9+
- **AI Engine**: Google Gemini API
- **File Processing**: PyPDF2 for PDF text extraction
- **HTTP Client**: Fetch API for backend communication

### Planned Components
- **Scraping Engine**: Playwright for automated job data collection
- **Database**: SQLite/PostgreSQL for job and user data persistence
- **Cache Layer**: Redis for improved performance
- **Task Queue**: Celery for background job processing

## Project Structure

```
ai-job-agent/
├── backend/                # Python FastAPI Backend
│   ├── main.py             # Main FastAPI application
│   ├── engine/             # AI Processing Engine
│   │   ├── __init__.py
│   │   ├── scraper.py      # Playwright job scraper (pending)
│   │   ├── processor.py    # Gemini AI processing
│   │   └── utils.py        # PDF text extraction utilities
│   ├── data/               # Data storage
│   │   └── jobs.json       # Job data storage
│   ├── .env                # Environment variables
│   ├── .gitignore          # Python gitignore
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Frontend (current: root directory)
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── JobAnalyzer.jsx  # Main analysis interface
│   │   ├── services/       # API communication
│   │   │   └── api.js      # Backend API calls
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # React entry point
│   ├── .env                # Frontend environment variables
│   ├── .env.example        # Environment template
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
└── README.md
```

## Development

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+ with pip
- **Git** for version control

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your Gemini API key

# Start development server
uvicorn main:app --reload
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

### Development Servers
- **Backend**: http://127.0.0.1:8000
- **Frontend**: http://localhost:5173
- **API Docs**: http://127.0.0.1:8000/docs

## Environment Setup

### Backend Environment (`.env`)
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Frontend Environment (`.env`)
```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

## API Endpoints

### Current Endpoints
- `GET /` - API health check
- `POST /analyze-pdf` - Analyze job compatibility with PDF CV upload

### Planned Endpoints
- `GET /jobs` - Fetch analyzed jobs list
- `POST /scrape` - Trigger job scraping from URLs
- `POST /analyze` - Analyze job with text input
- `GET /jobs/{id}` - Get specific job details
- `POST /generate-cover-letter` - AI-generated cover letters

## Future Improvements

### Short Term (Next Sprint)
- **Complete Backend Implementation**: Finish all API endpoints
- **Job Scraper Engine**: Implement Playwright-based scraping
- **Enhanced AI Analysis**: Structured JSON responses with scoring
- **Error Handling**: Comprehensive error management and user feedback

### Medium Term
- **Database Integration**: Persistent data storage
- **User Authentication**: Profile and session management
- **Advanced Matching**: ML-based compatibility algorithms
- **Batch Processing**: Multiple job analysis capabilities

### Long Term
- **Real-time Notifications**: WebSocket-based job alerts
- **Market Analytics**: Job market trends and insights
- **Mobile Application**: React Native mobile app
- **Enterprise Features**: Team collaboration and reporting

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-job-agent
   ```

2. **Setup Backend** (see [Backend Setup](#backend-setup))

3. **Setup Frontend** (see [Frontend Setup](#frontend-setup))

4. **Get Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create new API key
   - Add to backend `.env` file

5. **Test the Application**
   - Upload a PDF CV
   - Paste a job URL
   - Click "Analyze Job Match"
   - View AI-generated compatibility analysis

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This project is in active development. The backend implementation is currently being built, and API integration is in progress. Check the [Current Status](#current-status) section for the latest updates.
