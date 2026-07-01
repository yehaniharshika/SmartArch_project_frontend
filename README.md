# SmartArch Frontend

React + Vite + Tailwind CSS frontend for the SmartArch floor plan analysis system.

---

## Project Structure

```
frontend/
├── index.html                        ← Root HTML (Google Fonts loaded here)
├── package.json
├── vite.config.js                    ← Dev server + API proxy to :5000
├── tailwind.config.js                ← Design tokens (stone/bronze palette)
├── postcss.config.js
├── .env.example                      ← Copy to .env
│
└── src/
    ├── main.jsx                      ← React entry — wraps app in AuthProvider
    ├── App.jsx                       ← React Router — all route definitions
    ├── index.css                     ← Tailwind + global styles, CSS variables
    │
    ├── context/
    │   └── AuthContext.jsx           ← Global auth state (user, token, login, logout)
    │
    ├── api/                          ── HTTP Layer ──
    │   ├── client.js                 ← Axios instance + JWT interceptors + refresh
    │   ├── authApi.js                ← /api/auth/* calls (register, login, refresh, me)
    │   ├── planApi.js                ← /api/plans/* calls (upload, list, get, delete)
    │   └── chatApi.js                ← /api/chat/ask + mock responses for UI mode
    │
    ├── hooks/                        ── Data Hooks ──
    │   ├── useAuth.js                ← Re-export of useAuth from context
    │   ├── usePlans.js               ← usePlans(), usePlan(id), usePlanByToken(token)
    │   └── useUpload.js              ← Upload state machine (idle→uploading→analysing→done)
    │
    ├── utils/                        ── Utilities ──
    │   ├── formatters.js             ← fmt.m2(), formatDate(), timeNow(), truncFilename()
    │   ├── validators.js             ← email, password, name validators + passwordStrength()
    │   └── constants.js              ← PIPELINE_STEPS, CHAT_SUGGESTIONS, STATUS_VARIANTS
    │
    ├── components/
    │   │
    │   ├── layout/                   ── Structural Layout ──
    │   │   ├── Navbar.jsx            ← Fixed top nav, auth-aware links, mobile menu
    │   │   ├── Footer.jsx            ← Site footer with links
    │   │   └── PageWrapper.jsx       ← Page shell (Navbar + Footer + fade-in)
    │   │
    │   ├── ui/                       ── Reusable Primitives ──
    │   │   ├── StatCard.jsx          ← Metric display card (value + unit + icon)
    │   │   ├── Badge.jsx             ← Status badge (success/pending/error/info/bronze)
    │   │   ├── LoadingSpinner.jsx    ← Animated spinner with optional label
    │   │   ├── EmptyState.jsx        ← Empty list placeholder with icon + action
    │   │   └── SectionHeader.jsx     ← Eyebrow + heading + description block
    │   │
    │   ├── upload/                   ── Upload & Analysis ──
    │   │   ├── FileDropzone.jsx      ← Drag-and-drop file picker (PNG/JPG/PDF)
    │   │   ├── AnalysisPipelineProgress.jsx ← Animated 9-step pipeline progress
    │   │   ├── DetectionCard.jsx     ← Single YOLO detection (label, dimensions, conf)
    │   │   ├── PlanCard.jsx          ← Floor plan summary card for dashboard grid
    │   │   └── ShareLinkPanel.jsx    ← Share URL display + copy button
    │   │
    │   └── chat/                     ── Chatbot ──
    │       ├── ChatBubble.jsx        ← User / assistant message bubble
    │       ├── ChatInput.jsx         ← Auto-growing textarea + send button
    │       └── SuggestionCard.jsx    ← Clickable quick-question card
    │
    └── pages/                        ── Route Pages ──
        ├── LandingPage.jsx           ← / — Hero, features, how-it-works, CTA
        ├── LoginPage.jsx             ← /login — Split-panel login form
        ├── RegisterPage.jsx          ← /register — Registration + password strength
        ├── DashboardPage.jsx         ← /dashboard — Plan grid, stats, search/filter
        ├── UploadPage.jsx            ← /upload — Drop zone + pipeline animation
        ├── ResultPage.jsx            ← /result/:id — Full analysis result view
        └── ChatPage.jsx              ← /chat/:token — Client chatbot interface
```

---

## Quick Start

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env if your backend runs on a different port
```

### 3. Start development server
```bash
npm run dev
# → http://localhost:3000
```

> **UI-only mode**: All pages work with mock data even without the backend running.
> The API calls fall back gracefully to local mock responses.

---

## Routes

| Route              | Page            | Auth   | Description                                      |
|--------------------|-----------------|--------|--------------------------------------------------|
| `/`                | LandingPage     | Public | Marketing page                                   |
| `/login`           | LoginPage       | Public | Architect login                                  |
| `/register`        | RegisterPage    | Public | Architect registration                           |
| `/dashboard`       | DashboardPage   | Auth   | Architect's plan list with stats                 |
| `/upload`          | UploadPage      | Auth   | Upload floor plan + live pipeline progress       |
| `/result/:id`      | ResultPage      | Auth   | Full analysis: detections, OCR, GPT, share link  |
| `/chat/:token`     | ChatPage        | Public | Client chatbot (no login required)               |

---

## Design System

| Token         | Value        | Usage                         |
|---------------|--------------|-------------------------------|
| `stone-900`   | `#2C2416`    | Primary text, dark surfaces   |
| `bronze`      | `#A67C52`    | Accents, CTAs, active states  |
| `arch-cream`  | `#FAF8F4`    | Page background               |
| `arch-parchment` | `#F0E8D8` | Card backgrounds              |
| Font display  | Cormorant Garamond | Headings, numbers       |
| Font mono     | DM Mono      | Labels, badges, code          |
| Font sans     | DM Sans      | Body copy, UI text            |

---

## Connecting to Backend

Once the Flask backend is running (`python app.py`), set:
```
VITE_API_URL=http://localhost:5000
```

The Vite dev proxy (`vite.config.js`) forwards `/api/*` requests automatically.

---

## Build for Production
```bash
npm run build
# Output: dist/
```
