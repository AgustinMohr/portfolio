# Tutorial completo: entender y construir este portfolio

> Guía para una persona que nunca programó frontend.  
> Proyecto: portfolio personal de Agustín Mohr Tschopp, con un chat de IA llamado “gemelo digital”.

Este documento no es una lista de comandos para copiar. Es un recorrido por el proyecto real que está en esta carpeta, pensado para que entiendas **qué es cada pieza, por qué existe y cómo modificarla sin romper nada**.

> **Nota de actualización (2026-10-26):** este tutorial documenta la construcción inicial. Después de las correcciones de `review.md`, el chat se dividió en `twin-chat.tsx` (launcher) y `twin-chat-panel.tsx` (panel), los hechos del gemelo viven en `profileFacts` (`data.ts`) y el proyecto tiene tests Vitest/Playwright. Los fragmentos de código de las secciones de chat y route son ilustrativos del estado inicial; para el estado actual, leé `AGENTS.md` y el código.

La idea central es simple:

> Un sitio web moderno es una colección de componentes pequeños que reciben datos, producen HTML y, cuando hace falta, se activan en el navegador con JavaScript.

Si en algún momento aparece una palabra que no conoces, salta al glosario del final. No hace falta memorizar todo en la primera lectura.

---

## Índice

1. Antes de tocar código
2. Cómo ejecutar el proyecto
3. Resumen de la tecnología
4. Recorrido de alto nivel
5. Revisión detallada del código
6. Errores reales y lecciones
7. Cómo modificar el sitio
8. Glosario
9. Cinco mejoras recomendadas basadas en autorrevisión

---

## 1. Antes de tocar código

### 1.1 Qué necesitas saber

No necesitas saber React, Next.js, TypeScript ni Tailwind para empezar. Sí conviene que sepas:

- Abrir una terminal (en Windows puede ser PowerShell o Windows Terminal).
- Navegar entre carpetas.
- Abrir y guardar archivos en un editor de código. Visual Studio Code es una opción habitual.
- Que los errores son información, no un castigo. El objetivo es leerlos y entender qué pieza falló.

### 1.2 Qué necesitas instalar

- **Node.js 20.9 o superior**. El proyecto fue construido con Node 24.
- **npm**, que viene incluido con Node.js.
- Un navegador moderno: Chrome, Edge, Firefox o Safari actualizado.
- Un editor de código.

Puedes comprobar las versiones en la terminal:

```bash
node -v
npm -v
```

### 1.3 La idea más importante antes de empezar

Un archivo `.tsx` parece HTML, pero no lo es. Es **JSX**: una forma de escribir interfaces dentro de JavaScript/TypeScript. Un archivo `.tsx` se compila y termina produciendo HTML, CSS y JavaScript que el navegador sí entiende.

Cuando veas algo así:

```tsx
<h1 className="hero-title">
  Sistemas
  <br />
  con <span className="serif-accent">intención.</span>
</h1>
```

No estás escribiendo HTML puro. Estás describiendo, con una sintaxis parecida a HTML, qué debe mostrar un componente de React. Las diferencias importantes son:

- `className` reemplaza a `class`.
- Las llaves `{}` permiten insertar expresiones de JavaScript.
- Los componentes se escriben con mayúscula inicial.
- Los atributos y eventos usan nombres como `onClick`, no `onclick`.

---

## 2. Cómo ejecutar el proyecto

### 2.1 Instalar dependencias

Desde la carpeta del proyecto:

```bash
npm install
```

`npm` lee `package.json` y descarga las dependencias declaradas en `node_modules/`. Esa carpeta es generada y no se edita a mano.

### 2.2 Levantar el servidor de desarrollo

```bash
npm run dev -- -p 3100
```

`npm run dev` ejecuta `next dev`. El fragmento `-- -p 3100` le pasa el puerto al comando de Next.js. En esta máquina el puerto 3000 estaba ocupado por otra aplicación, así que el proyecto se verificó en 3100.

Abre:

```text
http://localhost:3100
```

Deberías ver:

- El hero con “Sistemas con intención”.
- La tarjeta de perfil con “AMT”.
- La marquesina de tecnologías.
- Las secciones Sobre mí, Trayectoria, Portafolio y Contacto.
- Un botón flotante “Gemelo digital” abajo a la derecha.
- El botón “Abrir gemelo digital” dentro de Contacto.

### 2.3 Construir y servir la versión de producción

```bash
npm run build
npm run start -- -p 3100
```

El primer comando compila y optimiza el sitio. El segundo sirve el resultado. Si `npm run start` falla porque el puerto está ocupado, cambia el número.

### 2.4 Scripts disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Comprueba tipos, compila y optimiza para producción |
| `npm run start` | Sirve la compilación de producción |
| `npm run lint` | Ejecuta ESLint y detecta problemas de estilo/código |
| `npm run typecheck` | Ejecuta TypeScript sin generar archivos |

### 2.5 El archivo `.env` y los secretos

En la raíz hay un archivo `.env`. Allí está la clave de OpenRouter que usa el chat:

```text
OPENROUTER_API_KEY=...
```

Reglas que no se negocian:

- `.env` no se sube a Git. El `.gitignore` ya lo excluye.
- Una variable sin el prefijo `NEXT_PUBLIC_` solo existe en el servidor.
- El navegador nunca debe recibir la clave.
- Si una clave se filtra, se revoca y se genera otra.

Además existe una variable obligatoria para producción:

```text
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

Se usa para construir URLs absolutas de metadatos. En desarrollo, `src/lib/site.ts` usa `http://localhost:3100` como valor por defecto; un build de producción sin esta variable (o con una URL inválida) falla a propósito.

### 2.6 Si algo falla

Checklist corto:

1. ¿Estás en la carpeta correcta? Debe existir `package.json`.
2. ¿Ejecutaste `npm install`?
3. ¿La versión de Node es 20.9 o superior?
4. ¿El puerto está libre? Prueba otro, por ejemplo `3100`.
5. ¿Existe `.env` y está la clave?
6. Lee el error completo en la terminal. La primera línea suele decir qué archivo y qué línea falló.

---

## 3. Resumen de la tecnología

### 3.1 La web en una frase

El navegador pide una URL a un servidor. El servidor responde con HTML. El navegador lee ese HTML, descarga CSS para los estilos y JavaScript para el comportamiento.

- **HTML**: estructura y significado.
- **CSS**: apariencia, layout, color, tipografía, animaciones.
- **JavaScript**: comportamiento, eventos, estado, llamadas a APIs.

Este proyecto genera HTML y CSS desde React y Next.js, y usa JavaScript en el navegador solo donde hace falta.

### 3.2 Las piezas del stack

| Tecnología | Qué es | Para qué se usa aquí |
| --- | --- | --- |
| **Next.js 16.4.2** | Framework construido sobre React | Rutas por carpetas, renderizado en servidor, metadatos, API route, build |
| **React 19.3** | Biblioteca para interfaces | Componentes, JSX, estado, hooks, composición |
| **TypeScript 5** | JavaScript con tipos | Detectar errores antes de ejecutar; documentar contratos |
| **Tailwind CSS 4** | Framework de utilidades CSS | Layout, responsive, colores, espaciado, estados |
| **next/font** | Optimizador de fuentes | Autohospedar Space Grotesk, Instrument Serif y JetBrains Mono |
| **npm** | Gestor de paquetes y scripts | Instalar dependencias y ejecutar comandos |
| **OpenRouter** | Puerta de entrada a modelos de IA | Chat del gemelo digital con el modelo pedido |
| **CSS y SVG** | Recursos nativos del navegador | Fondos, grilla, grano, iconos, animaciones; sin imágenes externas |

### 3.3 La división más importante: servidor y cliente

Next.js 16 usa el **App Router**. Dentro de `src/app`, las carpetas representan rutas. El archivo `page.tsx` representa la página y `layout.tsx` el marco que la envuelve.

Por defecto, los componentes son **Server Components**:

- Se ejecutan en el servidor.
- Pueden leer datos y variables de entorno.
- Producen HTML.
- No pueden usar `useState`, `useEffect` ni eventos del navegador.
- No envían su código JavaScript al navegador si no hace falta.

Un componente se vuelve **Client Component** cuando el archivo empieza con:

```tsx
"use client";
```

Eso no significa que se ejecute solo en el navegador. Significa que se renderiza en el servidor **y además se hidrata** en el navegador para poder responder a clics, teclado, scroll o llamadas a APIs.

En este proyecto:

