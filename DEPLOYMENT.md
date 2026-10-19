# Deployment: Cloudflare Workers

This app uses TanStack Start with a Nitro/Cloudflare build. The Wrangler configuration points at the generated server entry and public assets.

## 1. Configure build variables

In GitHub, open **Settings → Secrets and variables → Actions → Variables** and add:

- `VITE_SUPABASE_URL`: your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: your Supabase publishable/anon key

These are public client configuration values and are embedded in the browser bundle.

## 2. Configure Cloudflare

Create a Cloudflare Workers API token with permission to deploy Workers and set the GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

In Cloudflare Workers → `nohith-portfolio` → Settings → Variables and Secrets, configure the server-side values:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (secret; never expose to the browser)
- `EMAILJS_PRIVATE_KEY` (optional, if your EmailJS configuration requires it)
- `LOVABLE_CRON_SECRET` and `LOVABLE_CRON_SECRET_PREVIOUS` only if scheduled/cron endpoints are used

Do not commit a real `.env` file or put private values in variables prefixed with `VITE_`.

## 3. Deploy

1. Merge the reviewed deployment pull request into `main`.
2. Open **Actions → Deploy to Cloudflare Workers → Run workflow**.
3. Run the workflow on `main`.
4. Open the workflow run and confirm the deploy step succeeds. The site will be available at the Worker URL shown by Cloudflare.

The deployment workflow is manual by design; pushes and pull requests do not deploy production automatically.

## 4. Local checks

```sh
bun install --frozen-lockfile
bun run lint
bun run test
bun run build
bun run preview:worker
```

For a production deployment from a terminal, authenticate Wrangler first, then run `bun run deploy`.
