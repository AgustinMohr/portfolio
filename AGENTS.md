<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio and digital twin — agent guide

Last reviewed: 2026-10-26.  
Primary audience: future AI coding agents and maintainers working in this repository.  
Language of the user-facing site: Spanish (Rioplatense). Code identifiers and this guide: English.

## Contents

1. Project overview
2. Code and style conventions
3. Workflow and commands
4. Architecture and key components
5. Maintenance instructions

## 1. Project overview

### Purpose

This is the personal portfolio of Agustín Mohr Tschopp, a fourth-year Systems Engineering student at UTN FRSF in Santa Fe, Argentina. The site presents:

- An editorial hero and personal positioning.
- About me and working principles.
- Professional/academic trajectory and stack.
- A future-facing portfolio section with honest “work in progress” cases.
- Direct contact and a copy-email action.
- A floating AI “digital twin” chat that answers questions about the profile using OpenRouter.

The design direction is “enterprise meets edgy”: near-black surfaces, a single acid accent, oversized typography, editorial serif italics, fine hairlines, technical mono labels, restrained motion and no external image assets.

### Current state

- Next.js 16.4.2 App Router, React 19.3, TypeScript 5, Tailwind CSS 4.
- Fully static marketing page plus one dynamic route for the AI chat.
- No UI kit, animation library, database, auth, or ORM.
- No image assets in `public/`; visuals are CSS/SVG.
- Vitest unit/component tests, Playwright e2e tests and a GitHub Actions workflow.
- The workspace is a Git repository with an initial commit (`review.md` L-12).
- The review findings H-01, H-02, M-01 through M-13 and L-01 through L-12 are resolved; inspect `review.md` before changing related code.

### Folder structure

```text
portfolio-web/
├── src/
│   ├── app/
│   │   ├── api/twin/route.ts       # streaming AI endpoint
│   │   ├── globals.css             # design system and utilities
│   │   ├── icon.svg                # favicon
│   │   ├── layout.tsx              # fonts, metadata, global chat, reveal bootstrap
│   │   ├── not-found.tsx           # 404
│   │   ├── opengraph-image.tsx     # generated social image from profile
│   │   ├── page.tsx                # home composition + JSON-LD
│   │   ├── robots.ts               # robots.txt
│   │   └── sitemap.ts              # sitemap.xml
│   ├── components/
│   │   ├── contact-form.tsx        # mailto form
│   │   ├── copy-email.tsx          # clipboard feedback
│   │   ├── cursor-glow.tsx         # pointer-follow glow
│   │   ├── icons.tsx               # inline SVG icon set
│   │   ├── local-clock.tsx         # Santa Fe time
│   │   ├── reveal.tsx              # scroll reveal wrapper
│   │   ├── scroll-progress.tsx     # top progress bar
│   │   ├── section-label.tsx       # numbered section label
│   │   ├── site-footer.tsx         # global footer
│   │   ├── site-header.tsx         # sticky nav, scrollspy, native mobile menu
│   │   ├── twin-chat.tsx           # lightweight chat launcher
│   │   ├── twin-chat-panel.tsx     # chat panel, streaming and dialog
│   │   └── twin-trigger.tsx        # contact-section chat trigger
│   ├── lib/
│   │   ├── clipboard.ts            # clipboard helper
│   │   ├── data.ts                 # profile, facts, year, nav, timeline, stack, projects
│   │   ├── json-ld.ts              # safe JSON-LD serializer
│   │   ├── mailto.ts               # mail client fallback
│   │   ├── reveal-observer.ts      # shared IntersectionObserver
│   │   ├── scroll.ts               # near-bottom check for chat autoscroll
│   │   ├── site.ts                 # canonical site URL source
│   │   ├── twin-body.ts            # byte-capped JSON body reader
│   │   ├── twin-guard.ts           # server-only origin and rate-limit guard
│   │   ├── twin-messages.ts        # user-only message validation
│   │   ├── twin-server.ts          # server-only model ID and generated prompt
│   │   ├── twin-sse.ts             # SSE parser
│   │   └── twin.ts                 # client-safe chat types, texts, event name
│   └── sections/
│       ├── about.tsx               # Sobre mí
│       ├── contact.tsx             # Contacto + chat callout
│       ├── hero.tsx                # Hero + profile card + marquee
│       ├── portfolio.tsx           # Portafolio and links
│       └── trajectory.tsx          # Trayectoria + stack
├── public/                         # intentionally empty
├── e2e/                            # Playwright browser tests
├── .github/workflows/ci.yml         # lint, typecheck, tests, build, e2e
├── .env                            # local secrets, never commit
├── next.config.ts                  # security headers and build config
├── package.json
├── package-lock.json
├── tsconfig.json
├── eslint.config.mjs
├── vitest.config.mts               # Vitest + jsdom config
├── vitest.setup.ts                 # DOM mocks and cleanup
├── playwright.config.ts            # Playwright config and dev server
├── Profile.pdf                     # source profile with PII; ignored, not served
├── README.md
├── TUTORIAL.md                     # beginner walkthrough (Spanish)
├── review.md                       # full code review and open findings
└── AGENTS.md                       # this guide
```