| Archivo | Tipo | Por qué |
| --- | --- | --- |
| `src/app/layout.tsx` | Servidor | Define fuentes, metadatos y estructura global |
| `src/app/page.tsx` | Servidor | Compone las secciones |
| `src/sections/*.tsx` | Servidor | Solo muestran datos y estructura |
| `src/components/site-header.tsx` | Cliente | Scrollspy, menú móvil, foco, `useState` |
| `src/components/reveal.tsx` | Cliente | `IntersectionObserver` |
| `src/components/contact-form.tsx` | Cliente | Formulario y evento `onSubmit` |
| `src/components/copy-email.tsx` | Cliente | Clipboard y feedback |
| `src/components/twin-chat.tsx` | Cliente | Launcher liviano; carga el panel bajo demanda |
| `src/components/twin-chat-panel.tsx` | Cliente | Panel, streaming, estado, teclado |
| `src/app/api/twin/route.ts` | Servidor | Guarda la API key y habla con OpenRouter |

> **Regla práctica:** si necesitas estado, eventos o APIs del navegador, usa `"use client"`. Si solo necesitas mostrar datos, déjalo como Server Component.

### 3.4 React en cinco conceptos

1. **Componente**: una función que devuelve interfaz. Ejemplo: `Hero`, `SiteHeader`, `TwinChat`.
2. **JSX**: la sintaxis que parece HTML dentro de TypeScript.
3. **Props**: datos que un componente recibe desde afuera.
4. **Estado (`state`)**: memoria interna que, al cambiar, vuelve a renderizar el componente.
5. **Hook**: función especial de React que añade comportamiento. Los usados aquí son `useState`, `useEffect` y `useRef`.

Ejemplo mínimo de props:

```tsx
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>;
}
```

Ejemplo mínimo de estado:

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

- `useState(0)` crea una memoria que empieza en cero.
- `count` es el valor actual.
- `setCount` pide un cambio.
- React vuelve a renderizar y muestra el nuevo valor.
- `onClick` es un evento; solo existe en Client Components.

### 3.5 TypeScript en lo que necesitas

TypeScript agrega tipos. No cambia el comportamiento en el navegador: los tipos se borran al compilar. Sirven para que el editor y `npm run build` te avisen si pasas el dato equivocado.

Ejemplo del proyecto:

```ts
export type TwinRole = "user" | "assistant";

export type TwinMessage = {
  role: TwinRole;
  content: string;
};
```

`TwinRole` solo puede ser `"user"` o `"assistant"`. Si alguien intenta usar `"system"` en el cliente, TypeScript lo marca como error. Además, el servidor valida los datos en tiempo de ejecución, porque un atacante puede enviar cualquier JSON aunque el tipo diga otra cosa.

> **Idea clave:** los tipos ayudan al programador, pero no son una barrera de seguridad. La validación real ocurre en el servidor.

### 3.6 Tailwind CSS en lo que necesitas

Tailwind no te obliga a inventar nombres de clases para cada cosa. Usas clases pequeñas y componibles:

```tsx
<div className="mt-8 max-w-xl text-sm leading-7 text-ash md:text-base">
  Texto
</div>
```

- `mt-8`: margen superior.
- `max-w-xl`: ancho máximo.
- `text-sm`: tamaño de texto.
- `leading-7`: altura de línea.
- `text-ash`: color definido por el proyecto.
- `md:text-base`: desde el breakpoint `md`, usa otro tamaño.

Es **mobile-first**: los estilos base aplican a pantallas pequeñas y los prefijos `sm:`, `md:`, `lg:` agregan cambios hacia arriba.

### 3.7 next/font

`next/font` descarga las fuentes en tiempo de build, las sirve desde el mismo dominio y crea variables CSS. El navegador no hace peticiones a Google Fonts al visitar la página.

Se configura en `src/app/layout.tsx`:

```tsx
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
```

Luego `globals.css` usa esas variables para definir la tipografía del sitio.

### 3.8 OpenRouter y streaming

OpenRouter es un servicio que recibe una conversación y la envía a un modelo. La respuesta se puede pedir en **streaming**: el servidor no espera a que el modelo termine; va enviando pedazos de texto.

En este proyecto:

1. El navegador hace `POST /api/twin` con los mensajes.
2. La route de Next.js lee `OPENROUTER_API_KEY` en el servidor.
3. El servidor llama a OpenRouter con `stream: true`.
4. OpenRouter envía eventos de texto.
5. El servidor extrae solo el contenido y lo reenvía como texto plano.
6. El navegador lee ese stream y actualiza el mensaje mientras llega.

Conceptos nuevos:

- **API**: interfaz para que dos programas se comuniquen.
- **Endpoint**: una URL concreta de esa API. Aquí, `/api/twin`.
- **Route Handler**: archivo de Next.js que responde a una petición HTTP. Aquí, `src/app/api/twin/route.ts`.
- **Stream**: datos que llegan por partes.
- **SSE**: formato de eventos usado por OpenRouter (`data: ...`).

### 3.9 Build, desarrollo y producción

- `npm run dev` es para trabajar. Tiene recarga rápida y errores detallados.
- `npm run build` es para comprobar que todo compila y generar la versión optimizada.
- `npm run start` sirve esa versión optimizada.

Nunca edites `.next/`: es una carpeta generada. Si algo se ve raro, se puede borrar y volver a compilar.

### 3.10 Un mapa mental

```text
Navegador
  |
  |  GET /
  v
Next.js (servidor)
  |
  +--> layout.tsx  (fuentes, metadatos, estructura)
  +--> page.tsx    (compone Hero, About, Trajectory, Portfolio, Contact)
  |       |
  |       +--> data.ts (perfil, navegación, proyectos)
  |       +--> componentes servidor (HTML)
  |       +--> islas cliente (header, reveal, form, chat)
  |
  +--> HTML + CSS + JS
  |
  v
Navegador hidrata las islas cliente
  |
  +--> scrollspy, menú, reveals, formulario, chat
  |
  +--> POST /api/twin
          |
          +--> route.ts (servidor)
                 |
                 +--> OpenRouter
                        |
                        +--> stream de texto
                               |
                               +--> TwinChat actualiza la burbuja
```

---

## 4. Recorrido de alto nivel

### 4.1 Estructura de carpetas

```text
portfolio-web/
├── src/
│   ├── app/
│   │   ├── api/twin/route.ts
│   │   ├── globals.css
│   │   ├── icon.svg
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── opengraph-image.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── contact-form.tsx
│   │   ├── copy-email.tsx
│   │   ├── cursor-glow.tsx
│   │   ├── icons.tsx
│   │   ├── local-clock.tsx
│   │   ├── reveal.tsx
│   │   ├── scroll-progress.tsx
│   │   ├── section-label.tsx
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   ├── twin-chat.tsx
│   │   └── twin-trigger.tsx
│   ├── lib/
│   │   ├── data.ts
│   │   ├── twin.ts
│   │   └── twin-server.ts
│   └── sections/
│       ├── about.tsx
│       ├── contact.tsx
│       ├── hero.tsx
│       ├── portfolio.tsx
│       └── trajectory.tsx
├── public/
├── .env
├── next.config.ts
├── package.json
├── Profile.pdf
├── README.md
└── TUTORIAL.md
```

### 4.2 Para qué sirve cada zona

| Zona | Responsabilidad |
| --- | --- |
| `src/app` | Rutas, layout, estilos globales, metadatos y API |
| `src/sections` | Bloques grandes de la página (hero, sobre mí, etc.) |
| `src/components` | Piezas reutilizables o interactivas (header, chat, form) |
| `src/lib` | Datos y utilidades compartidas |
| `public` | Archivos estáticos. Aquí está vacío porque todo se genera con CSS/SVG |
| `.env` | Secretos locales. No se versiona |
| `.next` | Resultado generado por Next. No se edita |

### 4.3 El recorrido de una visita

1. El navegador pide `http://localhost:3100`.
2. Next ejecuta `src/app/layout.tsx`.
3. El layout configura fuentes, metadatos y el cuerpo del documento.
4. Next ejecuta `src/app/page.tsx`.
5. `page.tsx` importa y compone `Hero`, `About`, `Trajectory`, `Portfolio` y `Contact`.
6. Esos componentes servidor leen `src/lib/data.ts` y producen HTML.
7. Next envía HTML, referencias a CSS y JavaScript de las islas cliente.
8. El navegador hidrata `SiteHeader`, `Reveal`, `ContactForm`, `CopyEmail`, `TwinChat` y los componentes de animación.
9. El usuario interactúa.
10. Si abre el chat, el navegador llama a `/api/twin`; el servidor conversa con OpenRouter y devuelve texto en streaming.
11. El formulario de contacto no usa backend: arma un enlace `mailto:` y abre el cliente de correo.

### 4.4 Las tres capas del proyecto

**Contenido**

- `src/lib/data.ts`: perfil, `profileFacts`, navegación, timeline, stack, proyectos.
- `src/lib/twin-server.ts`: modelo y prompt generado desde `profileFacts`.
- `src/lib/twin.ts`: textos y sugerencias del chat que sí puede ver el cliente.

**Presentación**

- `src/app/globals.css`: colores, tipografía, botones, fondos, animaciones.
- Clases de Tailwind dentro de los componentes.
- `src/app/layout.tsx`: fuentes y metadatos.
- `src/app/icon.svg` y `src/app/opengraph-image.tsx`: identidad visual.

