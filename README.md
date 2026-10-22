# TicketHub

Event ticketing platform: create events, book seats, and issue tickets through an admin approval workflow.

**Live demo** → https://ticket-hub-ten.vercel.app

## Stack

- **Next.js 15** (App Router) + **React 19**
- **MongoDB** via Mongoose
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- `bcryptjs` for password hashing, `uuid` for ticket IDs

## Features

- Public event listing and per-event booking flow
- Event-scoped login so attendees don't need a global account
- Ticket requests routed to an admin queue for **approve / reject**
- Admin dashboard with login, stats, and event settings
- Brand colour configurable through an environment variable

## Getting started

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

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB connection string |
| `ADMIN_PASSWORD` | yes | Admin dashboard password |
| `NEXT_PUBLIC_BRAND_COLOR` | no | UI accent colour |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## API routes

**Auth** — `POST /api/auth/signup`, `POST /api/auth/login`
**Admin** — `POST /api/admin/login`, `POST /api/admin/register`, `GET /api/admin/stats`
**Events** — `GET|POST /api/events`, `GET|PATCH /api/events/[eventId]`, `POST /api/events/[eventId]/login`
**Tickets** — `GET|POST /api/events/[eventId]/tickets`, `GET|PATCH /api/tickets/[ticketId]`, `POST /api/tickets/[ticketId]/approve`, `POST /api/tickets/[ticketId]/reject`
**Settings** — `GET|PATCH /api/settings`

## Structure

```
app/            routes (pages + API handlers)
  admin/        admin dashboard
  api/          route handlers
  book/         booking flow
components/     shared UI
lib/            helpers
models/         Mongoose schemas
```

---

> **Security note:** `.env.local` is currently tracked in this repository. Treat the MongoDB credentials and admin password it contains as compromised — rotate them, then remove the file from tracking and add it to `.gitignore`.
