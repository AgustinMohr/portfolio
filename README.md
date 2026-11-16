# Agustín Mohr Tschopp

**Estudiante de Ingeniería en Sistemas de Información · Desarrollo de software con foco en backend**

Santa Fe, Argentina · UTN Facultad Regional Santa Fe

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/agustin-mohr-tschopp-573806423)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/AgustinMohr)
[![Email](https://img.shields.io/badge/Email-agustinmohr%40hotmail.com-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:agustinmohr@hotmail.com)
[![CV](https://img.shields.io/badge/CV-PDF-2B2B2B?style=flat)](public/CV-AGUSTIN-MOHR.pdf)

<!-- TODO: agregar el badge y el enlace al portfolio publicado cuando exista la URL definitiva (agustinmohr.com). -->

Este repositorio es el código de mi portfolio personal, con un **gemelo digital** (un chat con IA) que responde sobre mi formación, mi stack y mi forma de trabajar.

---

## Sobre mí

Curso el cuarto año de Ingeniería en Sistemas de Información en la UTN FRSF, donde empecé en 2020. Me interesa el backend, la arquitectura de software y las APIs REST, y trabajo con IA como herramienta de ingeniería: especificaciones antes de implementar, agentes con contexto, *guardrails*, pruebas y revisión de código, no generar código sin control.

Todavía no tengo experiencia laboral formal. Mi recorrido es académico y de aprendizaje autónomo, y lo documento en proyectos con código público. Busco mi primera oportunidad en un equipo donde pueda aportar y aprender de gente con oficio. Hablo inglés a nivel avanzado: leo documentación técnica y me comunico en equipos multiculturales.

## Tecnologías

| Área | Tecnologías |
| --- | --- |
| Backend | ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=springboot&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat&logo=nodedotjs&logoColor=white) |
| Frontend | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) |
| Datos | ![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) |
| Herramientas | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) |

Mi foco de aprendizaje: **arquitectura de software**, **APIs REST**, buenas prácticas, automatización y **desarrollo asistido por IA** (Spec-Driven Development, agentes de programación, MCP y *guardrails*).

## Proyectos

| Proyecto | Qué es | Tecnologías | Estado |
| --- | --- | --- | --- |
| [**VigaDesk**](https://github.com/AgustinMohr/vigadesk) | Plataforma B2B para corralones: gestión de clientes, pedidos, productos y obras. | Microservicios, Java, Spring Boot, SQL, NoSQL | En preparación |
| [**Clase Ya**](https://github.com/AgustinMohr/clase-ya) | Plataforma que conecta estudiantes con profesores particulares. | Java, Spring Boot, React, PostgreSQL | En preparación |
| **Este portfolio** | Sitio personal con un gemelo digital con IA. | Next.js, React, TypeScript, Tailwind CSS | Publicado en Vercel |

Los casos de estudio se publican cuando el código, las decisiones y los resultados están listos para mostrarse. No incluyo métricas ni clientes que no existan.

## En qué estoy trabajando

- **VigaDesk y Clase Ya:** preparar sus repositorios y documentación.
- **Este portfolio:** pruebas, seguridad, SEO y puesta en producción (el historial de commits lo muestra).

## Sobre este repositorio

Un sitio estático con una sola ruta de API para el chat. Las decisiones que más me importaron:

- **Poca superficie:** la única dependencia de producción además de `react` y `react-dom` es `next`. Sin UI kit ni imágenes: todo es CSS y SVG.
- **Un solo lugar para el contenido:** `src/lib/data.ts`. Lo que sabe el gemelo sale de los mismos datos que el sitio, así que no se contradicen.
- **Gemelo digital con límites:**
  - El navegador envía solo mensajes del visitante y el servidor descarta cualquier otro rol.
  - Valida el origen, limita el uso por cliente y de forma global, y acota el cuerpo a 64 KB.
  - La respuesta llega en *streaming* desde OpenRouter, con modelos **gratuitos** y un respaldo.
  - La clave y el prompt del sistema son solo de servidor; el CI verifica que no lleguen al bundle del cliente.
  - El prompt prohíbe inventar experiencia, edad, salario o proyectos, y el gemelo siempre se identifica como IA.
- **Accesibilidad:** enlace para saltar al contenido, diálogos nativos `<dialog>` con foco restaurado y cierre con Escape, anuncios para lectores de pantalla y soporte de `prefers-reduced-motion`.
- **Seguridad:** CSP y cabeceras de endurecimiento verificadas por test.
- **Contacto sin backend:** el formulario abre tu cliente de correo (`mailto:`); no se guardan datos.

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, `cacheComponents`, `partialPrefetching`, Turbopack) |
| UI | React 19, Server Components por defecto |
| Lenguaje | TypeScript en modo estricto |
| Estilos | Tailwind CSS 4 con tokens (`@theme`) |
| Fuentes | Space Grotesk, Instrument Serif y JetBrains Mono con `next/font` |
| IA | OpenRouter por REST, sin SDK |
| Tests | Vitest y Testing Library, Playwright, `@axe-core/playwright` |
| Hosting | Vercel |

### Calidad

GitHub Actions ejecuta en cada push y pull request tres jobs en paralelo:

- **Calidad:** ESLint, `tsc --noEmit` y Vitest con umbrales de cobertura sobre `src/lib`.
- **Auditoría:** `npm audit` de dependencias de producción (bloquea en `main`, avisa en pull requests).
- **E2E:** build de producción, escaneo del bundle (`scripts/scan-bundle.mjs`) y pruebas de Playwright en Chromium, WebKit y emulación móvil: accesibilidad con axe, responsive, navegación, contenido, chat y cabeceras de seguridad. Si fallan, suben trazas y el reporte HTML.

Las acciones están fijadas por SHA y Dependabot las mantiene al día.

### Estructura

```
src/app/          rutas, layout, metadatos, API del gemelo (api/twin)
src/sections/     Hero, Sobre mí, Trayectoria, Portafolio, Contacto
src/components/   header, footer, chat, descarga del CV, utilidades de UI
src/lib/          datos, prompt y reglas del gemelo, helpers
e2e/              pruebas de extremo a extremo
scripts/          escaneo del bundle
public/           CV en PDF
```

<details>
<summary><strong>Despliegue en Vercel</strong></summary>

Configurá estas variables en *Project Settings → Environment Variables*:

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Sí con dominio propio | Origen público del sitio (por ejemplo `https://agustinmohr.com`). Si falta, se usa el dominio de producción de Vercel (`VERCEL_PROJECT_PRODUCTION_URL`); si tampoco existe, el build falla. |
| `OPENROUTER_API_KEY` | Sí, para el chat | Clave de OpenRouter, dedicada y con límite de crédito. Solo servidor; nunca con prefijo `NEXT_PUBLIC_`. |
| `TWIN_TRUST_PROXY` | Recomendada | `true` en Vercel. Sin ella todos los visitantes comparten un único cupo de consultas. |
| `TWIN_RATE_SALT` | Recomendada | Texto secreto largo y aleatorio. Se usa como sal al hacer el hash de las direcciones antes de guardarlas en el límite de uso. |
| `TWIN_TRUSTED_PROXY_HOPS` | No | Cantidad de proxies de confianza (por defecto `1`). |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (o `KV_REST_API_URL`, `KV_REST_API_TOKEN`) | Sí en producción | Límite de uso compartido entre instancias. Sin ellas el límite es por instancia serverless y no protege el chat; el servidor lo advierte en los logs. |
| `TWIN_RATE_LIMIT`, `TWIN_GLOBAL_RATE_LIMIT`, `TWIN_RATE_WINDOW_MS` | No | Límites (por defecto 30 por cliente, 120 global, ventana de 10 min). |
| `TWIN_ALLOWED_ORIGINS` | No | Orígenes extra permitidos para `/api/twin`, separados por coma. |

`.env.example` lista las mismas variables. Las variables nuevas solo aplican a los deploys posteriores: hacé *Redeploy* después de cambiarlas.

- **Logs:** *Project → Logs* (entorno Production). Las advertencias de proxy no confiable o de Redis ausente se escriben una vez por instancia, en la primera consulta al chat.
- **Rollback:** *Project → Deployments*, elegí un deploy anterior y usá *Instant Rollback*. No reconstruye el sitio.
- **Previews:** cada rama y pull request genera una preview. Conviene no cargar la clave de OpenRouter en el entorno Preview, o usar una de bajo límite.

</details>

<details>
<summary><strong>Limitaciones conocidas</strong></summary>

- **Cupo global del chat:** toda consulta al gemelo cuenta contra el límite global, aunque después falle la validación. Un abuso sostenido puede agotar el cupo para todos. Con Upstash el contador es compartido entre instancias; si ocurre en la práctica, la mitigación es sumar un CAPTCHA (por ejemplo Cloudflare Turnstile) o subir `TWIN_GLOBAL_RATE_LIMIT`.
- **El origen no es una barrera anti-bots:** la comprobación de `Origin` frena el uso desde otros sitios web, pero un script que no es un navegador puede fabricar esas cabeceras. La defensa real son los límites de uso y el tope de gasto de la clave. Si aparece abuso, la mitigación es Cloudflare Turnstile o Vercel BotID.
- **Fallback `openrouter/free`:** si el modelo principal no responde, OpenRouter elige cualquier modelo gratuito disponible, de calidad variable. Se mantiene para no dejar el chat sin servicio; el prompt limita lo que puede afirmar y el aviso del chat indica que puede equivocarse.
- **Inyección de prompt:** el prompt solo contiene datos ya públicos del perfil y el servidor acepta únicamente turnos de usuario, así que el impacto es reputacional, no de seguridad. Está mitigado con reglas defensivas, no eliminado.
- **Costo del chat:** usa solo modelos gratuitos y un test falla si se agrega uno de pago. Aun así, la clave de OpenRouter debe ser dedicada y tener límite de crédito.
- **Datos públicos:** el email, el CV (`public/CV-AGUSTIN-MOHR.pdf`) y las coordenadas aproximadas son visibles para cualquiera y pueden ser rastreados por bots de spam. Es una decisión consciente: son mi canal de contacto.
- **Año del pie de página:** el sitio es estático y el año se calcula al construir; cambia recién en el siguiente deploy después del 1 de enero.
- **Modelos gratuitos:** el gemelo depende de su disponibilidad y límites, y puede tardar o fallar en horas pico. En ese caso el chat ofrece escribirme por email.

</details>

<details>
<summary><strong>Privacidad</strong></summary>

- Los mensajes del chat se procesan con OpenRouter y un modelo de IA de terceros. Este sitio no los guarda.
- El sitio no usa cookies de seguimiento ni analítica.
- Mi email y mi CV aparecen públicamente porque son mi canal de contacto.

El detalle completo está en la página `/privacidad` del sitio.

</details>

## Contacto

- **LinkedIn:** [agustin-mohr-tschopp](https://www.linkedin.com/in/agustin-mohr-tschopp-573806423)
- **GitHub:** [AgustinMohr](https://github.com/AgustinMohr)
- **Email:** [agustinmohr@hotmail.com](mailto:agustinmohr@hotmail.com)
- **CV:** [descargar PDF](public/CV-AGUSTIN-MOHR.pdf)
