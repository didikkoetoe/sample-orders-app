Simple Orders App
=================

A full-stack sample for ordering products with a Node/Express + MongoDB backend and a Vue 3 + Vite + Tailwind frontend. Features include authentication, product browsing, cart/checkout with Indonesian address format, order history, printable invoices, and form validation via vee-validate.

Tech Stack
----------
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth
- Frontend: Vue 3, Vite, Tailwind CSS, vee-validate
- Tooling: Docker, Docker Compose

Prerequisites
-------------
- Docker and Docker Compose installed

Quick Start (Docker)
--------------------
From the repo root:

```
docker compose up --build
```

What this does:
- Builds backend and frontend images and starts services plus MongoDB
- Backend API: http://localhost:3000
- Frontend app: http://localhost:5173 (uses `VITE_API_URL=http://localhost:3000`)

Seeding Data
------------
On the first `docker compose up`, a one-time seeder runs automatically and stores a marker so it will not run again.

Seeded credentials:
- Admin: admin@example.com / password123
- User: john@example.com / password123
- User: jane@example.com / password123

To re-run the seeder manually, remove the `seed_state` volume and start again:

```
docker compose down -v
docker compose up --build
```

Common Commands
---------------
- Stop services: `docker compose down`
- Rebuild after code changes: `docker compose up --build`
- Tail logs: `docker compose logs -f`

Notes
-----
- Frontend runs Vite in dev mode inside the container with hot reload.
