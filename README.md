# Porikors

A full-stack course management platform where teachers create courses, manage grades, share resources, post announcements, and assign tasks — while students join via a course code to submit work and track their progress.

Built as a single Next.js codebase (frontend + backend via Server Actions and Route Handlers), backed by PostgreSQL.

---

## Overview

Porikors supports three roles, each gated behind an approval pipeline and route-level middleware:

- **Teacher** — creates and manages courses, posts announcements, uploads resources, creates tasks/assignments with deadlines, grades submissions, and manages a marks table per course.
- **Student** — joins courses via a 6-character join code, views resources/announcements, submits tasks (files/text) before deadlines, and tracks grades across all enrolled courses from a single dashboard.
- **Admin** — reviews and approves/rejects role verification requests, and manages platform-level oversight of teachers and students.

---

## Features

### Teacher
- Dashboard with live stats, upcoming deadlines, recent announcements, and course overview
- Course creation with an auto-generated, collision-safe join code
- Grades — table-based marks management per course, with optimistic-locked inline editing
- Resources — upload or link videos, notes, and slides, scoped globally or per-course
- Announcements — post updates globally or to a specific course
- Tasks — create assignments with deadlines, allowed file types, and optional attachments
- Submissions — view, download, and grade student submissions per task, with resubmission requests

### Student
- Dashboard — aggregated view of deadlines, recent grades, and recent announcements across all courses
- Join a course via a 6-character code
- View resources and announcements, both global and course-specific
- Submit tasks (file or text) before the deadline, with live submission status (submitted / late / graded)
- View grades per course, broken down by assessment component
- Profile and settings

### Admin
- Verification queue for incoming teacher/student role requests
- Detail view before approving or rejecting each request
- Teacher and student directories with lazy-loaded detail views

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Database | PostgreSQL ([Neon](https://neon.tech), serverless-friendly pooled connections) |
| Styling | Tailwind CSS v4 (inline design tokens, no `tailwind.config.ts`) |
| UI Components | shadcn/ui (built on Base UI) |
| Authentication | NextAuth.js v4 (JWT strategy — Google OAuth + Credentials) |
| Data Fetching / Caching | TanStack Query |
| Animation | Framer Motion |
| File Storage | Cloudinary (uploads for resources, task attachments, profile images) |
| Toasts | Sonner |
| Deployment | Vercel |

---

## Architecture

Every feature follows the same layered structure, in this order:

1. **Database schema** — tables and indexes in PostgreSQL
2. **Types** — shared TypeScript interfaces in `types/`
3. **Route Handler** (`app/api/.../route.ts`) — reads/writes the database, returns camelCased JSON
4. **Thin fetcher** (`lib/api/`) — a plain `fetch()` + JSON parse, no logic
5. **Server Actions** (`lib/actions/`) — `"use server"` mutations, returning a discriminated union (`{ success: true, data } | { success: false, error }`)
6. **Client component** — owns `useQuery` / `useMutation`, lives at the list/grid level
7. **Presentational components** — dumb, receive props only, no data fetching
8. **`page.tsx`** — a thin Server Component that checks the session and renders the client shell; no direct database calls

**Authorization is two-layered:**
- **Middleware** (proxy) enforces authentication and role-based route access at the edge.
- **Server Actions and Route Handlers** independently re-verify ownership on every mutation (e.g. a teacher can only grade submissions for courses they own), since the client is never trusted.

---

## Design System

**Palette** — Paper & Ink, applied via inline hex values (no Tailwind config):

| Role | Hex |
|---|---|
| Ink (text) | `#1C2420` |
| Paper (background) | `#F6F5F1` |
| Border / muted | `#DAD7CE` |
| Primary (teal) | `#1F6F5C` |
| Primary hover | `#175446` |
| Attention (amber) | `#D98B3F` |
| Success (sage) | `#3B8F5C` |
| Danger (coral) | `#C1443D` |

**Fonts** — Inter for UI/body text, Geist Mono for code and submission previews.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (Neon recommended for both local and production use)
- A Google Cloud OAuth 2.0 Client ID/Secret
- A Cloudinary account

### 1. Clone and install

```bash
git clone https://github.com/tahmid-khan-hub/Porikors.git
cd Porikors
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```dotenv
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_-base64_32

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Set up the database

Run the schema against your PostgreSQL instance (via the Neon SQL Editor, `psql`, or pgAdmin). The schema includes: `users`, `courses`, `enrollments`, `announcements`, `assessment_components`, `grades`, `tasks`, `submissions`, `resources`, and `role_verifications`, with indexes on the columns each dashboard/list query filters or sorts by.

### 4. Configure Google OAuth

In the [Google Cloud Console credentials page](https://console.cloud.google.com/apis/credentials), add an authorized redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add all environment variables listed above under **Settings → Environment Variables**, using your production database connection string and a freshly generated `NEXTAUTH_SECRET`.
4. Deploy once to obtain your production domain, then set `NEXTAUTH_URL` to that domain and redeploy.
5. Add the production callback URL to Google Cloud Console:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```

---

## Project Structure

```
app/
├── (public)/       # landing, login, register + all API route handlers
├── (teacher)/      # teacher dashboard, courses, grades, tasks, resources
├── (student)/      # student dashboard, courses, submissions, resources
├── (admin)/        # verification queue, teacher/student directories
└── onboarding/     # role selection + verification submission flow

components/
├── teacher/        # teacher-facing UI, grouped by feature
├── student/        # student-facing UI, grouped by feature
├── admin/          # admin-facing UI
├── shared/         # cross-role components (tables, filters, search)
└── ui/             # shadcn/ui primitives

lib/
├── actions/        # Server Actions ("use server" mutations)
├── api/            # thin client-side fetchers
├── authOptions.ts  # NextAuth config
└── postgresql.ts   # pg Pool singleton

types/              # shared TypeScript interfaces
```

Each role's routes, components, and API handlers are grouped together so a feature can be found in one place — e.g. everything about teacher-side grading lives under `app/(public)/api/teacher/courses/[id]/`, `components/teacher/courses/grades/`, and `lib/actions/gradeActions.ts`.

---

## Roadmap

- [ ] Auto-graded code submissions (sandboxed test-case execution)
- [ ] Attendance tracking
- [ ] Enrollment cap per course
- [ ] Notify user for role approval (teacher/student)
- [ ] Audit trail for grade changes (who / when / old value / new value)
- [ ] Real-time announcements (WebSocket/pub-sub)

---

## Live Link
[porikors](https://porikors.vercel.app)