**Comportamiento**

- `src/components/site-header.tsx`: navegación y menú móvil.
- `src/components/reveal.tsx`, `scroll-progress.tsx`, `cursor-glow.tsx`: movimiento.
- `src/components/contact-form.tsx`, `copy-email.tsx`: contacto.
- `src/components/twin-chat.tsx` y `twin-chat-panel.tsx`: chat.
- `src/app/api/twin/route.ts`: integración segura con OpenRouter.

### 4.5 El sistema de diseño

La dirección visual se puede resumir como “enterprise meets edgy”:

- Fondo casi negro (`#08090a`) y superficies apenas más claras.
- Un único acento ácido (`#d8ff3e`) para estados, foco y llamadas a la acción.
- Tipografía grande y ajustada para los títulos.
- Serif itálica para las palabras emocionales: “intención”, “decide”, “paso”, “algo”.
- Líneas finas, etiquetas monoespaciadas, esquinas marcadas y una grilla técnica.
- Animaciones sutiles; nada que impida leer.

Los tokens están en `src/app/globals.css`:

```css
@theme {
  --color-void: #08090a;
  --color-panel: #0d0f11;
  --color-bone: #f3f1ea;
  --color-ash: #8f9297;
  --color-acid: #d8ff3e;
  --color-line: rgba(243, 241, 234, 0.1);
  --color-line-strong: rgba(243, 241, 234, 0.2);
}
```

Eso permite escribir `bg-void`, `text-bone`, `border-line` o `text-acid` en cualquier componente. Si se cambia el token, cambia todo el sitio de forma coherente.

### 4.6 Sección por sección

**Hero** (`src/sections/hero.tsx`)

- Presenta nombre, posicionamiento y disponibilidad.
- Dos llamadas a la acción: “Hablemos” y “Ver trayectoria”.
- Tarjeta lateral con monograma, datos y hora local.
- Marquesina con tecnologías.

**Sobre mí** (`src/sections/about.tsx`)

- Relato en primera persona.
- Principios de trabajo.
- Nota humana “Off-screen”.
- Drop cap decorativo.

**Trayectoria** (`src/sections/trajectory.tsx`)

- Columna izquierda sticky con formación e idiomas.
- Timeline con cuatro etapas: formación, fundamentos, especialización y primera oportunidad.
- Stack en una grilla 2x2.
- No inventa experiencia laboral: la sección lo dice con claridad.

**Portafolio** (`src/sections/portfolio.tsx`)

- Tres casos de estudio “en preparación”.
- Enlaces a LinkedIn, email y solicitud de CV.
- Honestidad explícita: no hay resultados ni clientes inventados.

**Contacto** (`src/sections/contact.tsx`)

- Datos directos, disponibilidad y hora local.
- Formulario que abre el cliente de correo.
- Botón para copiar el email.
- Invitación a usar el gemelo digital.

**Global**

- `SiteHeader`: navegación fija, scrollspy y menú móvil.
- `SiteFooter`: cierre, navegación, contacto y marca de agua “MOHR”.
- `ScrollProgress`, `CursorGlow`, `Reveal`: microinteracciones.
- `TwinChat`: chat flotante con IA.

### 4.7 Dónde cambiar cada cosa

| Quiero cambiar… | Voy a… |
| --- | --- |
| Nombre, email, LinkedIn, disponibilidad | `src/lib/data.ts` |
| Textos de Sobre mí o Trayectoria | `src/sections/about.tsx`, `trajectory.tsx` y `data.ts` |
| Colores, fuentes, botones | `src/app/globals.css` |
| Navegación | `src/lib/data.ts` (`navItems`) y el `id` de la sección |
| Proyectos del portafolio | `src/lib/data.ts` (`projects`) |
| Personalidad o datos del gemelo | `profileFacts` en `src/lib/data.ts` y `buildTwinPrompt` en `src/lib/twin-server.ts` |
| Preguntas sugeridas del chat | `src/lib/twin.ts` |
| Modelo de IA | `TWIN_MODEL` en `src/lib/twin-server.ts` |
| Metadatos, título de pestaña, SEO | `src/app/layout.tsx` |
| Imagen para compartir | `src/app/opengraph-image.tsx` |
| Favicon | `src/app/icon.svg` |

---

## 5. Revisión detallada del código

Esta sección explica las decisiones importantes. No hace falta memorizar cada línea; lo valioso es entender el patrón y poder ubicarlo cuando lo necesites.

### 5.1 `package.json`: el mapa de comandos

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "16.4.2",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  }
}
```

`dependencies` son paquetes que la aplicación necesita para funcionar. `devDependencies` son herramientas de desarrollo: TypeScript, ESLint, Tailwind y los tipos de React/Node.

`npm run build` ejecuta el compilador de Next. Además, en este proyecto, corre las comprobaciones de TypeScript. `npm run typecheck` hace solo la parte de tipos.

### 5.2 `next.config.ts`: configuración del framework

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
```

Dos ideas:

- `cacheComponents` y `partialPrefetching` son opciones de esta versión de Next. No las copies a ciegas en otro proyecto.
- `turbopack` configura el compilador. La regla de CSS permite procesar Tailwind con el loader correcto.

La versión de Next es reciente y tiene cambios importantes. Si buscas un tutorial viejo y algo no coincide, revisa la documentación incluida en `node_modules/next/dist/docs/`. También puedes leerla en el sitio oficial, pero la copia local coincide exactamente con la versión instalada.

### 5.3 `src/app/layout.tsx`: el marco global

El layout define el documento que envuelve todas las páginas.

```tsx
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
```

- `subsets: ["latin"]` reduce los caracteres descargados.
- `variable` expone la fuente como variable CSS.
- `display: "swap"` muestra una fuente de respaldo mientras carga, evitando texto invisible.

`siteUrl` viene de `src/lib/site.ts`, la única fuente para la canónica, Open Graph y JSON-LD.

