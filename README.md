# Portfolio — Agustín Mohr Tschopp

Mi carta de presentación profesional: quién soy, qué estudio, qué stack manejo y en qué proyectos estoy trabajando. Incluye un **gemelo digital con IA** con el que podés conversar sobre mi perfil.

El sitio se publica en **Vercel**. Este repositorio es su código fuente.

## Sobre mí

- **Nombre:** Agustín Mohr Tschopp
- **Estudios:** Ingeniería en Sistemas de Información, UTN — Facultad Regional Santa Fe (cuarto año, cursando desde 2020).
- **Ubicación:** Santa Fe, Argentina.
- **Perfil:** desarrollo de software y arquitectura de sistemas, con foco en backend y en desarrollo asistido por IA con criterio de ingeniería (Spec-Driven Development, agentes, skills, MCP, guardrails, pruebas y revisión de código).
- **Stack principal:** Java, Spring Boot, APIs REST, SQL y Git. Conocimientos complementarios de frontend e infraestructura.
- **Idiomas:** español nativo, inglés avanzado.
- **Disponibilidad:** disponible. Todavía no tengo experiencia laboral formal: mi recorrido es académico y de aprendizaje autónomo.
- **Contacto:** [agustinmohr@hotmail.com](mailto:agustinmohr@hotmail.com) · [LinkedIn](https://www.linkedin.com/in/agustin-mohr-tschopp-573806423)

## Proyectos

| Proyecto | Descripción | Tecnologías | Estado |
| --- | --- | --- | --- |
| [VigaDesk](https://github.com/AgustinMohr/vigadesk) | Plataforma B2B para corralones con gestión de clientes, pedidos, productos y obras. | Microservicios, Java, Spring Boot, SQL, NoSQL | En preparación |
| [Clase Ya](https://github.com/AgustinMohr/clase-ya) | Plataforma que conecta estudiantes con profesores particulares. | Java, Spring Boot, React, PostgreSQL | En preparación |

## Tecnologías del sitio

| Área | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, `cacheComponents`, `partialPrefetching`, Turbopack) |
| UI | React 19, Server Components por defecto |
| Lenguaje | TypeScript en modo estricto |
| Estilos | Tailwind CSS 4 (tokens con `@theme`), sin UI kit ni imágenes: solo CSS y SVG |
| Fuentes | Space Grotesk, Instrument Serif y JetBrains Mono vía `next/font` |
| IA | OpenRouter por REST (sin SDK), respuesta en streaming |
| Tests | Vitest + Testing Library (unitarios), Playwright (e2e) |
| Calidad | ESLint, `tsc --noEmit` y GitHub Actions |
| Hosting | Vercel |

Dependencias de producción: solo `next`, `react` y `react-dom`.

## Cómo está construido

- **Sitio estático:** las secciones (Hero, Sobre mí, Trayectoria, Portafolio, Contacto) se prerenderizan. El JavaScript del cliente se limita a lo que necesita estado o DOM: menú, animaciones de aparición, copiar email y chat.
- **Contenido centralizado:** todo vive en `src/lib/data.ts`. Los hechos que usa el gemelo salen de `profileFacts`, de modo que sitio y gemelo no se contradicen.
- **SEO:** `siteUrl` (`src/lib/site.ts`) es el origen único para canonical, Open Graph, JSON-LD, `robots.txt` y `sitemap.xml`. La imagen Open Graph se genera desde los datos del perfil.
- **Seguridad:** CSP y cabeceras de endurecimiento en `next.config.ts` (verificadas por test), HSTS en producción y `poweredByHeader` desactivado.
- **Accesibilidad:** enlace para saltar al contenido, `<dialog>` nativos con foco restaurado y cierre con Escape, anuncios para lectores de pantalla y respeto de `prefers-reduced-motion`.
- **Contacto:** el formulario abre tu cliente de correo (`mailto:`). No hay backend ni se guardan datos.

## Gemelo digital

1. El navegador envía solo los mensajes del visitante a `POST /api/twin`.
2. El servidor valida el origen, aplica límites de uso por cliente y globales, y lee el cuerpo con un tope real de 64 KB.
3. Descarta cualquier rol que no sea `user` y arma el prompt del sistema desde `profileFacts`.
4. Llama a OpenRouter con `stream: true` y reenvía solo el contenido de la respuesta como texto.
5. Si el cliente cancela, también se cancela la llamada a OpenRouter. Si algo falla, el chat ofrece escribirme por email.

Usa modelos **gratuitos** con respaldo: el modelo principal y `openrouter/free` (`src/lib/twin-server.ts`). El prompt prohíbe inventar experiencia, edad, salario o proyectos, y el gemelo se identifica siempre como IA. Puede equivocarse. La API key y el prompt son solo de servidor y no llegan al bundle del cliente. La conversación es efímera.

## Despliegue en Vercel

Configurá estas variables en *Project Settings → Environment Variables*:

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Sí con dominio propio | Origen público del sitio (por ejemplo `https://agustinmohr.com`). Si falta, se usa el dominio de producción de Vercel (`VERCEL_PROJECT_PRODUCTION_URL`); si tampoco existe, el build falla. |
| `OPENROUTER_API_KEY` | Sí, para el chat | Clave de OpenRouter. Solo servidor; nunca con prefijo `NEXT_PUBLIC_`. |
| `TWIN_TRUST_PROXY` | Recomendada | `true` en Vercel. Sin ella todos los visitantes comparten un único cupo de consultas. |
| `TWIN_TRUSTED_PROXY_HOPS` | No | Cantidad de proxies de confianza (por defecto `1`). |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (o `KV_REST_API_URL`, `KV_REST_API_TOKEN`) | Sí en producción | Límite de uso compartido entre instancias. Sin ellas el límite es por instancia serverless y no protege el chat en Vercel; el servidor lo advierte en los logs. |
| `TWIN_RATE_LIMIT`, `TWIN_GLOBAL_RATE_LIMIT`, `TWIN_RATE_WINDOW_MS` | No | Límites (por defecto 30 por cliente, 120 global, ventana de 10 min). |
| `TWIN_ALLOWED_ORIGINS` | No | Orígenes extra permitidos para `/api/twin`, separados por coma. |

`.env.example` lista las mismas variables. El archivo `.env` real y `Profile.pdf` están fuera de git.

## Limitaciones conocidas

- **Cupo global del chat:** toda consulta al gemelo cuenta contra el límite global (120 por 10 minutos por defecto), aunque después falle la validación. Un abuso sostenido puede agotar el cupo para todos. Con Upstash el contador es compartido entre instancias; si esto ocurre en la práctica, la mitigación es sumar un CAPTCHA (por ejemplo Cloudflare Turnstile) o subir `TWIN_GLOBAL_RATE_LIMIT`.
- **Año del pie de página:** el sitio es estático y el año (`siteYear`) se calcula al construir. Cambia recién en el siguiente deploy después del 1 de enero.
- **Modelos gratuitos:** el gemelo depende de la disponibilidad y los límites de los modelos gratuitos de OpenRouter, y puede tardar o fallar en horas pico. En ese caso el chat ofrece escribirme por email.

## Calidad

GitHub Actions ejecuta en cada push y pull request tres jobs en paralelo:

- **Calidad:** `npm run lint`, `npm run typecheck` y `npm run coverage` (Vitest con umbrales sobre `src/lib`).
- **Auditoría:** `npm audit` de dependencias de producción (bloquea en `main`, avisa en pull requests).
- **E2E:** build, escaneo del bundle y de las páginas prerenderizadas (`scripts/scan-bundle.mjs`, busca claves y el prompt del sistema) y `npm run test:e2e` en Chromium y WebKit, con accesibilidad (axe), responsive, navegación, contenido, chat y cabeceras de seguridad. Si falla, sube trazas y el reporte HTML.

Las acciones están fijadas por SHA y Dependabot las mantiene al día. Se recomienda activar protección de rama en `main` exigiendo estos jobs.

## Privacidad

- Los mensajes del chat se procesan con OpenRouter y un modelo de IA de terceros. Este sitio no los guarda.
- El sitio no usa cookies de seguimiento ni analítica.
- Mi email aparece públicamente porque es mi canal de contacto.

## Estructura

```
src/app/          rutas, layout, metadatos, API del gemelo (api/twin)
src/sections/     Hero, Sobre mí, Trayectoria, Portafolio, Contacto
src/components/   header, footer, chat, utilidades de UI
src/lib/          datos, prompt y reglas del gemelo, helpers
e2e/              pruebas de extremo a extremo
```
