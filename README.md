# TicketHub

Event ticketing. Someone opens an event, picks a seat, and the request lands in an admin queue where it gets approved or rejected.

**Live:** https://ticket-hub-ten.vercel.app

## What it does

- Public event pages and a per event booking flow
- Event scoped login, so an attendee does not need a global account
- Every ticket request waits for an admin decision
- Admin dashboard with login, stats and per event settings
- Brand colour driven by one environment variable

About 5,500 lines across 45 files: 16 endpoints, 5 Mongoose models, 7 components.

## Stack

Next.js 15 (App Router), React 19, MongoDB via Mongoose, Tailwind CSS, shadcn/ui on Radix primitives, bcryptjs for hashing, uuid for ticket IDs.

## Run it

```bash
npm install
```

Create `.env.local` (do not commit it):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
ADMIN_PASSWORD=<choose-a-strong-password>
NEXT_PUBLIC_BRAND_COLOR=#0f172a
```

```bash
npm run dev     # http://localhost:3000
```

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | Mongo connection string |
| `ADMIN_PASSWORD` | yes | Admin dashboard password |
| `NEXT_PUBLIC_BRAND_COLOR` | no | UI accent colour |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the build |
| `npm run lint` | ESLint |

## Endpoints

**Auth:** `POST /api/auth/signup`, `POST /api/auth/login`
**Admin:** `POST /api/admin/login`, `POST /api/admin/register`, `GET /api/admin/stats`
**Events:** `GET|POST /api/events`, `GET|PATCH /api/events/[eventId]`, `POST /api/events/[eventId]/login`
**Tickets:** `GET|POST /api/events/[eventId]/tickets`, `GET|PATCH /api/tickets/[ticketId]`, `POST /api/tickets/[ticketId]/approve`, `POST /api/tickets/[ticketId]/reject`
**Settings:** `GET|PATCH /api/settings`

## Layout

```
app/            pages and route handlers
  admin/        admin dashboard
  api/          API handlers
  book/         booking flow
components/     shared UI
lib/            helpers
models/         Mongoose schemas
```

## Known issue

`.env.local` is tracked in this repo. The Mongo credentials and admin password in it should be treated as leaked. Rotate both, then untrack the file and add it to `.gitignore`.