Luego:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Agustín Mohr Tschopp — Sistemas con intención",
    template: "%s · Agustín Mohr Tschopp",
  },
  description:
    "Portfolio de Agustín Mohr Tschopp, estudiante avanzado de Ingeniería en Sistemas de Información en la UTN FRSF. Backend, arquitectura y desarrollo de software asistido por IA.",
};
```

- `metadata` solo se puede exportar desde Server Components.
- Next genera las etiquetas `<title>`, `<meta name="description">`, Open Graph y Twitter.
- `metadataBase` resuelve URLs relativas.

El cuerpo del layout:

```tsx
<html
  lang="es"
  data-scroll-behavior="smooth"
  className={`js ${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
>
  <body className="min-h-dvh overflow-x-clip bg-void text-bone antialiased">
    <noscript>
      <style>{`.js .reveal{opacity:1!important;transform:none!important}`}</style>
    </noscript>
    <a href="#contenido" className="skip-link">
      Saltar al contenido
    </a>
    {children}
    <TwinChat />
    <div className="grain" aria-hidden="true" />
  </body>
</html>
```

Cosas para aprender:

- `lang="es"` ayuda a lectores de pantalla y buscadores.
- El enlace “Saltar al contenido” es el primer elemento enfocable. Es una práctica de accesibilidad.
- `noscript` asegura que los bloques con animación de entrada se vean si JavaScript está desactivado.
- `TwinChat` se monta en el layout para que el chat esté disponible en todas las páginas.
- `grain` es una capa fija decorativa; `aria-hidden` evita que el lector la anuncie.
- `overflow-x-clip` evita scroll horizontal accidental sin bloquear `position: sticky`.

> **Lección:** el layout no es “el header”. Es el documento base. Todo lo global vive aquí.

### 5.4 `src/app/globals.css`: el sistema visual

#### Tokens y fuentes

`@theme` de Tailwind 4 define colores que se convierten en utilidades. `@theme inline` enlaza las variables que crea `next/font`.

```css
@theme {
  --color-void: #08090a;
  --color-panel: #0d0f11;
  --color-bone: #f3f1ea;
  --color-ash: #8f9297;
  --color-acid: #d8ff3e;
  --color-line: rgba(243, 241, 234, 0.1);
  --color-line-strong: rgba(243, 241, 234, 0.2);
}

@theme inline {
  --font-sans: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-instrument-serif), ui-serif, Georgia, serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, monospace;
}
```

- Un token es una variable de diseño.
- `bg-void` no es un color mágico de Tailwind: nace de este bloque.
- `@theme inline` es importante porque las fuentes se resuelven en tiempo de ejecución mediante las variables de `next/font`.

#### Tipografía y layout

```css
.hero-title {
  font-size: clamp(3rem, 9.4vw, 8.5rem);
  line-height: 0.9;
  letter-spacing: -0.055em;
  font-weight: 500;
}

.section-title {
  font-size: clamp(2.45rem, 5vw, 4.6rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
  font-weight: 500;
}
```

`clamp(min, preferido, max)` permite que el título crezca con la pantalla sin volverse gigante en monitores ultra anchos. El máximo se ajustó después de detectar que a 1920 px el titular pasaba de dos a tres líneas.

`.shell` centraliza el contenido:

```css
.shell {
  width: 100%;
  max-width: 90rem;
  margin-inline: auto;
  padding-inline: 1.25rem;
}

@media (min-width: 768px) {
  .shell {
    padding-inline: 2.5rem;
  }
}

@media (min-width: 1280px) {
  .shell {
    padding-inline: 4rem;
  }
}
```

#### Botones y capas CSS

Los botones se definen dentro de `@layer components`:

```css
@layer components {
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    border-radius: 999px;
    padding: 0.9rem 1.4rem;
    font-size: 0.875rem;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .btn-primary {
    background-color: var(--color-acid);
    color: var(--color-void);
  }

  .btn-ghost {
    border: 1px solid var(--color-line-strong);
    color: var(--color-bone);
  }
}
```

Esto parece un detalle, pero fue un arreglo real. Al principio `.btn` estaba fuera de una capa. El CSS sin capa tiene más prioridad que las utilidades de Tailwind, así que `display: inline-flex` pisaba `hidden`. El botón “Hablemos” aparecía en móvil aunque tuviera `hidden`.

Mover los botones a `@layer components` hace que las utilidades puedan sobrescribirlos de forma predecible. Es una lección sobre especificidad y orden de capas.

#### Fondos y textura

- `.grid-lines` dibuja una grilla con gradientes lineales.
- `.grid-mask` difumina la grilla con una máscara radial.
- `.grain` usa un SVG con `feTurbulence` embebido como `data:` URI. No hay imagen externa.
- El grano tiene `pointer-events: none` y `aria-hidden`, así que no bloquea clics ni aparece en el árbol de accesibilidad.

#### Movimiento

```css
@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rise {
  animation: rise-in 1s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

- `both` conserva el estado inicial y final.
- El hero usa `style={{ animationDelay: "160ms" }}` para escalonar.
- La marquesina usa dos listas idénticas y traslada el contenedor a `-50%`. Por eso el ciclo es continuo.
- `.reveal` empieza oculto solo dentro de `.js`. Si JavaScript no carga, el contenido sigue visible.
- `@media (prefers-reduced-motion: reduce)` desactiva animaciones y transiciones. Es una preferencia del sistema operativo, no una moda.

### 5.5 `src/lib/data.ts`: contenido separado de presentación

```ts
export const profile = {
  name: "Agustín Mohr Tschopp",
  firstName: "Agustín",
  initials: "AMT",
  role: "Ingeniería en Sistemas · Software & IA",
  location: "Santa Fe, Argentina",
  coordinates: "31.6107° S / 60.6973° O",
  email: "agustinmohr@hotmail.com",
  linkedin: "https://www.linkedin.com/in/agustin-mohr-tschopp-573806423",
  availability: "Disponible para pasantías y roles junior",
  description:
    "Estudiante avanzado de Ingeniería en Sistemas de Información en la UTN FRSF. Foco en backend, arquitectura y desarrollo de software asistido por inteligencia artificial.",
} as const;
```

- `as const` hace que TypeScript trate los valores como literales de solo lectura.
- Los componentes reciben datos en lugar de tenerlos escritos. Así se cambia un texto una vez.
- `profile` se usa en hero, footer, contacto, formulario, chat y metadatos.
- `navItems` debe coincidir con los `id` de las secciones. Si cambias uno, cambia el otro.

Un elemento del timeline:

```ts
{
  index: "01",
  period: "2020 — Hoy",
  title: "Formación de grado",
  subtitle: "Ingeniería en Sistemas de Información",
  org: "UTN · Facultad Regional Santa Fe",
  body: "Cuarto año en curso. Una base amplia en algoritmos, arquitectura, bases de datos y sistemas operativos que ordena todo lo que construyo después.",
  tags: ["UTN FRSF", "4.º año", "Santa Fe"],
}
```

La sección `Trajectory` hace `timeline.map(...)`. Cada `key` usa `item.index`, que es estable. No uses el índice del array como `key` si la lista puede cambiar de orden.

### 5.6 `src/app/page.tsx`: composición y datos estructurados

```tsx
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <SiteHeader />

      <main id="contenido" className="relative z-10">
        <Hero />
        <About />
        <Trajectory />
        <Portfolio />
        <Contact />
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
```

- La página no implementa cada sección: las compone.
- `<main>` tiene el `id` que usa el enlace “Saltar al contenido”.
- El `z-10` deja el contenido por encima del resplandor del cursor, que está en `z-0`.
- El bloque JSON-LD describe a la persona para buscadores. `dangerouslySetInnerHTML` se usa aquí con datos estáticos y propios. Nunca lo uses con texto ingresado por un usuario sin sanitizar.

### 5.7 Las secciones: datos, semántica y patrones

#### Hero

```tsx
<h1 className="hero-title rise mt-8 text-bone">
  Sistemas
  <br />
  con <span className="serif-accent text-acid">intención.</span>
</h1>
```

- Un solo `<h1>` por página.
- El `<br />` es intencional para controlar el corte en desktop.
- `serif-accent` aplica la serif itálica.
- La animación se retrasa con `animationDelay` para crear una entrada escalonada.

La tarjeta de perfil usa una lista de definiciones:

```tsx
<dl>
  <ProfileRow label="Base" value="Santa Fe, Argentina" />
  <ProfileRow label="Foco" value="Backend · Arquitectura · IA" />
  <ProfileRow label="Formación" value="UTN FRSF — 4.º año" />
  <ProfileRow label="Idiomas" value="Español · Inglés avanzado" />
</dl>
```

`dl`, `dt` y `dd` son HTML semántico para pares término/definición. Un lector de pantalla entiende mejor la relación que con una serie de `div`.

La marquesina:

```tsx
<div className="marquee" aria-hidden="true">
  <div className="marquee-track">
    <MarqueeList />
    <MarqueeList />
  </div>
</div>
```

Se duplica la lista para que el final empalme con el principio. Todo el bloque es decorativo para accesibilidad: las tecnologías también aparecen en Trayectoria, así que no se repiten en el árbol semántico.

#### Sobre mí

```tsx
<div className="mt-12 border-t border-line">
  {principles.map((principle, index) => (
    <Reveal key={principle.index} delay={index * 70}>
      <div className="group grid gap-3 border-b border-line py-6 sm:grid-cols-[auto_1fr] sm:gap-6">
        <span className="label pt-1 text-acid">{principle.index}</span>
        <div>
          <h3>{principle.title}</h3>
          <p>{principle.body}</p>
        </div>
      </div>
    </Reveal>
  ))}
</div>
```

- `.map()` transforma datos en elementos.
- `key` debe ser estable y único.
- `delay={index * 70}` escalona la animación.
- La clase `group` permite que el hover de un contenedor cambie el color de sus hijos con `group-hover:`.

El drop cap se logra con CSS:

```css
.dropcap::first-letter {
  float: left;
  margin-right: 0.3rem;
  font-family: var(--font-serif), ui-serif, Georgia, serif;
  font-style: italic;
  font-size: 3.6rem;
  line-height: 0.72;
  color: var(--color-acid);
}
```

#### Trayectoria

La columna izquierda es sticky en desktop:

```tsx
<div className="self-start lg:sticky lg:top-28 lg:col-span-5">
```

`self-start` evita que el elemento se estire a toda la altura de la grilla. `sticky` solo funciona si el contenedor no tiene `overflow` que lo recorte.

Cada entrada usa una grilla de dos columnas en desktop:

```tsx
<article className="group border-b border-line py-8 md:grid md:grid-cols-[8.5rem_1fr] md:gap-8">
  <div className="flex items-start justify-between gap-4 md:block">
    <span className="label text-acid">{item.index}</span>
    <span className="label mt-0 block whitespace-nowrap text-ash md:mt-4">
      {item.period}
    </span>
  </div>
  <div className="mt-4 md:mt-0">
    <h3>{item.title}</h3>
    <p>{item.subtitle}</p>
    <p>{item.org}</p>
    <p>{item.body}</p>
    <ul>
      {item.tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  </div>
</article>
```

- `whitespace-nowrap` evita que “2020 — Hoy” se parta en dos líneas.
- La columna de 8.5rem se eligió después de ver que “Especialización” se montaba sobre el título.
- En móvil se apila y el periodo queda arriba a la derecha.

El stack usa `gap-px` sobre un fondo con color de línea. Eso crea separadores de un píxel sin bordes duplicados:

```tsx
<div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
  {stackGroups.map((group) => (
    <div key={group.index} className="bg-void p-5">
      <p>{group.title}</p>
      <ul>
        {group.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  ))}
</div>
```

#### Portafolio

Los proyectos son datos:

```tsx
{projects.map((project, index) => (
  <Reveal key={project.index} delay={index * 60}>
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${project.title} — ver perfil de LinkedIn`}
      className="group grid gap-5 border-b border-line py-8 md:grid-cols-12"
    >
      <div className="md:col-span-1">{project.index}</div>
      <div className="md:col-span-4">
        <h3>{project.title}</h3>
        <p>{project.kicker}</p>
      </div>
      <div className="md:col-span-4">
        <p>{project.body}</p>
        <ul>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-3">
        <span>{project.status}</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </a>
  </Reveal>
))}
```

- `target="_blank"` abre una pestaña nueva.
- `rel="noreferrer"` evita filtrar información de la página de origen y es una buena práctica para enlaces externos.
- `aria-label` aclara que el enlace lleva a LinkedIn, porque el título visible no lo dice.
- El estado “En preparación” es contenido real, no un placeholder accidental.

#### Contacto y el disparador del chat

Contacto mantiene dos columnas. A la izquierda, filas con label y valor. A la derecha, el formulario.

El disparador del gemelo digital es un Client Component pequeño:

```tsx
"use client";

import { TWIN_OPEN_EVENT } from "@/lib/twin";
import { ArrowUpRight, SparklesIcon } from "./icons";

export function TwinTrigger({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(TWIN_OPEN_EVENT))}
      className={`btn btn-ghost px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] ${className}`}
    >
      <SparklesIcon className="h-3.5 w-3.5 text-acid" />
      Abrir gemelo digital
      <ArrowUpRight className="h-3.5 w-3.5" />
    </button>
  );
}
```

No importa el chat entero dentro de Contacto. Solo emite un evento global. `TwinChat` escucha ese evento y se abre. Es un patrón de desacoplamiento: un botón no necesita conocer la implementación del chat.

### 5.8 El header: scrollspy, menú y accesibilidad

El header es un Client Component porque tiene estado y eventos.

#### Detectar scroll

```tsx
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 24);
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

- `useEffect` corre después del render.
- `{ passive: true }` avisa que no se llamará `preventDefault`, lo que ayuda al rendimiento.
- La función de limpieza quita el listener cuando el componente se desmonta.
- Nunca dejes un listener global sin limpiar.

#### Scrollspy

```tsx
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) setActive(entry.target.id);
    }
  },
  { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
);
```

`IntersectionObserver` avisa cuando un elemento entra o sale de una zona del viewport. El `rootMargin` negativo reduce la zona a una franja cercana al centro. Así el enlace activo corresponde a la sección que está en el medio, no a la que asoma por el borde.

#### Menú móvil

El menú usa un diálogo a pantalla completa, foco atrapado y bloqueo del scroll:

```tsx
useEffect(() => {
  if (!open) return;

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const menuItems = Array.from(
    menuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? [],
  );
  const focusable = toggleRef.current
    ? [toggleRef.current, ...menuItems]
    : menuItems;

  const frame = window.requestAnimationFrame(() => menuItems[0]?.focus());

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      toggleRef.current?.focus();
      return;
    }

    if (event.key !== "Tab" || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  window.addEventListener("keydown", handleKey);

  return () => {
    window.cancelAnimationFrame(frame);
    document.body.style.overflow = previousOverflow;
    window.removeEventListener("keydown", handleKey);
  };
}, [open]);
```

Conceptos:

- **Focus trap**: mantener el foco dentro del menú mientras está abierto.
- **Escape**: cierra y devuelve el foco al botón que abrió.
- **inert**: el menú cerrado no es enfocable. Se aplica con `inert={!open}`.
- **body overflow hidden**: evita que la página de atrás haga scroll en móvil.
- **requestAnimationFrame**: espera al siguiente cuadro para enfocar un elemento que acaba de aparecer.
- El breakpoint del menú es `lg` (1024 px), no `md`. Con `md`, el logo + cinco enlaces + botón no cabían a 768 px y el CTA se recortaba.

El enlace activo usa `aria-current`:

```tsx
aria-current={isActive ? "location" : undefined}
```

Eso no cambia el aspecto, pero comunica el estado a tecnologías de asistencia.

### 5.9 Movimiento: `Reveal`, progreso y cursor

#### Reveal

```tsx
useEffect(() => {
  const element = ref.current;
  if (!element) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add("is-visible");
        observer.disconnect();
      }
    },
    { threshold: 0, rootMargin: "0px 0px 200px 0px" },
  );

  observer.observe(element);
  return () => observer.disconnect();
}, []);
```

- Cada `Reveal` envuelve un bloque y le agrega la clase `is-visible` cuando entra.
- `rootMargin` positivo dispara un poco antes de que el bloque entre, lo que hace la animación más suave.
- La animación real está en CSS, no en JavaScript. Eso es más barato para el navegador.
- El CSS solo oculta `.reveal` si existe la clase `.js` en `<html>`. Si no hay JavaScript, el contenido se ve.

#### Barra de progreso

```tsx
const scrollable =
  document.documentElement.scrollHeight - window.innerHeight;
