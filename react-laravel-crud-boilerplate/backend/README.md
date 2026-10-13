# Laravel backend overlay

This directory contains files to merge into a fresh Laravel project created with Composer. It is not a full Laravel framework distribution; Composer should create the framework skeleton and vendor dependencies.

```bash
composer create-project laravel/laravel backend-app
```

Copy this directory's files into the matching `backend-app` paths. If your Laravel version does not have API routing enabled, run `php artisan install:api`, then merge `routes/api.php`.