Unit and component tests live next to the code as `src/**/*.test.{ts,tsx}`. Browser tests live in `e2e/*.spec.ts`.

### Stack details

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16.4.2 | App Router, Turbopack, `cacheComponents: true`, `partialPrefetching: true` |
| UI | React 19.3.0 | Server Components by default; Client Components only for interactivity |
| Language | TypeScript 5.9.x | `strict: true`, path alias `@/*` |
| Styles | Tailwind CSS 4.3.x + `@tailwindcss/turbopack` | Tokens declared with `@theme` in `globals.css` |
| Fonts | `next/font/google` | Space Grotesk, Instrument Serif, JetBrains Mono; self-hosted at build |
| AI | OpenRouter REST | Model `nvidia/nemotron-3-ultra-550b-a55b:free`; no SDK |
| Icons/visuals | Inline SVG + CSS | No external images |
| Unit tests | Vitest 5 + Testing Library | jsdom, co-located tests |
| E2E tests | Playwright | Chromium, real modal/clipboard checks |
| CI | GitHub Actions | `.github/workflows/ci.yml` |
| Package manager | npm | Lockfile committed |

### Configuration files

| File | Purpose |
| --- | --- |
| `next.config.ts` | `cacheComponents`, `partialPrefetching`, Tailwind Turbopack loader and security headers |
| `tsconfig.json` | `strict: true`, `@/*` alias, Next plugin, generated route types |
| `eslint.config.mjs` | Flat ESLint config extending `eslint-config-next` core-web-vitals and TypeScript rules |
| `vitest.config.mts` | Vitest with jsdom, `@/*` alias and setup file |
| `vitest.setup.ts` | Testing Library cleanup, `matchMedia`/dialog/`IntersectionObserver` mocks |
| `playwright.config.ts` | Chromium e2e config with a dev server on port 3211 |
| `.github/workflows/ci.yml` | Runs lint, typecheck, tests, build and e2e |
| `.gitignore` | Ignores `.env*` (except a future `.env.example`), test artifacts, `.next`, logs, `*.tsbuildinfo`, `next-env.d.ts` and `Profile.pdf` (PII) |
| `.env` | Local secrets, including `OPENROUTER_API_KEY`; never commit or print |
| `package.json` | Declares `engines.node >=20.9.0`; Tailwind and its Turbopack plugin are pinned to `4.3.3` |
| `package-lock.json` | npm lockfile; keep it committed |
| `next-env.d.ts` | Generated by Next; do not edit |
| `AGENTS.md` | This guide; the `nextjs-agent-rules` block is managed by `next dev` |

Important version notes:

