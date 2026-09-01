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
- Remove Apify integration (`curious_coder/linkedin-jobs-scraper` cost too much)
- Remove search bar / `POST /search-jobs` — manual URL input only
- Add `location` column to `jobs` table + DB schema recreation
- AI now extracts `job_title`, `company`, `location` from JD text
- Dashboard cards show: domain badge, title, company · location, score
- DetailView changed from full-page to modal overlay
- Delete job button in detail modal (with confirmation)
- Model fallback chain: `gemini-2.5-flash-lite` → `2.5-flash` → `2.0-flash`
- README updated to match current architecture

### In Progress
-

### Known Issues
- Jobs data in `backend/data/` tracked by git (should review)
- Fly.io free tier: machines may suspend after inactivity
- Gemini API free tier quota limits — may hit 429/503 under heavy use

### Learning / Notes
- `google-genai` SDK uses `.types` for Pydantic model response
- Fly.io deploy: `working-directory` vs `--config` approach
- GitHub Actions: `FLY_API_TOKEN` secret needs org-scoped token for multi-app deploy
- Apify actor costs $0.01+ per run; not worth it for dev/testing
- `curious_coder/linkedin-jobs-scraper` has rich output fields vs `scrapier` actor
- Gemini 2.5-flash-lite: faster, cheaper, good enough for JD extraction
- Pydantic schema change + new DB column = delete `backend/data/analyses.db` to recreate
- `LanguageRequirement` nested model: use `List[BaseModel]` for structured arrays instead of flat strings
- Pydantic v2: use `@field_validator` (not the old `@validator`)
- Prompt engineering: include **negative constraints** (e.g. "do NOT score language") — LLMs will implicitly penalize without explicit prohibition
- No DB migration needed: store new fields inside existing `score_breakdown` JSON column; merge into dict before `json.dumps()`
- Always `dict.copy()` before mutating to avoid aliasing bugs in reference-passed objects
- Frontend data flow: `backend response → AddJobModal → handleJobAdded → state/localStorage → DetailModal` — trace the full chain to know where fields live
- Use safe fallback chain for optional fields: `job.x ?? job.score_breakdown?.x ?? defaultValue`
- Supabase free tier: requires `sslmode=require`; Fly.io 256MB RAM is insufficient for PG17 (OOM-kill loop)
