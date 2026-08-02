# HISWA-RECRON Career Discovery Game

> **"Beleef de Recreatiebranche"** — A gamified career discovery experience for youth aged 14–20.
> Built for the UMM Hackathon (72-hour challenge), partnered with **Helden Inc**.

**Live Preview:** [hiswa-recron.vercel.app](https://hiswa-recron.vercel.app/)

---

## About

The Dutch recreation and water sports sector employs thousands across **28+ distinct roles** — from harbour masters and boat mechanics to event planners and social media managers. Yet few young people see it as a career path. This game changes that.

**HISWA-RECRON** asked for **one product** that works through two doors:

| Door | Context | Access |
|------|---------|--------|
| 🏢 **LOBX Career Fair** | Loud, crowded — scan a QR code and play | `?mode=stan` |
| 🏫 **School classroom** | Self-paced — receive a single link from an MBO teacher | `?mode=school` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Vite + React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State** | Zustand v5 |
| **i18n** | react-i18next (Dutch primary, English fallback) |
| **Animations** | Framer Motion |
| **PWA / Offline** | vite-plugin-pwa (Workbox) |
| **Icons** | Material Symbols (Google Fonts) |
| **Backend** | Supabase (Postgres + Auth) |
| **Serverless** | Vercel Functions (`/api/track`, `/api/stats`) |
| **Hosting** | Vercel |

---

## Quick Start

```bash
git clone https://github.com/Khairulumam92/hiswa-recron.git
cd hiswa-recron
npm install
cp .env.example .env.local  # fill in your Supabase credentials
npm run dev
```

### Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── admin/                    # Admin panel (Supabase auth required)
│   ├── AdminLayout.tsx       # Sidebar shell + auth guard
│   ├── AdminLogin.tsx        # Email/password login
│   ├── AdminDashboard.tsx    # Anonymous stats dashboard
│   ├── AdminScenarios.tsx    # Scenario list + search/delete/toggle
│   └── AdminScenarioEditor.tsx # CRUD form for scenarios
├── app/
│   └── AppShell.tsx          # Game shell (mode detection, routing)
├── game/
│   ├── engine/ResultCalculator.ts  # Top role matching algorithm
│   ├── hooks/                # useGameLoop, useIdleReset, useCounterSync
│   └── store/                # Zustand store + types
├── components/
│   ├── game/                 # IntroScreen, MapScreen, ScenarioCard, RoleRevealModal
│   ├── layout/               # SiteHeader, SiteFooter, IdleOverlay
│   ├── navigation/           # QRCodeModal, MijnPadModal, BadgesModal
│   └── results/              # ResultScreen
├── content/
│   ├── roles/                # 16 role JSON files
│   ├── scenarios/            # 15 scenario JSON files (static fallback)
│   ├── locales/              # nl.json + en.json
│   └── mapZones.ts           # Interactive map zone definitions
├── lib/                      # api, auth, supabase, analytics, i18n, constants
└── main.tsx                  # Entry point (BrowserRouter + lazy routes)
api/
├── track.ts                  # POST /api/track — anonymous aggregate counter
└── stats.ts                  # GET /api/stats — reads aggregate data
```

---

## Admin Panel

Access at **`/admin`** — requires Supabase authentication.

### Setup

1. Create a [Supabase](https://supabase.com) project
2. Run `supabase_migration.sql` in the SQL Editor (creates tables + seeds 16 roles)
3. Run `supabase_seed_scenarios.sql` (seeds 15 scenarios + 56 answer options)
4. Go to Authentication → Users → Add admin user (email + password)
5. Set environment variables in Vercel / `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Features

- **Dashboard** — total sessions, completion rate, top roles
- **Scenarios** — list, search, toggle active, edit, delete
- **Scenario Editor** — CRUD form with role-based answer options

---

## Privacy (AVG / GDPR)

- ❌ No accounts, emails, or personal data for players
- ❌ No third-party tracking
- ✅ Anonymous aggregate counters only
- ✅ Nickname is optional and session-only (never stored)
- ✅ Zero cookies

---

## License

MIT
