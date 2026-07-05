# IRAI Web Design — Admin & Practitioner

Desktop-first web design for the IRAI wellness platform. This project is separate from the mobile prototype in `irai-mobile-design/`.

## Run locally

**Requires Node 20+** (Tailwind CSS v4 does not work on Node 18).

```bash
# If you use nvm:
nvm use          # reads .nvmrc → Node 20

npm install
npm run dev
```

## Auth (prototype)

Any email/password works. Choose role on the landing page, then sign in.

- **Practitioner** → `/practitioner`
- **Admin** → `/admin`

## Structure

```
src/
├── components/
│   ├── web/           # Global shell (sidebar, top bar)
│   ├── AdminLayout.tsx
│   └── PractitionerLayout.tsx
├── pages/
│   ├── RolePicker.tsx
│   ├── Login.tsx
│   ├── practitioner/  # Practitioner modules
│   └── admin/         # Admin modules
├── adminData.ts       # Admin mock data
└── mockData.ts        # Practitioner mock data
```

## Design phases

1. **Phase 1** — Global shell + auth ✅
2. **Phase 2** — Practitioner workspace ✅
   - Home dashboard (stats, schedule table, group session, quick access)
   - Clients (split-panel list + inline preview)
   - Client detail (full profile, AI notes, session history)
   - Schedule (week calendar + day slots + group sessions)
3. **Phase 3** — Messages, Profile, Session Room, Admin modules ✅
   - Messages (split-panel chat)
   - Profile & settings
   - Session Room (full-screen video + AI notes sidebar)
   - Admin: Bookings, Group Sessions, Therapists, Users, Disputes (data tables)

## Design tokens

| Token | Value |
|-------|-------|
| Forest | `#4a6741` |
| Cream | `#fdfcf9` |
| Terracotta | `#e8a87c` |
| Slate | `#2d3436` |

Fonts: Cormorant Garamond (headings) + Inter (UI)