const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
```

- Se calcula cuánto se puede scrollear y qué porcentaje se recorrió.
- `scaleX` es más eficiente que cambiar el ancho.
- `Math.min` y `Math.max` mantienen el valor entre 0 y 1.
- `transformOrigin: "left"` asegura que la barra crezca desde la izquierda.

#### Resplandor del cursor

```tsx
const handleMove = (event: PointerEvent) => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    element.style.setProperty("--x", `${event.clientX}px`);
    element.style.setProperty("--y", `${event.clientY}px`);
    element.style.opacity = "1";
  });
};
```

- Se actualizan dos variables CSS con la posición del puntero.
- El gradiente se define en CSS y usa `var(--x)` y `var(--y)`.
- `requestAnimationFrame` limita las actualizaciones al ritmo del navegador.
- Se desactiva en pantallas táctiles (`pointer: coarse`) y con movimiento reducido.

#### Reloj local

```tsx
const formatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: "America/Argentina/Cordoba",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
```

- `Intl.DateTimeFormat` formatea fechas y horas.
- La zona horaria se fija explícitamente, así el visitante ve la hora de Santa Fe.
- El primer render del servidor no conoce la hora exacta del cliente. `suppressHydrationWarning` evita un aviso por la diferencia entre el HTML inicial y la actualización del efecto.

### 5.10 Formularios y clipboard

#### Formulario de contacto

```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  if (!name || !email || !message) return;

  const subject = `Contacto desde el portfolio — ${name}`;
  const body = `Hola Agustín,\n\n${message}\n\n—\n${name}\n${email}`;

  setStatus("Abriendo tu cliente de correo con el mensaje listo.");
  window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
```

Aprende esto:

- `preventDefault()` evita que el formulario haga la navegación HTML por defecto.
- `FormData` lee los campos por su atributo `name`. No hace falta un estado por campo.
- `.trim()` quita espacios al inicio y al final.
- `encodeURIComponent` escapa caracteres especiales para que el `mailto` no se rompa.
- `required` y `type="email"` activan la validación nativa del navegador.
- No hay backend: el mensaje se compone y se delega al cliente de correo.
- El estado `status` se anuncia con `aria-live="polite"`.

#### Copiar email

```tsx
function handleCopy() {
  setCopied(true);

  if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  timeoutRef.current = window.setTimeout(() => setCopied(false), 2200);

  navigator.clipboard.writeText(profile.email).catch(() => {
    window.location.href = `mailto:${profile.email}`;
  });
}
```

- `navigator.clipboard` requiere un contexto seguro: `https` o `localhost`.
- El botón muestra “Copiado” durante 2,2 segundos.
- Si el portapapeles falla, se ofrece el `mailto`.
- El `timeout` se limpia al desmontar para no actualizar un componente que ya no existe.

El anuncio accesible está separado del botón:

```tsx
<span className="sr-only" role="status" aria-live="polite">
  {copied ? "Email copiado" : ""}
</span>
```

Este detalle corrigió un problema real: al poner `aria-live` directamente en el botón, la etiqueta visible no se actualizaba de forma fiable en este entorno. Al separar el anuncio en un `span` con `sr-only`, el botón volvió a actualizar su texto correctamente. Además, es la práctica recomendada: el control visual y la región viva son responsabilidades distintas.

### 5.11 El gemelo digital

Esta es la parte más compleja. Está dividida en tres archivos para no mezclar responsabilidades.

#### `src/lib/twin.ts`: datos seguros para el cliente

```ts
export type TwinRole = "user" | "assistant";

export type TwinMessage = {
  role: TwinRole;
  content: string;
};

export const TWIN_OPEN_EVENT = "twin:open";

export const twinWelcome =
  "Hola, soy el gemelo digital de Agustín. Podés preguntarme por mi formación, mi stack, mi forma de trabajar o cómo contactarme. ¿Qué querés saber?";

export const twinSuggestions = [
  "¿Qué estás buscando?",
  "Contame tu stack",
  "¿Cómo trabajás con IA?",
  "¿Cómo puedo contactarte?",
] as const;

