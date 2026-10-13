# Deployment cheat sheet

## A. Deploy React frontend to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
5. Add environment variable:
   - `VITE_API_URL` = `https://YOUR-BACKEND-DOMAIN/api`
6. Deploy. After changing environment variables, redeploy.

The included `frontend/vercel.json` handles client-side route fallback.

## B. Deploy Laravel API

Deploy the Laravel app separately to a PHP-compatible host (for example Render with a PHP/Docker setup, Railway, or a VPS). Provision a managed database and set these environment variables on the host:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:GENERATE_A_REAL_KEY
APP_URL=https://YOUR-BACKEND-DOMAIN
FRONTEND_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
DB_CONNECTION=mysql
DB_HOST=...
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...
```

Set `APP_KEY` by running `php artisan key:generate --show` locally and securely copying the value to the host. Do not commit secrets. Run migrations during deployment:

```bash
php artisan migrate --force
```

Make sure the host serves Laravel's `public/` directory and forwards requests to `public/index.php`. Add your production Vercel origin to `config/cors.php` (or use `FRONTEND_URL` as configured).

## C. Can the whole Laravel app be hosted on Vercel?

This starter configures Vercel for the **React frontend**. Laravel is a traditional PHP application and requires a compatible PHP runtime and careful serverless configuration; a normal Laravel deployment is not a one-click Vercel deploy. For a timed lab exam, the dependable pattern is **Vercel (React) + PHP host (Laravel API) + external database**. If your instructor specifically requires all code on Vercel, confirm the permitted PHP runtime/build approach first.
