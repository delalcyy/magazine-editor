# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
```

No test runner is configured.

## Architecture

This is a React 18 + Vite SPA (Turkish-language magazine editor). The app wraps everything in `BrowserRouter` → `AuthProvider` → `App` (route tree).

### Auth flow
`AuthContext` (`src/context/AuthContext.jsx`) is the single source of truth. It reads a JWT from `localStorage` on mount, validates it via `GET /api/auth/me`, and exposes:
- `user` — raw user object (`{ ad, soyad, email, role, aktif, bitis_tarihi }`)
- `isAdmin` — `user.role === 'admin'`
- `hasAbonelik` — `!!user.aktif` (subscription gate; checked in EditorPage before showing the form)
- `login(token, userData)` / `logout()` / `getToken()`

### Route guard pattern
`RequireAuth` and `RequireAdmin` wrappers in `App.jsx` redirect to `/giris` or `/` when the session is invalid. Add new protected routes by wrapping with the appropriate guard.

### API proxy
Vite proxies `/api/*` → `http://localhost:3001` and `/pdfs/*` → `http://localhost:3001` (see `vite.config.js`). All `fetch` calls use relative paths — never hardcode a backend host.

### Order / editor flow
`EditorPage` → `OrderForm` → submits `multipart/form-data` to `POST /api/orders/submit` (with `Authorization: Bearer <token>`). Images (`inset1`, `inset2`) are stored as base64 data-URLs in state, converted to blobs just before submit.

Questions are statically defined per category in `src/data/questions.js` (`QUESTIONS` keyed by Turkish category name). `buildEmptyAnswers(category)` initialises a `{ [questionId]: '' }` map; category change resets answers.

### Admin panel
`AdminPage` is a tabbed dashboard (`dashboard` | `kodlar` | `users` | `siparisler`). Each tab fetches its own `/api/admin/*` endpoint on activation. Subscription codes (`kodlar`) are generated server-side in batches of 100.

### Services
- `src/services/questionService.js` — `generateQuestions({ category, tone, questionCount })` → `POST /api/generate-questions` (AI-generated question suggestions, unused in current UI but available)
- `src/services/pdfService.js` — `requestPDF(formData)` → `POST /api/generate-pdf` (direct PDF generation, separate from the order flow)

### Styling
Global styles live in `src/magazine.css` and `src/form.css`. Each page has a co-located `.css` file (e.g., `EditorPage.css`, `AdminPage.css`). No CSS framework — plain CSS with BEM-like class names.
