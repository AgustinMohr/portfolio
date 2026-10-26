# Portfolio — Agustín Mohr Tschopp

Personal portfolio built with Next.js 16, React 19 and Tailwind CSS 4. The design language is dark, editorial and technical: oversized type, a restrained acid accent, fine hairlines, mono labels and subtle motion.

> New to frontend? Read [TUTORIAL.md](./TUTORIAL.md) for a beginner-oriented walkthrough in Spanish.

## Running locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open the URL printed by Next.js. If port 3000 is already in use:

```bash
npm run dev -- -p 3100
```

Production build:

```bash
npm run build
npm run start -- -p 3100
```

## Available scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript without emitting
- `npm test` — Vitest unit and component tests
- `npm run test:watch` — Vitest in watch mode
- `npm run test:e2e` — Playwright browser tests

Install Chromium once for e2e: `npx playwright install chromium`. CI runs lint, typecheck, `npm test`, build and e2e.

## Digital twin chat

The floating "Gemelo digital" chat answers questions about the profile using OpenRouter. It calls the server-only route at `src/app/api/twin/route.ts`, which streams the model response to the browser. The API key is read from `OPENROUTER_API_KEY` on the server and is never exposed to the client.

- Model: `nvidia/nemotron-3-ultra-550b-a55b:free`
- Profile facts: `profileFacts` in `src/lib/data.ts`
- Generated behavior prompt: `buildTwinPrompt` in `src/lib/twin-server.ts`
- Suggestions and shared chat types: `src/lib/twin.ts`
- Launcher and panel: `src/components/twin-chat.tsx` and `src/components/twin-chat-panel.tsx`
- The route validates the origin, applies per-client and global rate limits, reads the body with a 64 KB cap, accepts only user turns, and aborts the upstream request when the client cancels.
- The UI is honest about being an AI twin, shows the third-party privacy notice and links back to direct contact when it cannot answer.

`OPENROUTER_API_KEY` must be present in `.env` for the chat to work. The free model can be slow or rate-limited; the UI shows a waiting state and a clear retry path.

### AI endpoint protection

The route at `src/app/api/twin/route.ts` uses `src/lib/twin-guard.ts` for:

- Same-origin validation, plus optional additional origins from `TWIN_ALLOWED_ORIGINS`.
- Per-client and global rate limiting.
- Optional durable counters through the Upstash REST API.
- Cleanup of expired in-memory buckets.
- A real 64 KB streaming body limit and user-only message validation.
- Upstream abort on client cancellation, combined with the 90 second timeout.

Defaults are 30 requests per client and 120 requests globally per 10 minutes. Without a durable store, counters live in memory and are per process:

- `TWIN_TRUST_PROXY=true` must be set behind a trusted reverse proxy that overwrites `X-Forwarded-For`.
- `TWIN_TRUSTED_PROXY_HOPS=1` controls how many proxy hops are trusted when reading `X-Forwarded-For`.
- If `TWIN_TRUST_PROXY` is not enabled, all untrusted clients share one bucket. This is safe but conservative.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` enable a durable rate limit shared across instances.
- `TWIN_RATE_LIMIT`, `TWIN_RATE_WINDOW_MS` and `TWIN_GLOBAL_RATE_LIMIT` tune the limits.
- `TWIN_ALLOW_NO_ORIGIN=true` is only for local server-to-server testing. Do not use it in production.
- For a high-traffic public deployment, add a CAPTCHA (for example, Cloudflare Turnstile) and a spending cap on the AI provider. Those controls require external keys and are intentionally not enabled by default.

## Content

- `src/lib/data.ts` — profile, profile facts, navigation, timeline, stack, projects and contact links
- `src/lib/twin-server.ts` — server-only chat model and generated prompt
- `src/lib/twin.ts` — client-safe chat types and suggested questions
- `src/sections/` — hero, about, trajectory, portfolio and contact sections
- `src/components/` — header, footer, chat, contact form, copy button, reveal animations and icons
- `src/app/globals.css` — design tokens, typography and custom utilities
- `src/app/opengraph-image.tsx` — generated social sharing image

The contact form uses `mailto:` and opens the visitor's email client with the message prefilled. It has no backend and needs no credentials. The digital twin chat is separate: it requires the server-only `OPENROUTER_API_KEY`.

## Design notes

- Fonts are self-hosted at build time by `next/font` (Space Grotesk, Instrument Serif, JetBrains Mono).
- All visuals are CSS and SVG; there are no image assets to maintain.
- Scroll reveals respect `prefers-reduced-motion`.
- Content remains visible without JavaScript; a bootstrap fallback reveals all sections if hydration or client scripts fail.
- Metadata, Open Graph image, favicon, `robots.txt` and `sitemap.xml` are included. The generated OG image reads the name, headline, role, location and availability label from `profile`; it uses a system sans-serif because `next/og` cannot consume the `next/font` binaries directly. Load a `.ttf` into `ImageResponse` if brand fonts are required.
- Tailwind CSS and `@tailwindcss/turbopack` are pinned to `4.3.3`; update them together.

## Environment

- `OPENROUTER_API_KEY` — required for the digital twin chat. Used only by the server route.
- `NEXT_PUBLIC_SITE_URL` — required for production builds; sets the canonical origin used by metadata, Open Graph and JSON-LD. Local development falls back to `http://localhost:3100`.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — optional; enable durable AI rate limiting.
- `TWIN_TRUST_PROXY`, `TWIN_TRUSTED_PROXY_HOPS` — configure trusted proxy handling for client IPs.
- `TWIN_ALLOWED_ORIGINS` — optional comma-separated allowlist of additional origins.
- `TWIN_RATE_LIMIT`, `TWIN_RATE_WINDOW_MS`, `TWIN_GLOBAL_RATE_LIMIT` — tune AI rate limits.
- `TWIN_ALLOW_NO_ORIGIN` — local testing only; never enable in production.

Local configuration lives in `.env`, which is ignored by Git. Create it with `OPENROUTER_API_KEY` and `NEXT_PUBLIC_SITE_URL`; the full variable list is below. The `.gitignore` already allows a future `.env.example` if the team decides to version a template without secrets.

## Privacy

The digital twin sends the messages you type to OpenRouter, which routes them to a third-party AI model (`nvidia/nemotron-3-ultra-550b-a55b:free`). This site does not persist conversations; they live in React state for the current tab. The provider may log or retain requests according to its own policies, so do not send sensitive information.

The contact form and copy-email action only open your local mail client; they do not send data to a server.