- Next.js 16 removed `next lint`; use `npm run lint`.
- With `cacheComponents: true`, a route segment `export const runtime = "nodejs"` is rejected. Do not re-add it to `src/app/api/twin/route.ts`.
- The installed Next docs live in `node_modules/next/dist/docs/`; trust them over older tutorials.

## 2. Code and style conventions

### Formatting

- 2-space indentation.
- Double quotes.
- Semicolons.
- Trailing commas in multiline literals and function arguments.
- One JSX prop per line when the line grows.
- Prettier is not configured; preserve the existing formatting manually.
- Application source files are intentionally comment-free; the scaffold's `/* config options here */` in `next.config.ts` is the only exception. Do not add comments unless they clarify non-obvious intent; avoid narrative comments.

### Naming and file layout

- Files and folders: `kebab-case` (`site-header.tsx`, `twin-guard.ts`).
- Components and types: `PascalCase` (`SiteHeader`, `TwinMessage`).
- Functions, variables and exported data: `camelCase` (`sendMessage`, `navItems`, `twinSuggestions`).
- Module-level constants for the AI contract use `UPPER_SNAKE_CASE` (`TWIN_MODEL`, `TWIN_MAX_MESSAGES`).
- Sections export named components: `export function Hero()`.
- App Router files use default exports only where Next requires them (`layout.tsx`, `page.tsx`, `not-found.tsx`, `opengraph-image.tsx`, routes).
- Use the `@/*` alias instead of long relative paths.
- Keep client boundaries as low in the tree as possible.

### TypeScript

- Keep `strict` mode. Avoid `any`; prefer explicit types, unions, discriminated data and `unknown` plus validation at boundaries.
- Use `as const` for static content collections where literal inference helps.
- Runtime data from the client must be validated server-side, even if a TypeScript type exists.
- Don't trust client-supplied roles, message history, origins or IP headers in the AI route.

### React and Next.js

- Server Components are the default. Add `"use client"` only for state, effects, DOM APIs, event handlers or browser storage.
- Never import `src/lib/twin-server.ts` or `src/lib/twin-guard.ts` into a Client Component. They are server-only.
- Keep reusable visual content in `src/sections` and `src/components`; keep profile content in `src/lib/data.ts`.
- Use semantic HTML (`main`, `section`, `header`, `footer`, `dl`, `label`, `button`, `a`).
- Use `next/link` for route navigation. Same-page section anchors intentionally use `<a href="#id">`.
- External `target="_blank"` links must include `rel="noreferrer"`.
- Clean up every event listener, timer, observer and abort controller in `useEffect` cleanup.
- Use `requestAnimationFrame` for focus after a panel opens/closes.
- Keep `aria-current="location"` on the active nav link.

### Styling

- Use design tokens and utilities: `bg-void`, `bg-panel`, `text-bone`, `text-ash`, `border-line`, `text-acid`.
- Raw hex values belong in `globals.css` tokens or the generated OG image, not scattered through components.
- Keep `.btn` and its variants inside `@layer components`. An unlayered `.btn` previously overrode Tailwind's `hidden` and broke responsive visibility.
- Use `.shell` for page gutters and max width; do not invent a second container.
- Use `.label`, `.hero-title`, `.section-title`, `.serif-accent` and `.dropcap` for shared typography.
- Use `.grid-lines`, `.grid-mask`, `.grain`, `.marquee`, `.pulse-dot`, `.rise`, `.twin-panel` for existing visual patterns.
- Do not reintroduce a static `js` class on `<html>`. The reveal bootstrap in `layout.tsx` adds it; content must stay visible if JavaScript fails. Keep the `.reveal-fallback` CSS and the `__portfolioRevealReady` contract. `<html>` uses `suppressHydrationWarning` because the bootstrap intentionally adds the class before hydration.
- Keep the header desktop nav at `lg` (1024 px). At `md` the logo, five links and CTA clipped.
- Keep the hero title max at `8.5rem`; larger values caused three-line wrapping at 1920 px.
- Respect `prefers-reduced-motion`; new animation must have a reduced-motion path.

