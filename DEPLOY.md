# Deploying rr-insights to Cloudflare Pages

rr-insights uses a Cloudflare Pages Function (`functions/api/claude.js`) to proxy
requests to the Anthropic API. This means the API key stays server-side and
the Ask Claude feature works without CORS issues.

## One-time setup (5 minutes)

### 1. Connect repo to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create a project
2. Connect your GitHub account → Select `soleyromit/rr-insights`
3. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**

### 2. Set the API key
1. In Cloudflare Pages → your project → **Settings → Environment variables**
2. Add: `ANTHROPIC_API_KEY` = your Anthropic API key
3. Set for both **Production** and **Preview** environments
4. Click **Save**

### 3. Redeploy
Trigger a new deployment (push a commit or click **Retry deployment**).
The `/api/claude` endpoint will now be live.

## How it works

```
Browser → /api/claude (Cloudflare Worker) → api.anthropic.com
                   ↑
           API key lives here only
           (Cloudflare env var — never sent to browser)
```

- `functions/api/claude.js` is picked up automatically by Cloudflare Pages
- It adds the `x-api-key` header server-side before forwarding to Anthropic
- Free tier: 100,000 requests/day — more than enough for personal use
- No CORS issues: the Worker adds permissive CORS headers for the static site

## Rate limiting (optional)

To prevent accidental runaway usage, add a Cloudflare WAF rule:
- Go to your domain → Security → WAF → Rate limiting rules
- Limit `/api/claude` to e.g. 20 requests per minute per IP

## Local development

For local dev, either:
1. Use Wrangler: `npx wrangler pages dev dist` (runs the Worker locally)
2. Or temporarily hardcode a direct fetch to `api.anthropic.com` in AskClaudeView.tsx
   (revert before committing)

## Keeping GitHub Pages

You can keep GitHub Pages active — it just won't have the Ask Claude feature
working (the `/api/claude` endpoint won't exist there). All other views work fine.