export const TWIN_MAX_MESSAGES = 12;
export const TWIN_MAX_CHARS = 1200;
```

Este archivo **sí** puede importarse desde el cliente. No contiene secretos ni el prompt del sistema. Solo tipos, textos y límites.

#### `src/lib/twin-server.ts`: el prompt

El prompt es una instrucción larga que define identidad, hechos, reglas de estilo, privacidad y antiinvención. Algunos fragmentos:

```ts
export const TWIN_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";

export const TWIN_SYSTEM_PROMPT = `Sos el gemelo digital de Agustín Mohr Tschopp...
- Todavía no tiene experiencia laboral formal. Su recorrido es académico y de aprendizaje autónomo.
- Stack principal: Java, Spring Boot, APIs REST, SQL y Git.
...
- No inventes experiencia laboral, empresas, títulos, fechas, proyectos, resultados, métricas, pretensiones salariales...
- No agregues tecnologías, herramientas ni niveles que no estén en este perfil.
- Hablá siempre en primera persona, incluso cuando respondas en otro idioma.
...`;
```

Puntos importantes:

- El prompt describe **hechos** y **comportamiento**. No es solo una lista de datos.
- Las reglas negativas son necesarias. Sin ellas, el modelo completó tecnologías de frontend e infraestructura que no estaban en el perfil.
- Se aclara que no tiene experiencia formal, para evitar inventar empresas.
- Se aclara que no está recibido y que inició la carrera en 2020, para evitar frases como “cursa cuarto año desde 2020”.
- Se pide primera persona también en inglés.
- El prompt no es una garantía matemática. La UI muestra un aviso de que la IA puede equivocarse.

> **Seguridad:** este archivo se importa solo desde la route del servidor. No debe importarse desde un componente con `"use client"`.

#### `src/app/api/twin/route.ts`: la frontera segura

El route handler recibe el `POST`, valida, limita el uso y llama a OpenRouter.

**Validación de mensajes**

```ts
function readMessages(value: unknown): TwinMessage[] | null {
  if (!Array.isArray(value)) return null;

  const messages: TwinMessage[] = [];

  for (const item of value.slice(-TWIN_MAX_MESSAGES)) {
    if (!item || typeof item !== "object") continue;

    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;

    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      continue;
    }

    const trimmed = content.trim().slice(0, TWIN_MAX_CHARS);
    if (!trimmed) continue;

    messages.push({ role, content: trimmed });
  }

  if (messages.length === 0) return null;
  if (messages[messages.length - 1].role !== "user") return null;

  return messages;
}
```

Por qué se valida aunque TypeScript ya tenga tipos:

- El navegador puede enviar cualquier JSON. Los tipos no existen en tiempo de ejecución.
- Se ignoran roles no permitidos, como `system`. Un usuario no puede inyectar instrucciones del sistema.
- Se recortan los mensajes y se limita la cantidad.
- La conversación debe terminar en un mensaje del usuario.

**Rate limit**

```ts
const rateBuckets = new Map<string, RateBucket>();

function isRateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}
```

Esto evita que una persona abuse de la clave. Es una solución en memoria, suficiente para un portfolio local, pero no para varias instancias en producción. Ese es uno de los puntos de mejora del final.

**Llamada a OpenRouter**

```ts
upstream = await fetch(OPENROUTER_URL, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": origin,
    "X-Title": "Portfolio - Agustin Mohr Tschopp",
  },
  body: JSON.stringify({
    model: TWIN_MODEL,
    messages: [
      { role: "system", content: TWIN_SYSTEM_PROMPT },
      ...messages,
    ],
    stream: true,
    temperature: 0.5,
    max_tokens: 1000,
    top_p: 0.9,
  }),
  signal: controller.signal,
  cache: "no-store",
});
```

Detalles:

- La `Authorization` usa la clave que solo existe en el servidor.
- `HTTP-Referer` y `X-Title` son identificadores recomendados por OpenRouter.
- `stream: true` activa el envío por partes.
- `temperature` controla la creatividad; 0.5 es un punto medio.
- `max_tokens` limita el costo y la longitud.
- `signal` permite cancelar por timeout.
- `cache: "no-store"` evita reutilizar una respuesta de IA.

> **Error real:** al principio `X-Title` incluía un guion largo (—). Los encabezados HTTP no admiten caracteres fuera de Latin-1, y el fetch lanzó `TypeError: Cannot convert argument to a ByteString`. Se reemplazó por un guion ASCII. Los headers no son lugar para tipografía decorativa.

**Parsear el stream**

OpenRouter devuelve eventos. El servidor no manda el JSON crudo al navegador; extrae el texto:

```ts
while (newline !== -1) {
  const line = buffer.slice(0, newline).trim();
  buffer = buffer.slice(newline + 1);
  newline = buffer.indexOf("\n");

  if (!line.startsWith("data:")) continue;

  const data = line.slice(5).trim();
  if (data === "[DONE]") {
    finished = true;
    break;
  }
  if (!data) continue;

  let parsed: {
    choices?: { delta?: { content?: string | null } }[];
    error?: { message?: string };
  };

  try {
    parsed = JSON.parse(data);
  } catch {
    continue;
  }

  if (parsed.error?.message) {
    throw new Error(parsed.error.message);
  }

  const content = parsed.choices?.[0]?.delta?.content;
  if (content) streamController.enqueue(encoder.encode(content));
}
```

- Un stream puede cortar una línea al medio. Por eso se acumula en `buffer` y se procesa por saltos de línea.
- Solo se procesan líneas que empiezan con `data:`.
- `[DONE]` marca el final.
- El modelo es de razonamiento: también puede enviar `delta.reasoning`. Se ignora a propósito; al usuario solo se le muestra `delta.content`.
- Si el JSON viene malformado, se ignora esa línea en lugar de romper todo el stream.

El resultado se devuelve como `text/plain`:

```ts
return new Response(stream, {
  headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store, no-transform",
    "X-Accel-Buffering": "no",
  },
});
```

No se devuelve JSON porque el cliente va a leer pedazos de texto, no un objeto final. `X-Accel-Buffering: no` ayuda a que proxies no acumulen todo antes de enviarlo.

> **Nota de versión:** con `cacheComponents: true`, Next 16 rechaza `export const runtime = "nodejs"` en esta route. Se eliminó y se usó el runtime por defecto. Si ves ese error, no es un problema de tu lógica: es una restricción de la configuración.

#### `src/components/twin-chat.tsx`: la interfaz

El chat es un Client Component porque maneja estado, fetch, teclado y foco.

**Estado**

```tsx
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
const [input, setInput] = useState("");
const [isStreaming, setIsStreaming] = useState(false);
const [error, setError] = useState("");

const abortRef = useRef<AbortController | null>(null);
const scrollRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLTextAreaElement>(null);
const launcherRef = useRef<HTMLButtonElement>(null);
const panelRef = useRef<HTMLElement>(null);
```

- `useState` guarda datos que cambian y afectan la UI.
- `useRef` guarda una referencia mutable que **no** provoca re-render. Ideal para nodos del DOM, el `AbortController` y el temporizador.
- `messages` es la fuente de verdad de la conversación.
- `isStreaming` deshabilita el envío y muestra el botón de detener.

**Leer el stream**

```tsx
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  text += decoder.decode(value, { stream: true });
  setMessages([
    ...history,
    { id: assistantId, role: "assistant", content: text },
  ]);
}

text += decoder.decode();
```

- `getReader()` permite leer un stream por partes.
- `TextDecoder` convierte bytes en texto y maneja caracteres UTF-8 partidos entre chunks.
- Cada chunk actualiza el último mensaje del asistente.
- Al terminar, se hace una última decodificación para vaciar el buffer.
- Si el texto queda vacío, se muestra un error.

**Abortar, reintentar, reiniciar**

```tsx
function stop() {
  abortRef.current?.abort();
}

function retry() {
  if (isStreaming || messages[messages.length - 1]?.role !== "user") return;
  setError("");
  void runCompletion(messages);
}

