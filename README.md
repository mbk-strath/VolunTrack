# VolunTrack

VolunTrack is a volunteer management application consisting of a Laravel backend and a React frontend. The backend provides REST APIs for opportunities, participations (check-in/check-out), authentication (Laravel Sanctum), and administration features. The frontend is a React app that consumes the backend APIs.

This repository contains two main folders:

- `backend/` - Laravel 11 application (API).
- `frontend/` - React application (Vite) used by volunteers and admins.

For detailed developer setup and API documentation, see `backend/README.md` and `backend/Api Documentation.md`.

## Quick start (development)

Backend (Laravel):

1. Copy and edit the environment file:

   ```bash
   cp backend/.env.example backend/.env
   # edit backend/.env to set DB and mail credentials
   ```

2. Install dependencies and prepare the app:

   ```bash
   cd backend
   composer install
   php artisan key:generate
   php artisan storage:link
   php artisan migrate
   php artisan serve
   ```

Frontend (React):

1. Install dependencies and start dev server:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Ensure `VITE_API_BASE_URL` in `frontend/.env` points to the running backend API (for example `http://127.0.0.1:8000`).

## Project structure (high level)

- `backend/app` - Laravel application code (models, controllers, providers, services).
- `backend/routes` - API routes and web routes.
- `frontend/src` - React source files, components, pages, and services.

## License / Distribution

The backend of this repository includes the following license statement (copied from `backend/README.md`):

> Copyright © 2025 VolunTrack. All rights reserved.
>
> This project is developed by VolunTrack and is not licensed for public distribution or use without permission.

If you need a different license or permission to redistribute/use this project, please contact the project owner or maintainers.

## Contact / Maintainers

If you need help or permission to use or distribute this project, contact the repository owner or the VolunTrack maintainers listed in the project.

---

(For full backend setup instructions and API details, see `backend/README.md`.)
