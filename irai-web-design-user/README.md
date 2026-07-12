# IRAI — User Web Design

Desktop web prototype for the IRAI patient/member portal. Mirrors the mobile user app (`mobile-design-user`) with a layout aligned to the admin and practitioner web apps.

## Run locally

```bash
npm install
npm run dev
```

Opens at **http://localhost:3003**

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing |
| `/login`, `/signup` | Patient auth (prototype) |
| `/pricing` | Plan selection |
| `/onboarding` | Health profile & document upload |
| `/user` | Home dashboard |
| `/user/booking` | Browse practitioners by category, pick availability & slot |
| `/user/sessions` | Session list & reschedule |
| `/user/group-sessions` | Browse & join group classes |
| `/user/insights` | Wellness analytics |
| `/user/profile` | Account & settings |
| `/user/health-vault` | Medical documents |
| `/user/session-room` | Video session (full screen) |

## API alignment

Prototype flows mirror the user management API conceptually (auth, profile, practitioners, relationships, booking profiles) without surfacing endpoint paths in the UI.

## Stack

- React 19 + Vite 6 + TypeScript
- Tailwind CSS v4
- React Router 7
- Recharts (insights)
- Motion (animations)

## Deploy

Static SPA with `vercel.json` rewrite rules. Build with `npm run build`.