### Accessibility

- Every interactive icon-only control needs an accessible name.
- Every form field needs a visible `<label>` or an `aria-label`.
- Preserve focus-visible outlines.
- Preserve the skip link and the `#contenido` target.
- The mobile menu and chat use native `<dialog>` elements with `showModal()`. Keep Escape, focus restoration, body scroll behavior and the internal close control; the native modal isolates the background.
- The chat log uses `aria-live="off"` while streaming and a separate status region announces “thinking” and the final answer once. Keep status/alert regions out of the log.
- Keep the AI twin’s “may be wrong” disclaimer and its honest identity as an AI representation.
- The copy-email live region is intentionally a separate `<span className="sr-only" role="status" aria-live="polite">`; do not put `aria-live` back on the button.

### Security and secrets

- `OPENROUTER_API_KEY` is read only in the server route. Never log, print, commit or expose it to the client.
- Never prefix a secret with `NEXT_PUBLIC_`.
- `.env` is ignored by Git. Do not add another secret file to the repo.
- `Profile.pdf` contains personal data. It is ignored by Git and not served, but it still lives in the project root; never move it into `public/` or commit it.
- Keep the origin and rate-limit guard in the AI route. Do not set `TWIN_ALLOW_NO_ORIGIN=true` in production.
- Validate all request payloads on the server; client-side types are not a security boundary.

## 3. Workflow and commands

### Requirements

- Node.js 20.9 or newer (the current environment uses Node 24).
- npm.
- A modern browser for manual verification.

### Install and run

```bash
npm install
npm run dev -- -p 3100
```

Port 3000 is used by another application in this environment, so the working local URL is typically `http://localhost:3100`. If port 3000 is free, `npm run dev` alone is fine.

### Production

```bash
npm run build
npm run start -- -p 3100
```

`next build` includes TypeScript checks. Still run `npm run typecheck` independently when diagnosing type issues.

No hosting-specific configuration is committed. Deploy to any platform that runs Next.js 16 with Node.js 20.9+ and set the environment variables in the host. Do not switch to `output: "export"`: the AI route requires a server runtime.

### Available scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server with reload |
| `npm run build` | Production build and optimization |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit and component tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright browser tests |

`npm test` runs the Vitest suite. `npm run test:e2e` runs Playwright against a dev server on port 3211; install Chromium once with `npx playwright install chromium`. CI runs lint, typecheck, `npm test`, build and e2e.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Yes for chat | Server-only OpenRouter key |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Canonical, Open Graph and JSON-LD origin; local fallback is `http://localhost:3100` |
| `TWIN_TRUST_PROXY` | Production behind proxy | Trust `X-Forwarded-For` only when a trusted proxy overwrites it |
| `TWIN_TRUSTED_PROXY_HOPS` | Optional | Default `1`; number of trusted proxy hops |
| `TWIN_ALLOWED_ORIGINS` | Optional | Comma-separated extra browser origins |
| `TWIN_RATE_LIMIT` | Optional | Per-client limit; default `30` |
| `TWIN_RATE_WINDOW_MS` | Optional | Window in ms; default `600000` |
| `TWIN_GLOBAL_RATE_LIMIT` | Optional | Global limit; default `120` |
| `TWIN_ALLOW_NO_ORIGIN` | Local tests only | Never enable in production |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optional | Durable shared rate limiting |

Defaults and behavior are documented in `README.md` and implemented in `src/lib/twin-guard.ts`.

### Verification checklist

Before declaring a change complete:

1. Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`.
2. Test at 320, 390, 768, 1024, 1440 and 1920 px.
3. Check the mobile menu with keyboard only: open, Tab/Shift+Tab, Escape, focus return, no background scroll.
4. Check the chat: open, send, stop, retry, reset, close; closing aborts the stream; confirm no origin/rate-limit errors in local normal use.
5. Check the contact form opens the mail client and copy-email reports success only when it succeeds.
6. Confirm the API key and `TWIN_SYSTEM_PROMPT` are not in `.next/static` or the client bundle.
7. Check `canonical`, `og:image` and JSON-LD against the actual origin.
8. Run `npm run test:e2e` when touching dialogs, clipboard, CSP or chat behavior.
9. If you fix an item in `review.md`, update its “Registro de avance” entry.

### Next.js specifics

- Read the version-matched docs in `node_modules/next/dist/docs/` before using a new API.
- `cacheComponents` and `partialPrefetching` are enabled in `next.config.ts`; preserve them unless explicitly changing the caching model.
- Do not add a route-level `runtime` export while `cacheComponents` is enabled.
- The AI endpoint must remain dynamic (POST route) and is not statically cached.
- Keep the `nextjs-agent-rules` block at the top of this file; `next dev` manages it.

## 4. Architecture and key components

### Rendering model

```text
Browser GET /
  -> Next.js server
     -> src/app/layout.tsx (fonts, metadata, global chat, reveal bootstrap)
     -> src/app/page.tsx (composes sections)
        -> src/sections/* (Server Components)
           -> src/lib/data.ts (profile content)
           -> small Client Component islands where interaction is needed
  -> HTML + CSS + client JS
  -> hydration of SiteHeader, Reveal, ScrollProgress, CursorGlow,
     LocalClock, ContactForm, CopyEmail, TwinChat, TwinTrigger
  -> TwinChatPanel is downloaded on first chat interaction
```

- `layout.tsx`, `page.tsx`, `sections/*`, `site-footer.tsx`, `section-label.tsx`, `icons.tsx` are Server Components.
- `site-header.tsx`, `reveal.tsx`, `scroll-progress.tsx`, `cursor-glow.tsx`, `local-clock.tsx`, `contact-form.tsx`, `copy-email.tsx`, `twin-chat.tsx`, `twin-chat-panel.tsx`, `twin-trigger.tsx` are Client Components.
- `src/app/api/twin/route.ts`, `src/lib/twin-server.ts`, `src/lib/twin-guard.ts` execute only on the server.

### Page composition

`src/app/page.tsx` renders, in order:

1. `ScrollProgress`
2. `CursorGlow`
3. `SiteHeader`
4. `<main id="contenido">` with `Hero`, `About`, `Trajectory`, `Portfolio`, `Contact`
5. `SiteFooter`
6. JSON-LD person schema

Global chrome:

- `layout.tsx` mounts `TwinChat`, the grain overlay and the reveal bootstrap.
- `SiteHeader` provides desktop nav, scrollspy, mobile full-screen menu and `aria-current`.
- `SiteFooter` contains navigation, contact links, local time and the “MOHR” watermark.

### Sections and their data

| Section | File | Content source | Notes |
| --- | --- | --- | --- |
| Hero | `src/sections/hero.tsx` | `profile`, `marqueeItems` | Profile card, time, CTAs, marquee |
| Sobre mí | `src/sections/about.tsx` | `principles` + hardcoded prose | Drop cap, editorial layout |
| Trayectoria | `src/sections/trajectory.tsx` | `timeline`, `stackGroups` | Sticky left column at `lg` |
| Portafolio | `src/sections/portfolio.tsx` | `projects`, `profile` | Cases are intentionally “En preparación” |
| Contacto | `src/sections/contact.tsx` | `profile` | Mailto form, copy email, chat callout |
| Footer | `src/components/site-footer.tsx` | `navItems`, `profile` | Local clock and watermark |

### Content model

- `src/lib/data.ts` is the primary content source for the site: `profile`, `profileFacts`, `siteYear`, nav, marquee, principles, timeline, stack and projects.
- `src/lib/twin-server.ts` builds the factual part of the AI prompt from `profileFacts` with `buildTwinPrompt(facts)`; update `profileFacts` once and both the site and the twin stay aligned.
- `src/lib/json-ld.ts` escapes the JSON-LD payload used in `page.tsx`.
- `src/lib/twin.ts` is safe for the client: chat roles, welcome text, suggestions and the `twin:open` event.
- `src/lib/twin-body.ts` reads the request body with a real byte cap.
- `src/lib/twin-messages.ts` accepts only user turns from the client.
- `src/lib/twin-sse.ts` parses OpenRouter’s SSE stream and flushes a final line without a newline.
- `src/lib/twin-guard.ts` is server-only: origin validation, trusted-proxy handling, per-client/global limits, in-memory cleanup and optional Upstash.
- `src/lib/twin-server.ts` is server-only: model ID and generated system prompt. Never import it into a client boundary.

### Design system

Defined in `src/app/globals.css`:

- Colors: `--color-void` `#08090a`, `--color-panel` `#0d0f11`, `--color-bone` `#f3f1ea`, `--color-ash` `#8f9297`, `--color-acid` `#d8ff3e`, `--color-line`, `--color-line-strong`.
- Fonts: `--font-space-grotesk`, `--font-instrument-serif`, `--font-jetbrains-mono`.
- Layout: `.shell` max width `90rem` with responsive gutters.
- Typography: `.hero-title` clamps `3rem` to `8.5rem`; `.section-title` clamps `2.45rem` to `4.6rem`; `.label`; `.serif-accent`; `.dropcap`.
- Components: `.btn`, `.btn-primary`, `.btn-ghost` inside `@layer components`; `.field`; `.link-line`.
- Effects: `.grid-lines`, `.grid-mask`, `.grain`, `.marquee`, `.rise`, `.pulse-dot`, `.twin-panel`.
- Motion: `prefers-reduced-motion` disables rise, marquee, pulse, twin panel and reveal transitions.

Responsive rules:

- Mobile-first Tailwind.
- Header switches to desktop at `lg` (1024 px).
- Hero and major sections switch to 12-column layouts at `lg`.
- Trajectory left column is sticky only at `lg`.
- Chat is full-screen below `sm` and a 400×640 panel from `sm`.
- The shell uses 1.25rem/2.5rem/4rem gutters.

### Reveal and fallback system

- `Reveal` is a Client Component that wraps blocks and adds `is-visible` when observed.
- It sets `window.__portfolioRevealReady = true` on initialization.
- If `IntersectionObserver` is unavailable or reduced motion is requested, it reveals immediately.
- All reveals share one observer from `src/lib/reveal-observer.ts`; do not create a per-block observer.
- `layout.tsx` runs a `next/script` `beforeInteractive` bootstrap:
  - Adds `js` to `<html>`.
  - Adds `reveal-fallback` after 2.5s if the app has not marked itself ready.
  - Adds `reveal-fallback` on `error` (capture) and `unhandledrejection`.
- CSS `.js.reveal-fallback .reveal` forces opacity 1 and no transform.
- Do not reintroduce a static `js` class; it caused content to remain invisible when client JavaScript failed.
- The current CSP intentionally allows inline scripts to preserve static/PPR rendering. A future nonce-based CSP would need dynamic rendering and a nonce for this bootstrap.

### AI chat architecture

1. `TwinChat` renders a lightweight floating launcher; `TwinChatPanel` is downloaded with `next/dynamic` on the first hover/focus/click.
2. `TwinTrigger` in Contact dispatches `twin:open`; `TwinChat` listens and loads the panel.
3. The client posts only the `user` history to `/api/twin`; the server also rejects any other role.
4. `route.ts` validates origin and rate limit, reads the body with a real 64 KB cap, validates user messages, calls OpenRouter with `stream: true`, parses SSE via `twin-sse.ts`, ignores `delta.reasoning`, and streams only `delta.content` as `text/plain`.
5. The client reads `response.body` with `getReader()` and updates the last assistant message; the final answer is announced once through a dedicated live region.
6. Stop and closing the panel abort the client fetch and the upstream request; retry and reset are supported; errors fall back to direct email.
7. Conversation state is ephemeral (React state only); the panel shows the OpenRouter/third-party privacy notice.

Security invariants:

- API key stays on the server.
- `TWIN_SYSTEM_PROMPT` and `twin-guard.ts` stay server-only.
- Origin must match the site or an allowed origin; `TWIN_ALLOW_NO_ORIGIN` is local-only.
- Rate limit: per-client and global, memory fallback, optional Upstash.
- Body limit is enforced on the streamed bytes, not only `Content-Length`.
- Client-supplied `assistant` turns are never trusted or forwarded.
- `X-Title` must remain ASCII; non-Latin-1 header values throw at fetch time.
- The free model can be slow or rate-limited; the UI shows a thinking state.

### Metadata and assets

- `layout.tsx` exports metadata, viewport, Open Graph and Twitter fields; the title uses `profile.name` and `profile.headline`.
- `opengraph-image.tsx` generates a 1200×630 image from `profile` (name, headline, role, location, availability label). It uses a system sans-serif because `next/og` cannot consume the `next/font` binaries; load a `.ttf` if brand fonts are required.
- `icon.svg` is the favicon.
- `page.tsx` injects a static Person JSON-LD schema through `serializeJsonLd` (`src/lib/json-ld.ts`); never pass user input there.
- `siteUrl` lives in `src/lib/site.ts`; `layout.tsx` and `page.tsx` import it so canonical, Open Graph and JSON-LD share one origin. Production builds fail if `NEXT_PUBLIC_SITE_URL` is missing or invalid.
- `robots.ts` and `sitemap.ts` also use `siteUrl`.
- `Profile.pdf` is a source document with PII, not a public asset, and is ignored by Git.

## 5. Maintenance instructions

### Add or edit a portfolio project

1. Open `src/lib/data.ts`.
2. Add an object to `projects` with `index`, `title`, `kicker`, `body`, `tags`, `status`, `href`.
3. Use a real link, or the honest “En preparación” status. Do not invent results, clients, metrics or company names.
4. Keep unique `index` values and stable `key` values.
5. Run the build and check the Portfolio section at mobile and desktop.
6. If a real case study page is added later, replace the LinkedIn link and update the “Ver perfil” CTA.

### Update personal information

Update all affected places:

- `src/lib/data.ts` (`profile`, `profileFacts`, `timeline`, `stackGroups`, `projects`). The AI prompt is generated from `profileFacts`, so do not edit the prompt facts separately. `profile.headline`, `profile.role`, `profile.availabilityLabel` and `profile.initials` feed the layout, OG image and UI.
- `src/sections/hero.tsx` if the hardcoded “Perfil / año” label or availability changes; `siteYear` is computed automatically.
- `src/sections/portfolio.tsx` if the “Actualizado · año” line changes; `siteYear` is computed automatically.
- `src/components/site-footer.tsx` if the footer copy changes; the copyright year uses `siteYear`.
- `src/app/opengraph-image.tsx` only if the OG composition changes; the content comes from `profile`.
- `src/app/layout.tsx` metadata if the description or social copy changes; the title uses `profile.name` and `profile.headline`.

After editing the AI facts, test questions about study year, experience, stack, salary expectations and contact. The current prompt is deliberately defensive; do not remove those constraints.

### Add a new section

1. Create a Server Component in `src/sections/`.
2. Give the section a unique `id` (for anchors and scrollspy).
3. Use `SectionLabel` and `Reveal` where appropriate.
4. Import and place it in `src/app/page.tsx`.
5. Add it to `navItems` in `src/lib/data.ts` if it should appear in navigation.
6. Verify the header scrollspy and mobile menu at 320–1440 px.
7. If the section is large, consider whether it should be a separate route instead of a single-page section.

### Change the visual system

1. Edit tokens in `@theme` in `src/app/globals.css`.
2. Prefer existing utilities and tokens; do not scatter raw hex values.
3. Check text contrast, focus rings and dark surfaces.
4. Update `.btn` inside `@layer components` if button behavior changes.
5. Keep `.hero-title` capped at 8.5rem and test 1920 px.
6. Keep the header breakpoint at `lg` unless the nav content changes substantially and is retested at 768/834/1024.
7. Test `prefers-reduced-motion` and keyboard focus.
8. If the brand changes, update `icon.svg`, `opengraph-image.tsx` and the acid accent together.

### Add or change a client component

- Add `"use client"` only when necessary.
- Keep it small; prefer server-rendered structure with a small interactive island.
- Clean up timers, listeners, observers and abort controllers.
- Use `requestAnimationFrame` for focus after mounting a panel.
- Preserve native dialog behavior: Escape (`onCancel`), focus restoration, body scroll lock and the internal close control.
- Never import server guards or the system prompt.
- If the component is heavy and only used on demand, use `next/dynamic` with a lightweight launcher, as `TwinChat`/`TwinChatPanel` do.

### Modify the AI twin

- Model and generated prompt: `src/lib/twin-server.ts` (`buildTwinPrompt`).
- Profile facts: `profileFacts` in `src/lib/data.ts`.
- Client-safe texts/types: `src/lib/twin.ts`.
- Launcher and UI: `src/components/twin-chat.tsx` and `twin-chat-panel.tsx`.
- Body/message validation: `src/lib/twin-body.ts` and `twin-messages.ts`.
- SSE parser: `src/lib/twin-sse.ts`.
- Origin/rate limiting: `src/lib/twin-guard.ts`.
- Route validation/stream: `src/app/api/twin/route.ts`.
- Update `profileFacts` only; the prompt is generated from it.
- Never expose the key or the prompt to the client.
- Keep the model ID centralized.
- Do not weaken origin/rate-limit protections for convenience.
- If adding a CAPTCHA/Turnstile or spending cap, document the required keys and test both enabled/disabled states. These are optional deployment controls.
- Test real replies plus tricky questions:
  - “¿Tenés experiencia laboral?”
  - “¿Cuántos años tenés?”
  - “¿Cuál es tu expectativa salarial?”
  - “¿Sos una persona?”
  - “Contame tu stack.”
  - An English question to check language switching and first-person voice.

### Change the contact form

- The current form is intentionally a `mailto:` flow; there is no backend or spam handling.
- If replacing it with a real backend, add server-side validation, rate limiting, spam protection and a privacy note.
- Keep a direct email fallback available.
- Do not put the email service secret in a client component.

### Files that must not be edited manually

- `.next/` — generated by Next.
- `node_modules/` — installed dependencies.
- `next-env.d.ts` — generated by Next.
- `.env` — local secrets; edit only to add configuration, never commit or print.
- The generated `nextjs-agent-rules` block at the top of this file is maintained by `next dev`; keep it.

### Current open findings and guardrails

The authoritative list is `review.md`. H-01, H-02, M-01 through M-13 and L-01 through L-12 are resolved; do not undo them. Only two informational items remain:

- **I-01:** verified; static HTML uses `s-maxage`, the AI route uses `no-store`.
- **I-02:** the free model can be slow or rate-limited; the UI keeps waiting and error states visible. No code action required.

When you fix an item:

1. Follow its corrective action in `review.md`.
2. Add or update the “Registro de avance” row.
3. Re-run the checks.
4. Document any deployment-specific configuration in `README.md`.

### Definition of done for future changes

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` and `npm run test:e2e` pass.
- The page is checked at 320, 390, 768, 1024, 1440 and 1920 px.
- The native mobile menu traps focus, closes with Escape and restores focus.
- The chat opens, streams, stops, retries, closes and aborts the stream without console errors.
- Copy-email feedback is truthful.
- The API key and system prompt are absent from the client bundle.
- Canonical/OG/JSON-LD use the intended origin.
- No new secret, source PDF or private file is exposed via `public/` or committed.
- `review.md` is updated if a finding was addressed.
