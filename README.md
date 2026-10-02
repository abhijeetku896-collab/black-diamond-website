# Ã blãçk diãmõnd — Live Admin Ready

This package is prepared for deployment with a real server-side login and SQLite database.

## Before deployment
1. Copy `.env.example` to `.env`.
2. Set a strong `SESSION_SECRET`.
3. Set your own `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
4. Run `npm install`.
5. Run `npm start`.

## Important
Do NOT deploy with the example password. Use HTTPS in production and a persistent disk/database. For a multi-device production deployment, use a host that supports Node.js and persistent storage, or replace SQLite with a managed database.

The `public` folder contains the website + admin UI.
