# Development Log

## Branches
- `main` — production-ready
- `enhancement` — active development

## 2026-06

### Done
- Migrate backend Gemini SDK → `google-genai`
- Refactor JobProcessor to use Pydantic structured outputs
- Fix scraper error handling for bot-protected sites
- UI shows nested score breakdown from Pydantic output
- Fly.io deployment (frontend + backend)
- GitHub Actions CI/CD for both apps
- Chromium browser install in backend Dockerfile
- PDF CV upload with status tracking

### In Progress
-

### Known Issues
- Jobs data in `backend/data/` tracked by git (should review)
- Fly.io free tier: machines may suspend after inactivity

### Learning / Notes
- `google-genai` SDK uses `.types` for Pydantic model response
- Fly.io deploy: `working-directory` vs `--config` approach
- GitHub Actions: `FLY_API_TOKEN` secret needs org-scoped token for multi-app deploy
