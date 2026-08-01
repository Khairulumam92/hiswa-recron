# HISWA-RECRON Career Discovery Game

> **"Beleef de Recreatiebranche"** — A gamified career discovery experience for youth aged 14–20.
> Built for the [UMM Hackathon](https://www.hiswarecron.nl/) (72-hour challenge), in partnership with **Helden Inc**.

**Live Preview:** [hiswa-recron-omjvaahbp-khairulumams-projects.vercel.app](https://hiswa-recron-omjvaahbp-khairulumams-projects.vercel.app/)

---

## About the Project

The Dutch recreation and water sports sector employs thousands across **28+ distinct roles** — from harbour masters and boat mechanics to event planners and social media managers. Yet few young people see it as a career path. This game changes that.

**HISWA-RECRON** (the Dutch trade association for water sports and recreation businesses) asked for **one product** that works through two doors:

| Door | Context | Access |
|------|---------|--------|
| 🏢 **LOBX Career Fair** | Loud, crowded, standing, queued — scan a QR code and go | `?mode=stan` |
| 🏫 **School classroom** | Quiet, self-paced — receive a single link from an MBO teacher | `?mode=school` |

After one play session, a 15-year-old should realise: *"I didn't know 28 different jobs existed in one camping"* — and at least one role should feel like it could be theirs.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Vite + React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State management** | Zustand v5 |
| **Internationalisation** | react-i18next (Dutch primary, English fallback) |
| **Animations** | Framer Motion |
| **PWA / Offline** | vite-plugin-pwa (Workbox) |
| **Icons** | Lucide React |
| **Backend (tiny)** | Vercel Serverless Functions + Vercel KV |
| **Hosting** | Vercel (free tier) |

### Why this stack?

- **Offline-first:** The core game must work without Wi-Fi at a 30 000-visitor event hall. PWA Service Worker caches all assets.
- **Single codebase:** Two game contexts (stan / school) share the same build — only timer, pacing and depth differ.
- **Maintainable by non-devs:** All content (roles, scenarios, locale strings) lives in JSON files. Edit a JSON file, redeploy, and the game updates — no code changes needed.
- **Privacy-safe:** No accounts, no personal data collection, zero third-party tracking. Only anonymous aggregate counters via our own `/api/track` endpoint.

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Khairulumam92/hiswa-recron.git
cd hiswa-recron

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Start the dev server
npm run dev
# → opens http://localhost:5173
# → add ?mode=stan or ?mode=school to the URL
```

### Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check, then build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Architecture

```
src/
├── app/              # Application shell & routing (state-based, not React Router)
├── game/
│   ├── engine/       # Pure game logic (loop, queue, result calculation)
│   ├── hooks/        # React hooks (useGameLoop, useIdleReset, useCounterSync)
│   └── store/        # Zustand store + types + actions
├── components/
│   ├── ui/           # Atomic presentational components (Button, Card, ProgressBar, Timer)
│   ├── game/         # Game-specific components (IntroScreen, ScenarioCard, RoleRevealModal)
│   ├── layout/       # Shell components (TopBar, SiteHeader, SiteFooter, IdleOverlay)
│   └── results/      # Result screen, download, share link
├── content/
│   ├── roles/        # 28 JSON files — one per sector role
│   ├── scenarios/    # 15 JSON files — game scenarios
│   └── locales/      # nl.json + en.json — all UI strings externalised
├── lib/              # Utilities (i18n, analytics, URL params, screenshot, constants)
└── assets/           # Static images, fonts
api/
├── track.ts          # POST /api/track — anonymous aggregate counter
└── stats.ts          # GET /api/stats — read aggregate data
```

### Content-Driven Design

All game content is externalised in JSON. **Non-technical staff can update the entire experience without touching code:**

| What to change | Where | Example |
|---------------|-------|---------|
| Role names & descriptions | `src/content/roles/receptionist.json` | Edit `titleNL`, `shortDescriptionNL`, `skillsNL` |
| Game scenarios | `src/content/scenarios/S001.json` | Edit `situationNL`, `correctRoleId` |
| UI text | `src/content/locales/nl.json` | Edit any key → instant translation fix |
| Add a new role | Copy `receptionist.json` → rename → edit → rebuild | New role appears in the picker automatically |

After editing, commit and push — Vercel auto-deploys the new content.

---

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Default | Description |
|----------|---------|------------|
| `VITE_APP_DEFAULT_MODE` | `stan` | Game mode on first load (`stan` or `school`) |
| `VITE_APP_DEFAULT_LOCALE` | `nl` | Default language (`nl` or `en`) |
| `VITE_APP_FALLBACK_LOCALE` | `en` | Fallback language when key is missing |
| `VITE_APP_STAN_TIMER_SECONDS` | `120` | Round duration at the fair booth |
| `VITE_APP_SCHOOL_TIMER_SECONDS` | `180` | Round duration in classroom mode |
| `VITE_APP_IDLE_TIMEOUT_SECONDS` | `45` | Auto-reset after inactivity (stan mode only) |
| `KV_REST_API_URL` | — | Vercel KV connection (set in Vercel dashboard) |
| `KV_REST_API_TOKEN` | — | Vercel KV auth token |

---

## Privacy (AVG / GDPR)

This product serves **minors aged 14+** in the Netherlands, governed by the AVG (Dutch GDPR). We take the following measures:

- ❌ **No accounts, logins, emails, phone numbers, or real names**
- ❌ **No camera, photo, or video features**
- ❌ **No third-party analytics or tracking pixels**
- ✅ **Nickname is optional and session-only** — never stored, never sent to the server
- ✅ **Only anonymous aggregate counters** (`sessions_started`, `sessions_completed`, `role_clicked`) via our own `/api/track` endpoint
- ✅ **Zero cookies**, zero persistent local storage beyond the Service Worker cache

For a production deployment, HISWA-RECRON should additionally:
- Sign a **Data Processing Agreement (DPA)** with Vercel
- Set a **2-year retention limit** on aggregate counters
- Provide a **one-paragraph privacy notice** to schools and event organisers

---

## How the Game Works

1. **Intro screen** — large visual hook, one bold call-to-action ("Start de Uitdaging")
2. **Core loop** — scenarios appear one-by-one. The player picks which role handles each situation from 3–4 options.
3. **Role reveal** — every pick shows a short job description, skills, and education path
4. **Result** — after the timer ends, the player's "top role" is revealed with a download/shareable card
5. **Idle reset** — 45 seconds of inactivity in stan mode triggers an automatic reset

### Stan vs School Mode

| | Stan mode (QR) | School mode (link) |
|---|---|---|
| Timer | Yes (120s) | Optional (180s) |
| Auto-reset | Yes (45s idle) | Manual |
| Content depth | Short role descriptions | Extended descriptions + career paths |
| Sound | Off by default | Optional |

---

## Scoring Rubric (from the case brief)

| Criterion | Weight |
|-----------|--------|
| Appeal: do 14–20 year olds stop, play, and finish? | 25% |
| Learning outcome: sector breadth understood, one role feels personally possible | 25% |
| Reusability: one product works at the booth AND as a shareable school link | 20% |
| Event-floor readiness: fast, offline-capable, noise-proof, instant reset, non-technical staff | 15% |
| Working prototype | 10% |
| Privacy & security for minors | 5% |

---

## Deploy Your Own

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

The project is configured for zero-config Vercel deployment. The `api/` directory is automatically detected as Serverless Functions.

---

## License

MIT © [Khairulumam92](https://github.com/Khairulumam92)
