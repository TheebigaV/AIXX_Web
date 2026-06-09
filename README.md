# AIXX Full Stack Project

This repository contains a full-stack application for the AIXX project.

## Project structure

- `AIXX_Web/be-aixx/` - Laravel backend application
- `AIXX_Web/fe-aixx/` - Next.js frontend application

## Backend (Laravel)

The Laravel app lives in `AIXX_Web/be-aixx/`.

### Setup

```bash
cd AIXX_Web/be-aixx
composer install
copy .env.example .env
php artisan key:generate
```

### Database

Configure `.env` for your database connection, then run:

```bash
php artisan migrate
```

Run either script from `AIXX_Web/be-aixx/` with:

```bash
php seed_ai_hardware.php
# or
php seed_ai_hardware_root.php
```

### Start backend server

```bash
php artisan serve
```

## Frontend (Next.js)

The frontend app lives in `AIXX_Web/fe-aixx/`.

### Setup

```bash
cd AIXX_Web/fe-aixx
npm install
```

### Start frontend server

```bash
npm run dev
```

## Notes

- Root-level `resources/` has been moved into the Laravel app under `AIXX_Web/be-aixx/resources/`.
- The main Laravel app root is `AIXX_Web/be-aixx`, so backend commands should be run from that directory.
- The frontend directory is `AIXX_Web/fe-aixx` and uses Next.js with Tailwind CSS.
