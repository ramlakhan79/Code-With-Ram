# Code With Ram: client (Phases 1 to 8)

React + Vite + Tailwind. Talks to the Phase 1 server over cookie auth.

```bash
cd client
cp .env.example .env
npm install
npm run dev          # http://localhost:5173 (proxies /api to http://localhost:5000)
npm run build
```

Run the server first (`cd ../server && npm run dev`).

## Deploying
See `../DEPLOYMENT.md`. In short: set the root directory to `client`, edit the API address in `vercel.json`, and leave `VITE_API_URL` as `/api` so Vercel proxies API calls and cookies stay first-party.

## Notes
- Theme (light, dark, system) is saved in localStorage for guests and in the database once logged in.
- Global search arrives in a later phase. Notifications are live (polled every 60 seconds, no paid real-time service).
- Article pages set title, description, Open Graph, Twitter and canonical tags, plus Article structured data.
- Route guards hide pages for UX; the API enforces every permission.

## Phase 3 pages
`/courses`, `/courses/:slug`, `/courses/:slug/learn/:lessonId`, `/certificates/:code`, `/dashboard/courses`, `/dashboard/instructor/{courses,courses/create,courses/:id,students,analytics}`, `/admin/courses`.

Videos are pasted links (YouTube, Vimeo or a direct .mp4), which costs nothing to host. The course builder reorders with up/down buttons, which also works for keyboard and screen reader users.

## Phase 4 pages
`/practice`, `/practice/:slug`, `/dashboard/submissions`, `/dashboard/suggest-problem`, `/admin/problems`, `/admin/problems/new`, `/admin/problems/:id`, `/admin/submissions`.

The editor is Monaco, loaded on demand from a public CDN by `@monaco-editor/react` (the first problem page visit needs internet access to that CDN). Code drafts are kept in the browser per problem and language.

## Phase 5 pages
`/contests`, `/contests/:slug`, `/contests/:slug/problems/:label`, `/dashboard/contests`, `/admin/contests`, `/admin/contests/new`, `/admin/contests/:id`.

The contest problem page reuses the Practice workspace (`ProblemWorkspace`) with hints and the editorial turned off. Countdowns use the server clock (`useServerClock`) and the leaderboard polls every 15 seconds while the contest is live. Times in the admin editor use your browser's time zone.

## Phase 6 pages
`/discussions`, `/discussions/ask`, `/discussions/:slug`, `/discussions/:slug/edit`, `/admin/reports`. Bookmarks (`/dashboard/bookmarks`) now has Articles and Questions tabs, and public profiles show community stats.

The admin area now opens for anyone with at least one admin-level permission (so moderators can reach Reports). Each page still checks its own permission, and the API enforces everything again.

## Phase 7 pages
`/search`, `/leaderboard`, `/dashboard/achievements`. The navbar and dashboard header have a search box (a keyboard-friendly combobox with recent searches and live suggestions; guests keep recents in the browser, signed-in users on the server), and public profiles show level, points and badges.

## Phase 8 pages
Public: `/about`, `/contact`, `/roadmaps`, `/interview-preparation`, `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, `/newsletter/confirm`, `/newsletter/unsubscribe`. Admin: `/admin/analytics`, `/admin/audit-logs`, `/admin/settings`, `/admin/notifications` (announcements), `/admin/feedback`, `/admin/newsletter`. Settings has a "Your data" section for export and account deletion.

Also new: the announcement banner, maintenance page, cookie consent (analytics load only after a yes), installable app (manifest, service worker and offline page in `public/`), and a daily challenge on the Practice page. The legal pages are templates to review with a lawyer.