function reset() {
  if (isStreaming) return;
  setMessages([welcomeMessage]);
  setError("");
  setInput("");
  window.requestAnimationFrame(() => inputRef.current?.focus());
}
```

- `AbortController` cancela la petición y el stream.
- Si el usuario detiene, se conserva la parte ya recibida.
- `retry` solo aparece cuando el último mensaje es del usuario, es decir, cuando no quedó una respuesta a medias.
- `reset` vuelve al mensaje de bienvenida. Está deshabilitado mientras se genera una respuesta para no mezclar estados.

**Foco, teclado y móvil**

```tsx
useEffect(() => {
  if (!open) return;

  const focusables = () =>
    Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );

  const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
  const mobile = window.matchMedia("(max-width: 639px)");
  const previousOverflow = document.body.style.overflow;
  let locked = false;

  if (mobile.matches) {
    document.body.style.overflow = "hidden";
    locked = true;
  }

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      window.requestAnimationFrame(() => launcherRef.current?.focus());
      return;
    }

    if (event.key !== "Tab") return;

    const items = focusables();
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  window.addEventListener("keydown", handleKey);

  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("keydown", handleKey);
    if (locked) document.body.style.overflow = previousOverflow;
  };
}, [open]);
```

- El panel es un diálogo con foco atrapado; en móvil, además, se bloquea el scroll del fondo.
- Al abrir, el foco va al textarea.
- Al cerrar con Escape, el foco vuelve al botón flotante.
- `focusables()` se recalcula en cada Tab porque los botones sugeridos desaparecen después del primer mensaje.
- El `aria-modal="true"` y el foco atrapado hacen que la experiencia sea coherente para teclado y lectores de pantalla.

**Enviar y no romper el historial**

```tsx
function sendMessage(prompt?: string) {
  const content = (prompt ?? input).trim();
  if (!content || isStreaming) return;

  const userMessage: ChatMessage = {
    id: createMessageId(),
    role: "user",
    content,
  };
  const history = [...messages, userMessage];

  setMessages(history);
  setInput("");
  setError("");
  window.requestAnimationFrame(() => inputRef.current?.focus());

  void runCompletion(history);
}
```

- Se crea un array nuevo. No se muta `messages` directamente.
- Se limpia el input y se devuelve el foco.
- `runCompletion` recibe el historial exacto, no depende de que el estado ya se haya actualizado.

El historial que se envía excluye el mensaje de bienvenida local:

```tsx
messages: history
  .filter((message) => message.id !== "welcome")
  .map(({ role, content }) => ({ role, content })),
