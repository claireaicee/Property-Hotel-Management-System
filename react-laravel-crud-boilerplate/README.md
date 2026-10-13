# React + Laravel CRUD Boilerplate (Lab Exam Starter)

A reusable **Product Inventory CRUD** starter with:
- React + Vite frontend
- Laravel REST API backend
- Create, read, update, delete products
- Search, loading/error states, validation feedback
- CORS and environment-variable examples
- Vercel frontend configuration and deployment notes

> Recommended deployment: React frontend on **Vercel**; Laravel API on **Render/Railway** (or another PHP host); database on a managed MySQL/PostgreSQL provider. Vercel is primarily a frontend/serverless platform, and a normal Laravel app needs PHP runtime and persistent external database support. This repo includes a Vercel config for the React app, not a claim that Laravel automatically runs on Vercel.

## 1. Folder structure

```text
react-laravel-crud-boilerplate/
├── frontend/                 # deploy this folder to Vercel
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json
│   └── ...
├── backend/                  # Laravel API (create with Composer)
│   ├── app/Http/Controllers/Api/ProductController.php
│   ├── app/Models/Product.php
│   ├── database/migrations/...
│   ├── routes/api.php
│   ├── config/cors.php
│   ├── .env.example
│   └── ...
└── DEPLOYMENT.md
```

## 2. Requirements

- PHP version supported by your Laravel version, Composer, Node.js LTS, npm
- MySQL or PostgreSQL (SQLite is fine for local practice)
- Laravel project created using Composer

## 3. Setup backend (Laravel)

The `backend/` directory contains **overlay files** for a Laravel project. To make a complete Laravel skeleton, run:

```bash
composer create-project laravel/laravel backend-app
```

Copy the files from this repo's `backend/` folder into the matching locations in `backend-app/` (merge/replace when prompted). Then:

```bash
cd backend-app
cp .env.example .env
php artisan key:generate
```

Configure `.env` database values. For a quick local setup, SQLite is easiest:
1. Create `database/database.sqlite` (empty file).
2. Set `DB_CONNECTION=sqlite` in `.env` and remove/comment the other `DB_*` values if your Laravel version expects that.
3. Run:

```bash
php artisan migrate
php artisan serve
```

API runs at `http://127.0.0.1:8000/api/products`.

## 4. Setup frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL=http://127.0.0.1:8000/api` in `frontend/.env`. Open the URL printed by Vite (usually `http://localhost:5173`).

## 5. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | List products; optional `?search=pen` |
| POST | `/api/products` | Create product |
| GET | `/api/products/{id}` | Show one product |
| PUT/PATCH | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

Product fields: `name`, `sku`, `category`, `quantity`, `price`, `description`.

## 6. Adapt for other exam topics

Rename `Product` to `Student`, `Book`, `Employee`, `Course`, etc. Update:
- model + migration fields
- controller validation rules
- API route resource name
- frontend form fields and displayed columns
- `api.js` resource path

Common mapping:
- School: Student (`student_number`, `first_name`, `last_name`, `course`, `year_level`, `email`)
- Library: Book (`isbn`, `title`, `author`, `category`, `copies`)
- Inventory: Product (`sku`, `name`, `category`, `quantity`, `price`)

## 7. Common issues

- **CORS error:** set `FRONTEND_URL` and update `config/cors.php`; clear config cache after changes.
- **404 API:** verify `routes/api.php` and that Laravel API routing is installed. Recent Laravel versions include API routes when `php artisan install:api` is run; if absent, run that command, then merge this `routes/api.php`.
- **Database error:** verify `.env`, database exists, and migrations have run.
- **Vercel frontend shows blank:** set Root Directory to `frontend`; build command `npm run build`; output directory `dist`; set `VITE_API_URL` to your deployed backend URL plus `/api`.
- Never commit real `.env` secrets or database passwords.
