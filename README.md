# Beauty Salon Web (Nuxt 3)

Production-ready frontend for beauty salon, integrated with existing Laravel API.

## Stack
- Nuxt 3 (SSR enabled)
- TypeScript
- Pinia
- VueUse
- TailwindCSS

## Run (no Docker)
```bash
npm i
npm run dev
```

App runs by default at `http://localhost:3000`.

## Build for production
```bash
npm run build
npm run preview
```

## Environment
Copy `.env.example` to `.env` and set values:

```env
NUXT_PUBLIC_API_BASE=https://your-api-domain/api
NUXT_PUBLIC_SITE_URL=https://your-frontend-domain
```

## Project structure
- `pages/` routes
- `components/` UI + domain sections
- `layouts/` layout shell
- `composables/` api wrapper and shared composables
- `stores/` Pinia stores
- `types/` strict TS models
- `server/routes/sitemap.xml.ts` sitemap endpoint

## Implemented pages
- `/` home (Hero, services, masters, how-to-book, reviews, instagram mock, contacts, CTA)
- `/services` categories filter + service cards
- `/masters` service filter + masters list
- `/booking` multi-step booking wizard
- `/account/login`
- `/account/register`
- `/account/appointments`
- `/contacts`

## API mapping
- `GET /branches` -> branches store, booking step 1
- `GET /categories` -> services store
- `GET /services?category_id=` -> services store, booking step 2
- `GET /masters?service_id=` -> masters store, booking step 3
- `GET /slots?branch_id=&service_id=&master_id=&date=` -> booking step 4
- `POST /appointments` -> booking confirmation
- `GET /appointments/my` -> account appointments
- `PATCH /appointments/{id}/cancel` -> cancel action
- `POST /auth/login` / `POST /auth/register` / `POST /auth/logout` / `GET /auth/me`

## Auth behavior
- Bearer token in cookie (`auth_token`) using `useCookie`
- SSR can read cookie and restore auth
- `authStore` keeps `user`, `token`, `isAuth`

## SEO
- SSR enabled (`ssr: true`)
- per-page title/meta/OG via `useSeoMeta`
- `robots.txt` in `public/robots.txt`
- sitemap at `/sitemap.xml`

## Deploy on VPS (Node + PM2)
```bash
npm i
npm run build
npm run pm2:start
```

PM2 helpers:
```bash
npm run pm2:restart
npm run pm2:logs
npm run pm2:stop
```

PM2 config is stored in `ecosystem.config.cjs` and runs Nuxt from `.output/server/index.mjs`.
For production behind reverse proxy, point domain to app host/port (`NITRO_HOST`/`NITRO_PORT`).