```

Ese mensaje es una cortesía de la UI; no es una respuesta real del modelo y no necesita viajar en cada petición.

### 5.12 Metadatos, imagen social y 404

- `src/app/opengraph-image.tsx` genera una imagen de 1200×630 con `ImageResponse`. Solo admite un subconjunto de CSS y layouts flexibles. No uses grillas complejas ahí.
- `src/app/icon.svg` es el favicon. Se eliminó el favicon por defecto para que no compita.
- `src/app/not-found.tsx` da un 404 con la misma estética.
- `README.md` explica cómo ejecutar, qué scripts existen, dónde editar contenido y cómo funciona el chat.
- `Profile.pdf` es el material fuente. No se sirve al navegador porque está en la raíz, no en `public`.

### 5.13 Cómo se comprobó que funciona

Durante la construcción se verificó:

```bash
npm run lint
npm run typecheck
npm run build
```

También se probó en desarrollo y producción:

```bash
npm run dev -- -p 3100
npm run build
npm run start -- -p 3100
```

Las pruebas automatizadas ahora son permanentes: `npm test` ejecuta Vitest y `npm run test:e2e` ejecuta Playwright. También se verificó manualmente en:

- 320 px
- 390 px
- 768 px
- 1024 px
- 1440 px
- 1920 px

Se comprobó:

- Que no hubiera scroll horizontal.
- Que el menú móvil abriera, atrapara el foco, cerrara con Escape y devolviera el foco.
- Que el header mostrara el enlace activo correcto.
- Que el formulario abriera el cliente de correo.
- Que copiar el email mostrara el feedback.
- Que el chat respondiera de verdad con OpenRouter.
- Que la clave y el prompt no aparecieran en el JavaScript del cliente.
- Que no hubiera errores en consola.

Los flujos críticos ya tienen pruebas permanentes en `e2e/` y junto al código (`src/**/*.test.ts`). CI las ejecuta junto con lint, typecheck y build.

---

## 6. Errores reales y lecciones

Estos no son errores inventados para el tutorial. Aparecieron durante la construcción y enseñan más que una lista de buenas prácticas abstractas.

### 6.1 El header se recortaba a 768 px

- **Síntoma:** el botón “Hablemos” se salía de la pantalla en tablet.
- **Causa:** el logo, cinco enlaces y el botón no caben en 768 px con los espacios actuales.
- **Solución:** el menú de escritorio pasó de `md` (768 px) a `lg` (1024 px).
- **Lección:** los breakpoints no se eligen por costumbre; se eligen midiendo el contenido real.

### 6.2 `hidden` no ocultaba el botón

- **Síntoma:** “Hablemos” aparecía en móvil aunque tuviera `hidden`.
- **Causa:** `.btn` estaba fuera de una capa CSS y su `display: inline-flex` tenía más prioridad que la utilidad `hidden`.
- **Solución:** mover `.btn` a `@layer components`.
- **Lección:** en Tailwind, el orden de capas importa. Un componente propio puede pisar utilidades si no se declara en la capa correcta.

### 6.3 `aria-live` en el botón impedía ver “Copiado”

- **Síntoma:** el email se copiaba, pero el texto del botón no cambiaba.
- **Causa:** el anuncio vivo estaba en el propio botón interactivo.
- **Solución:** separar el anuncio en un `span` `sr-only` con `role="status"` y `aria-live="polite"`.
- **Lección:** las regiones vivas deben ser regiones dedicadas, no controles que también cambian de estado.

### 6.4 El título del hero se partía en tres líneas a 1920 px

- **Síntoma:** “Sistemas / con / intención” en pantallas muy anchas.
- **Causa:** el tamaño máximo era 9.5rem y la columna de texto no crecía en la misma proporción.
- **Solución:** bajar el máximo a 8.5rem.
- **Lección:** `clamp()` no alcanza si el contenedor tiene un ancho máximo propio. Hay que probar el layout completo, no solo la tipografía.

### 6.5 Un guion largo rompió los headers HTTP

- **Síntoma:** la API devolvía 502 y el servidor registraba `Cannot convert argument to a ByteString`.
- **Causa:** el header `X-Title` contenía “—”, un carácter fuera de Latin-1.
- **Solución:** usar un guion ASCII.
- **Lección:** los headers HTTP no son prosa. Mantenlos ASCII.

### 6.6 Next rechazó `runtime = "nodejs"`

- **Síntoma:** el build falló con “Route segment config runtime is not compatible with cacheComponents”.
- **Causa:** esa opción no es compatible con `cacheComponents` en esta versión.
- **Solución:** eliminar el export y usar el runtime por defecto.
- **Lección:** las versiones nuevas de frameworks cambian restricciones. Lee la documentación incluida y no copies configuraciones de tutoriales viejos.

### 6.7 La IA inventó tecnologías

- **Síntoma:** el gemelo dijo que manejaba HTML, CSS, JavaScript, Docker y CI/CD, datos que no estaban en el perfil.
- **Causa:** el modelo completó con un stack típico.
- **Solución:** reglas explícitas contra la invención y una frase específica para frontend/infraestructura.
- **Lección:** los prompts necesitan límites negativos. “No inventes” no siempre alcanza; hay que decir qué no completar.

### 6.8 La IA confundió el año de cursada

- **Síntoma:** dijo “cursé cuarto año desde 2020”.
- **Causa:** dos hechos separados se combinaron mal.
- **Solución:** reformular el hecho y prohibir explícitamente esa interpretación.
- **Lección:** la claridad del dato reduce la alucinación. Y siempre conviene probar las respuestas con preguntas trampa.

### 6.9 El scroll muy rápido podía saltarse reveals

- **Síntoma:** al hacer un salto grande, algunas secciones quedaban invisibles hasta volver a pasar.
- **Causa:** el `IntersectionObserver` con un margen negativo podía no observar un elemento que pasaba entre dos posiciones.
- **Solución:** margen inferior positivo de 200 px.
- **Lección:** las animaciones de scroll deben probarse con scroll lento y rápido. Una mejora pendiente es centralizar la observación y añadir un fallback.

---

## 7. Cómo modificar el sitio

### 7.1 Cambiar textos personales

Abre `src/lib/data.ts`. Ahí están `profile`, `navItems`, `timeline`, `stackGroups` y `projects`. Cambia el texto y guarda. El servidor de desarrollo recarga.

Si cambias el email o LinkedIn, actualizá `profileFacts` en `src/lib/data.ts`; el prompt del gemelo se genera desde ahí.

### 7.2 Cambiar el acento visual

Abre `src/app/globals.css` y cambia:

```css
--color-acid: #d8ff3e;
```

Prueba el contraste con el texto oscuro. El acento se usa sobre fondo `void` y como fondo de botones con texto `void`.

### 7.3 Agregar un proyecto

En `src/lib/data.ts`, añade otro objeto a `projects` con la misma forma:

```ts
{
  index: "04",
  title: "Nombre",
  kicker: "Subtítulo corto",
  body: "Descripción honesta.",
  tags: ["Tag"],
  status: "En preparación",
  href: profile.linkedin,
}
```

No inventes resultados. Si el proyecto todavía no existe, dilo.

### 7.4 Agregar una sección

1. Crea el componente en `src/sections/`.
2. Asígnale un `id` único.
3. Impórtalo y colócalo en `src/app/page.tsx`.
4. Agrégalo a `navItems` si debe aparecer en la navegación.
5. Ajusta el scrollspy: el header busca los `id` de `navItems`.

### 7.5 Cambiar el modelo o el prompt del gemelo

- Modelo: `TWIN_MODEL` en `src/lib/twin-server.ts`.
- Hechos: `profileFacts` en `src/lib/data.ts`.
- Personalidad y reglas: `buildTwinPrompt` en `src/lib/twin-server.ts`.
- Sugerencias y bienvenida: `src/lib/twin.ts`.
- Interfaz: `src/components/twin-chat.tsx` (launcher) y `twin-chat-panel.tsx` (panel).

Después de cambiar el prompt, prueba preguntas normales y preguntas trampa:

- “¿Tenés experiencia laboral?”
- “¿Cuántos años tenés?”
- “¿Cuál es tu expectativa salarial?”
- “¿Sos una persona?”
- “Contame tu stack.”

### 7.6 Checklist después de cada cambio

```bash
npm run lint
npm run typecheck
npm run build
```

Luego, en el navegador:

- Prueba 320 px, 390 px, 768 px, 1024 px y 1440 px.
- Abre el menú móvil con teclado.
- Abre el chat, envía una pregunta, detén una respuesta, reinicia.
- Copia el email.
- Revisa la consola.
- Comprueba que la clave no aparezca en el bundle del cliente.

---

## 8. Glosario

| Término | Significado |
| --- | --- |
| **HTML** | Lenguaje de estructura y significado de la web |
| **CSS** | Lenguaje de estilos y layout |
| **JavaScript** | Lenguaje de comportamiento del navegador |
| **TypeScript** | JavaScript con tipos que se comprueban al compilar |
| **JSX** | Sintaxis tipo HTML dentro de React/TypeScript |
| **Componente** | Función que devuelve una parte de la interfaz |
| **Props** | Datos que recibe un componente |
| **Estado** | Memoria interna que provoca re-render al cambiar |
| **Hook** | Función de React para usar estado, efectos o refs |
| **Server Component** | Componente que se ejecuta en el servidor y no envía interactividad |
| **Client Component** | Componente que se hidrata en el navegador y puede tener eventos |
| **Hidratación** | Proceso por el cual React toma el HTML del servidor y lo vuelve interactivo |
| **Route Handler** | Archivo que responde a una petición HTTP en Next.js |
| **API** | Interfaz de comunicación entre programas |
| **Endpoint** | URL concreta de una API |
| **Variable de entorno** | Valor de configuración externo al código; puede ser secreto |
| **Bundle** | Paquete de JavaScript que se envía al navegador |
| **Build** | Proceso de compilar y optimizar para producción |
| **Streaming** | Envío de datos por partes, sin esperar el resultado completo |
| **SSE** | Server-Sent Events; formato de stream usado por OpenRouter |
| **Token** | Unidad de texto que procesa un modelo de IA |
| **Prompt** | Instrucciones y contexto que recibe un modelo de IA |
| **Rate limit** | Límite de peticiones por usuario/tiempo |
| **Accesibilidad** | Diseño para que personas con distintas capacidades puedan usar el sitio |
| **Focus trap** | Mantener el foco del teclado dentro de un diálogo |
| **`inert`** | Atributo que hace que un subárbol no sea enfocable ni interactivo |
| **`prefers-reduced-motion`** | Preferencia del sistema para reducir animaciones |
| **`mailto:`** | Enlace que abre el cliente de correo del visitante |

---

## 9. Cinco mejoras recomendadas basadas en autorrevisión

Estas son las cinco mejoras que priorizaría después de revisar el código. **Ya están implementadas (2026-10-26)**; se conservan como explicación del razonamiento y del valor de cada una.

### 9.1 Una única fuente de verdad para el perfil y el prompt

**Problema:** los datos personales están duplicados en `src/lib/data.ts` y en `src/lib/twin-server.ts`. Si cambias el stack, la disponibilidad o el año de cursada en un lugar, el chat puede quedar desactualizado. La IA también podría responder con una versión vieja del perfil.

**Mejora:** crear un objeto estructurado de hechos (`profileFacts`) con nombre, formación, stack, idiomas, intereses y contacto. Que `data.ts` alimente la UI y que una función `buildTwinPrompt(profileFacts)` genere la parte factual del prompt. Las instrucciones de comportamiento pueden seguir separadas, porque son otra responsabilidad.

**Ventaja:** una sola edición actualiza el sitio y el gemelo. También permite escribir una prueba que compare los hechos del prompt con los de la UI.

**Costo:** hay que rediseñar un poco la forma en que se arma el prompt. El prompt no es solo datos; también tiene reglas de estilo y seguridad. Conviene separar “hechos” de “reglas”.

**Primer paso:** extraer `profile` y el stack a un objeto compartido, y hacer que el prompt se construya con una función que reciba ese objeto.

### 9.2 Cargar el chat de forma diferida

**Problema:** `TwinChat` se monta en el layout global y es un Client Component grande. Su JavaScript se descarga aunque el visitante nunca abra el chat. En un portfolio, la primera impresión pesa; cada kilobyte de JS compite con el contenido.

**Mejora:** separar el lanzador liviano del panel. Cargar el panel con `next/dynamic` la primera vez que se abre o se hace hover/focus sobre el lanzador. El lanzador puede seguir siendo estático o un componente mínimo.

**Ventaja:** menos JavaScript inicial, mejor tiempo de carga y mejor puntuación de rendimiento, especialmente en móvil.

**Costo:** la primera apertura del chat puede tener una pequeña demora. Se mitiga precargando el módulo en `pointerenter` o `focus`.

**Primer paso:** mover el panel a `TwinChatPanel.tsx`, importarlo con `dynamic(() => import(...), { ssr: false })` y renderizarlo solo cuando `open` sea verdadero.

### 9.3 Centralizar las animaciones de entrada y añadir fallbacks

**Problema:** cada `Reveal` crea su propio `IntersectionObserver`. Con muchas secciones funciona, pero no es la arquitectura más eficiente. Además, un scroll muy rápido puede saltarse un bloque y dejarlo invisible, y una captura de página completa o una impresión puede mostrar huecos.

**Mejora:** usar un solo observer compartido mediante un provider, o animaciones CSS con `animation-timeline: view()` y un fallback. Agregar estilos de impresión que hagan visibles todos los bloques. Probar con scroll rápido y con movimiento reducido.

**Ventaja:** menos trabajo para el navegador, comportamiento más predecible y mejor experiencia en impresión o capturas.

**Costo:** un provider añade una pieza de estado compartido. Las animaciones basadas en scroll tienen soporte desigual entre navegadores; siempre hace falta el fallback.

**Primer paso:** extraer la lógica del observer a un hook compartido o a un provider, y añadir una regla `@media print` que fuerce `opacity: 1`.

### 9.4 Endurecer y testear la capa de IA

**Problema:** el rate limit vive en memoria y se reinicia con el proceso; no sirve tal cual para varias instancias. El parser de SSE está dentro de la route, así que es difícil testearlo de forma aislada. El modelo es no determinista y puede cambiar su comportamiento. Tampoco hay persistencia de conversaciones.

**Mejora:** extraer el parser de SSE a una función pura y testearla con fragmentos simulados. Para producción, usar un limitador durable (por ejemplo, Redis/Upstash). Agregar identificadores de petición, métricas y un pequeño conjunto de evaluaciones con respuestas simuladas. Opcionalmente, guardar la conversación en `sessionStorage` para que no se pierda al recargar.

**Ventaja:** menos riesgo de abuso, errores diagnosticables y cambios de prompt verificables. La IA deja de ser una caja negra.

**Costo:** sumar un servicio externo y pruebas con mocks. Las evaluaciones de IA nunca son perfectas; hay que aceptar cierta variabilidad y evaluar por categorías.

**Primer paso:** mover el parseo de líneas `data:` a `parseOpenRouterChunk(buffer)` y escribir tests con casos de línea cortada, `[DONE]`, error y JSON inválido.

### 9.5 Agregar pruebas automatizadas y CI

**Problema:** la verificación se hizo con scripts temporales fuera del repositorio. En el futuro, un cambio en el menú, el formulario, el foco o el chat podría romper algo sin que nadie lo note hasta abrir el sitio a mano.

**Mejora:** incorporar Playwright para los flujos principales y Vitest para la lógica pura. Probar navegación, menú móvil, copiar email, formulario, apertura/cierre del chat, parser del stream y validación de la route. Sumar una comprobación de accesibilidad con axe y ejecutar `lint`, `typecheck`, tests y `build` en CI.

**Ventaja:** red de seguridad real. Los cambios de diseño se pueden hacer con menos miedo, y los errores se detectan antes de publicar.

**Costo:** las pruebas requieren mantenimiento. Las que llaman a un modelo real son lentas y caras; hay que mockear OpenRouter y dejar una prueba de integración manual o separada.

**Primer paso:** convertir el script temporal de Playwright en un test versionado para el menú móvil y el chat, y extraer la validación del route a una función testeable.
