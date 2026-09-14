# Expiry

Expiry creates temporary, browser-encrypted text links. Creators keep private lifecycle history; expired content cannot be recovered. Recipients never need an account.

## Run locally

```bash
pnpm install
pnpm dev
```

With blank Supabase values the app starts in an explicitly labeled same-browser demo mode. This exercises create, reveal, expiration, destruction, and history without an account. Demo links do not work across browsers or devices.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/202609140001_expiry.sql` in the SQL editor or with the Supabase CLI.
3. Keep email/password enabled under Authentication → Providers.
4. For Google login, enable Google, add its client ID/secret, and configure the callback URL Supabase displays in Google Cloud.
5. Add local and production URLs to Authentication → URL Configuration. Include `/reset-password` in the redirect allow list.
6. Copy `.env.example` to `.env` and set the values below.

| Variable | Where it is used |
|---|---|
| `VITE_SUPABASE_URL` | Browser Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser publishable key; protected by RLS |
| `VITE_APP_URL` | Absolute base URL used in share and auth redirects |
| `VITE_FORCE_DEMO` | Set `true` only to force local demo mode during UI testing |
| `SUPABASE_URL` | Server project URL |
| `SUPABASE_SECRET_KEY` | Server-only secret key; never prefix with `VITE_` |
| `RATE_LIMIT_HASH_SECRET` | Server-only random secret, at least 16 characters |

Generate the rate-limit secret with `openssl rand -hex 32` or an equivalent cryptographic generator. Never commit real values. Supabase may label older project keys `anon` and `service_role`; the publishable key belongs in the browser variable and the elevated key only in the server variable.

## Authentication

Email sign-up, sign-in, and reset requests pass through `/api/auth/email`, which applies an application rate limit before calling Supabase Auth. Google uses Supabase's OAuth redirect flow. Creator API calls send the Supabase access token and are verified server-side.

## Rate limits

- Email authentication: 10 requests per IP per 15 minutes
- Secret creation: 20 requests per user per hour
- Reveal: 60 requests per IP per 10 minutes

Raw IP addresses are never persisted. The server saves an HMAC-derived bucket key in `rate_limits`. Exceeded requests return HTTP 429 and `Retry-After`.

## Privacy model

AES-GCM encryption runs before creation leaves the browser. Supabase receives ciphertext, IV, and lifecycle metadata. The key lives only after `#` in the shared URL. The reveal function locks the row, checks the database clock, and consumes one-view messages atomically. History never contains plaintext or the encryption key.

Copy blocking on the reveal surface is only a deterrent. A recipient can still use screenshots, developer tools, extensions, accessibility tools, or another camera.

## Verify

```bash
pnpm test:run
pnpm lint
pnpm build
```

For production, deploy the folder to Vercel and add all six environment variables. The included rewrites keep SPA routes working while `api/` is deployed as Vercel Functions.
