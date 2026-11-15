# AI Intelligence Universe

An immersive 3D developer portfolio for an **AI Developer · AI Automation Engineer · Full-Stack Developer**. Visitors fly through a holographic universe built with real WebGL geometry: each project is a 3D exhibition connected to a working backend demo.

- **Frontend:** React 19, Vite, Three.js, React Three Fiber, Drei, GSAP (ScrollTrigger), Framer Motion, Tailwind CSS v4
- **Backend:** Python 3.12, FastAPI, Pydantic, SQLAlchemy (SQLite locally, PostgreSQL in production)

## What's inside

| Area                            | 3D environment                                                            | Live functionality                                                     |
| ------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Opening                         | Cinematic intro: starfield, holographic globe materialising, camera sweep | Skippable (button / Esc), plays once per session                       |
| Avalanche Intelligence Platform | Holographic mountain built from a DEM grid, scan beam, survey rings       | Slope analysis (Horn's method) and rule-based terrain assessment       |
| AI Business Automation Agent    | Point-cloud neural core with 4 workflow stages                            | Runs real triage / sales-summary workflows; 3D replays the step log    |
| AI-Enabled Car Sales Platform   | Wireframe car showroom, six body types, inventory miniatures              | Lead capture, scoring, simulated follow-ups, live pipeline             |
| AI Workflow Lab                 | Five-stage pipeline: collect → process → analyse → decide → output        | Inspect each stage, run a packet through the pipeline                  |
| Skills                          | Constellation of 8 skill areas linked by shared skills                    | Skills mapped to the projects that use them                            |
| About                           | Identity core, `identity.json` editor panel                               | Profile from `profile.js`                                              |
| Contact                         | Transmission beacon                                                       | Validated, spam-protected form stored in the database (optional email) |

Also: focus mode (click an exhibit → camera close-up, drag to rotate, wheel to zoom, Esc to exit), full case-study pages at `/projects/<slug>`, a 2D fallback (no WebGL / "3D Off"), adaptive quality for low-power devices, and reduced-motion support.

> **Honesty by design:** project statuses are configurable labels (`Prototype`, `In Development`, `Live`). The demos clearly state when data is synthetic or sample data, the agent reports that it is rule-based (no LLM yet), and no metrics or accuracy figures are invented.

## Project structure

```
AI-Developer-Portfolio/
├── frontend/                 React + Vite app (deploys to GitHub Pages)
│   ├── src/
│   │   ├── data/             ← your content: profile.js, projects.json, skills.js, workflowLab.js
│   │   ├── three/            3D scene: globe, exhibits/, environments/, camera rig, shaders/
│   │   ├── components/       HTML layer: sections, demos, HUD, intro, focus overlay
│   │   ├── pages/            Universe page, case-study page, 404
│   │   ├── store/ hooks/ lib/
│   └── vercel.json
├── backend/                  FastAPI app (deploys to Render)
│   ├── app/
│   │   ├── routes/           health, contact, projects
│   │   ├── demos/            one self-contained backend per project (avalanche, automation_agent, car_sales)
│   │   ├── models/ schemas/ services/ data/
│   ├── tests/                pytest suite
│   └── requirements.txt
├── scripts/                  cross-platform setup / dev / check scripts (npm run setup | dev | check)
├── package.json              root scripts only (no dependencies)
└── render.yaml               Render blueprint (API + PostgreSQL)
```

## 1. Run it on any computer

### What to install first (one time)

| Software    | Version            | Download                                                                      |
| ----------- | ------------------ | ----------------------------------------------------------------------------- |
| **Git**     | any recent         | https://git-scm.com/downloads                                                 |
| **Node.js** | 22 LTS (or 20.19+) | https://nodejs.org                                                            |
| **Python**  | 3.12 (3.11+ works) | https://www.python.org/downloads (Windows: tick **"Add python.exe to PATH"**) |

### Quick start (Windows, macOS and Linux)

```bash
git clone https://github.com/mtaha2588/mtaha2588.github.io.git
cd mtaha2588.github.io
npm run setup     # one time: Python environment + packages, backend/.env, frontend packages
npm run dev       # starts the backend and the website together (Ctrl+C stops both)
```

Then open **http://localhost:5173**. The API runs at http://localhost:8000 (docs at http://localhost:8000/docs).

- `npm run setup` creates `backend/.venv`, installs the exact Python package versions from `backend/requirements.txt`, copies `backend/.env.example` to `backend/.env`, and installs the frontend packages exactly as locked in `frontend/package-lock.json`.
- `npm run check` runs all quality checks: backend tests, lint, formatting and a production build.
- No database setup is needed locally: a SQLite file (`backend/portfolio.db`) is created automatically.

### Manual alternative (two terminals)

**Backend** (terminal 1):

```powershell
# Windows (PowerShell)
cd backend
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
Copy-Item .env.example .env
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

```bash
# macOS / Linux
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env
.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

**Frontend** (terminal 2, any OS):

```bash
cd frontend
npm ci
npm run dev
```

In development the frontend talks to `http://localhost:8000` automatically.

## 2. Make it yours

1. **`frontend/src/data/profile.js`**: your name, initials, email, LinkedIn, GitHub, availability, about text. Empty fields are hidden rather than shown as broken links; `npm run dev` prints a reminder of missing fields in the browser console.
2. **Résumé:** put `resume.pdf` in `frontend/public/` and set `resumeUrl: "/resume.pdf"`.
3. **`frontend/src/data/projects.json`**: project text, `status`, `links.demo`, `links.github` and `screenshots` (`[{ "src": "/projects/avalanche-1.png", "caption": "…" }]`, images in `frontend/public/projects/`). Then copy it to the backend:
   ```powershell
   cd frontend; npm run sync:projects
   ```
4. **Skills:** `frontend/src/data/skills.js`. Levels are intentionally not shown; "used in" links come from each project's `technologies`.

### Connecting your real projects later

Each project demo lives in `backend/app/demos/<project>/` (`router.py`, `schemas.py`, `service.py`). When a real project is deployed, set its URL in the backend environment and the portfolio forwards requests to it instead of the built-in demo:

```
AVALANCHE_SERVICE_URL=https://your-avalanche-api.example.com
AUTOMATION_AGENT_SERVICE_URL=
CAR_SALES_SERVICE_URL=
```

Your service must accept and return the shapes defined in that project's `schemas.py`. `/api/health` shows each demo as `built-in` or `remote`.

## 3. Quality checks

From the project root: `npm run check` (runs everything below). Or individually:

```powershell
cd frontend
npm run lint          # ESLint
npm run format:check  # Prettier
npm run build         # production build

cd ..\backend
.venv\Scripts\python -m pytest -q
```

## 4. Deploy (free)

Live site: **https://mtaha2588.github.io**, hosted free on GitHub Pages. No server is needed: the three project demos run in the visitor's browser (`frontend/src/lib/demoLocal.js`, a port of the Python rules in `backend/app/demos/`), and the contact form opens the visitor's email app with the message filled in.

### a) Publish an update

```bash
cd frontend
npm run build
```

Then publish `frontend/dist` to the `gh-pages` branch (GitHub Pages serves that branch). Ask Claude Code to "publish the site", or copy the contents of `dist/` into a checkout of the `gh-pages` branch, commit and push.

Optional automatic publishing: copy `deploy/github-pages-workflow.yml` to `.github/workflows/deploy.yml`, set Settings → Pages → Source to "GitHub Actions", and every push to `main` publishes the site. (Pushing a workflow file needs a GitHub token with the `workflow` permission: run `gh auth refresh -s workflow` once.)

The build writes one HTML file per page (so `/projects/<slug>` works on refresh), `404.html`, `sitemap.xml`, `robots.txt` and the social-preview tags (`frontend/scripts/postbuild.mjs`).

Optional build variable: `VITE_GOATCOUNTER_CODE` for free, privacy-friendly visit counts.

### b) Optional: run the FastAPI backend

The `backend/` folder still works locally (`npm run dev`) and can be hosted anywhere that runs Python (`render.yaml` is a ready blueprint). If you ever host it, build the site with `VITE_API_URL=<your API URL>` and the demos and contact form use it instead of the browser versions. It is not needed for the live site.

### c) Content you can edit without code

| File                              | What it controls                                                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/data/profile.js`    | Name, value line, links (email, LinkedIn, WhatsApp, Fiverr, Upwork, Calendly), CV, availability. Empty values stay hidden. |
| `frontend/src/data/services.js`   | Service packages, delivery times, prices (`null` shows "Custom quote"), budget options.                                    |
| `frontend/src/data/experience.js` | Experience, education, publications.                                                                                       |
| `frontend/src/data/faq.js`        | FAQ and testimonials (testimonials stay hidden while empty).                                                               |
| `frontend/src/data/projects.json` | Projects and case studies (keep `backend/app/data/projects.json` in sync). Screenshots go in `frontend/public/projects/`.  |
| `frontend/src/content/notes/*.md` | Notes/blog posts (`YYYY-MM-DD-slug.md` with front matter).                                                                 |

### Moving to a bigger database setup later

Tables are created automatically on startup (`Base.metadata.create_all`). Once the schema starts changing in production, add [Alembic](https://alembic.sqlalchemy.org/) migrations (`alembic init`, point it at `app.database.Base`) instead of relying on auto-creation.

## Troubleshooting

| Symptom                                          | Fix                                                                                                                                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run setup` says Python 3.11+ not found      | Install Python 3.12 from python.org; on Windows tick "Add python.exe to PATH", then open a new terminal.                                                                          |
| `npm run setup` says Node is too old             | Install Node 22 LTS from nodejs.org (Vite needs 20.19+ or 22.12+).                                                                                                                |
| `Port 5173` / `8000` already in use              | Close the other copy (Ctrl+C in its terminal), or use other ports: `API_PORT=8010 WEB_PORT=5180 npm run dev` (PowerShell: `$env:API_PORT=8010; $env:WEB_PORT=5180; npm run dev`). |
| Demo panels say "API offline" locally            | Start the backend on port 8000.                                                                                                                                                   |
| Browser console shows a CORS error in production | `CORS_ORIGINS` on Render must be exactly `https://mtaha2588.github.io` (no trailing slash).                                                                                       |
| Contact form offers "Send by email" instead      | The API is asleep or `VITE_API_URL` isn't set: set the repository variable and re-run the Pages workflow.                                                                         |
| 3D looks slow on a device                        | Use the **3D On/Off** switch; quality also lowers itself automatically.                                                                                                           |
| Case-study URL gives 404                         | Check the Pages workflow ran: the build writes `dist/projects/<slug>/index.html` for each project.                                                                                |
