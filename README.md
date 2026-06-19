# Smart Gym Posture Assistant (MERN)

A full-stack posture coaching and workout tracking platform with secure role-based access and modern responsive UI.

## Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS + React Router + React Hook Form + Zod + Recharts
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT + bcrypt password hashing
- Security: Helmet, CORS allowlist, rate limiting, NoSQL injection sanitization, XSS sanitization, HPP, centralized error handling

## Features

- User and admin authentication
- Role-based access control (`user`, `admin`)
- Exercise categories (`upper body`, `lower body`)
- Exercise detail pages with step-by-step posture guidance
- Favorites management
- Completed workout tracking
- Progress dashboard with summary charts
- Admin CRUD for exercises
- Backend + frontend validation using Zod

## Project Structure

```
client/
  src/
    api/
    components/
    context/
    pages/
    types/
    utils/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    seed/
    utils/
    validators/
```

## Setup

1. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

2. Configure environment variables

- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`

3. Start MongoDB (local or cloud URI in `server/.env`)

4. Seed exercises

```bash
cd server
npm run seed
```

5. Run backend

```bash
cd server
npm run dev
```

6. Run frontend

```bash
cd client
npm run dev
```

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Exercises

- `GET /api/exercises`
- `GET /api/exercises/:id`
- `POST /api/exercises` (admin)
- `PATCH /api/exercises/:id` (admin)
- `DELETE /api/exercises/:id` (admin)

### Progress and Favorites

- `GET /api/progress/favorites`
- `POST /api/progress/favorites/:exerciseId`
- `GET /api/progress/me`
- `POST /api/progress/complete`

### Users

- `PATCH /api/users/me`


