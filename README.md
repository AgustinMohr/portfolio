# Portfolio — Agustín Mohr Tschopp

Portfolio personal con un gemelo digital basado en IA. Next.js 16 (App Router), React 19, TypeScript, Tailwind 4.

## Desarrollo

```bash
npm install
cp .env.example .env   # completar OPENROUTER_API_KEY
npm run dev -- -p 3100
```

| Comando | Qué hace |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run test:e2e` | Playwright (puerto 3211; la primera vez `npx playwright install chromium`) |
| `npm run build && npm run start -- -p 3100` | Producción local |

El build de producción exige `NEXT_PUBLIC_SITE_URL`.

## Variables de entorno

Ver `.env.example`. Resumen:

- `OPENROUTER_API_KEY` (servidor): habilita el gemelo digital. Sin ella el chat responde con error y ofrece el email.
- `NEXT_PUBLIC_SITE_URL`: origen público, usado en canonical, Open Graph, JSON-LD, robots y sitemap.
- `TWIN_RATE_LIMIT`, `TWIN_GLOBAL_RATE_LIMIT`, `TWIN_RATE_WINDOW_MS`: límites de consultas.
- `TWIN_TRUST_PROXY=true` (y `TWIN_TRUSTED_PROXY_HOPS`): obligatorio detrás de un proxy; sin esto todos los visitantes comparten un solo cupo.
- `TWIN_ALLOWED_ORIGINS`: orígenes extra permitidos para `/api/twin`.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`: rate limit durable opcional (en memoria por defecto).

## Gemelo digital

El cliente envía solo mensajes del visitante a `POST /api/twin`. El servidor valida origen y límites, arma el prompt desde `profileFacts` (`src/lib/data.ts`) y transmite la respuesta de OpenRouter. Usa modelos gratuitos con fallback (`src/lib/twin-server.ts`). El estado de la conversación es efímero.

## Privacidad

- Los mensajes del chat se procesan con OpenRouter y un modelo de IA de terceros; no se guardan en este sitio.
- El formulario de contacto abre tu cliente de correo (`mailto:`); no tiene backend ni credenciales.
- `.env` y `Profile.pdf` están fuera de git.

## Actualizar el contenido

Editar `src/lib/data.ts`. Los hechos que usa el gemelo están en `profileFacts`.
