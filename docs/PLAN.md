# PLAN.md - Desarrollo de Portafolio Personal con Gemelo Digital

## Instrucciones para el Agente (OpenCode)
- Sigue este plan paso a paso.
- Marca los elementos de las listas de verificación (`[x]`) a medida que los completes.
- Asegúrate de implementar las pruebas y cumplir los criterios de éxito antes de pasar a la siguiente parte.
- **IMPORTANTE:** El usuario (Agus) debe revisar y aprobar este plan antes de ejecutar modificaciones estructurales importantes.

---

## Parte 1: Planificación y Estructura de Contexto
- [ ] Analizar el repositorio actual y la estructura del proyecto.
- [ ] Crear el archivo raíz `AGENTS.md` con la descripción general del proyecto, stack tecnológico y convenciones de código.
- [ ] Crear la carpeta `/frontend` (si no existe) y generar un archivo `AGENTS.md` dentro de ella que detalle la estructura de componentes de Next.js.
- [ ] **Aprobación:** Presentar el plan al usuario y obtener su visto bueno formal.
  - **Criterio de éxito:** Archivos `AGENTS.md` creados y plan validado por el usuario.

---

## Parte 2: Configuración de Infraestructura Base (Docker y FastAPI)
- [ ] Configurar el entorno del backend en la carpeta `/backend` utilizando **FastAPI** y **Uvicorn**.
- [ ] Configurar SQLite como motor de base de datos local ligero.
- [ ] Configurar la infraestructura de **Docker Compose** en la raíz del proyecto para orquestar Backend y Frontend.
- [ ] Escribir los scripts de inicio y parada en el directorio `/scripts` (`start.sh`, `stop.sh`).
- [ ] Implementar un endpoint básico `GET /` en FastAPI y una página de prueba en el backend que devuelva "Hola Mundo" para verificar la comunicación local.
  - **Pruebas:** Ejecutar `docker-compose up` y verificar que FastAPI responde correctamente en su puerto asignado.
  - **Criterio de éxito:** Contenedores levantándose sin errores y conectividad local confirmada mediante scripts.

---

## Parte 3: Desarrollo del Frontend del Portafolio (Next.js 16 + Tailwind v4)
- [ ] Inicializar **Next.js 16.4.2** (App Router) con **TypeScript 5**, **React 19.3** y **Tailwind CSS 4** dentro de `/frontend`.
- [ ] Estructurar las secciones principales del portafolio:
  - `Hero`: Presentación, rol (Ingeniería en Sistemas / Backend & Full-Stack) y llamados a la acción.
  - `About`: Biografía, formación en la UTN Santa Fe, tecnologías y habilidades (Java, Spring, Next.js, etc.).
  - `Projects`: Listado de proyectos destacados (ej. *Clase Ya*, monorepo distribuidos, etc.).
  - `Contact`: Formulario de contacto interactivo.
- [ ] Configurar el proxy o las variables de entorno de conexión con el backend FastAPI (manejo de CORS en FastAPI).
- [ ] Compilar el frontend estáticamente o configurarlo para servir integrado con el backend.
  - **Pruebas:** Pruebas unitarias de componentes con React Testing Library / Jest o Vitest; pruebas de renderizado responsivo con Tailwind v4.
  - **Criterio de éxito:** El portafolio compila sin errores de TypeScript y muestra todas las secciones estáticas correctamente conectadas al entorno local.

---

## Parte 4: Endpoints de Datos del Portafolio (Backend)
- [ ] Definir los modelos de datos en FastAPI para:
  - Proyectos (título, descripción, tecnologías, enlaces).
  - Mensajes de contacto (nombre, email, mensaje, fecha).
- [ ] Añadir rutas API REST en el backend:
  - `GET /api/projects`: Devuelve los proyectos para el portafolio.
  - `POST /api/contact`: Recibe y almacena los mensajes de contacto enviados por los visitantes.
- [ ] Implementar la creación automática de la base de datos SQLite si esta no existe al iniciar la aplicación.
  - **Pruebas:** Pruebas unitarias de FastAPI utilizando `TestClient` para verificar inserción de mensajes y lectura de proyectos.
  - **Criterio de éxito:** Endpoints respondiendo correctamente y persistencia de datos validada en SQLite.

---

## Parte 5: Integración Frontend + Backend (Persistencia)
- [ ] Conectar la sección de *Projects* del frontend para que consuma los datos dinámicamente desde el backend de FastAPI.
- [ ] Conectar el formulario de *Contact* del frontend para que envíe los datos mediante un `POST` al backend y muestre estados de éxito/error al usuario.
  - **Pruebas:** Pruebas de integración end-to-end (E2E) simulando el envío de un mensaje de contacto y la visualización de proyectos.
  - **Criterio de éxito:** La aplicación funciona de forma persistente comunicando Next.js con FastAPI y SQLite.

---

## Parte 6: Gemelo Digital y Conectividad con IA (OpenRouter)
- [ ] Diseñar la interfaz de usuario del Chat / Gemelo Digital en el frontend (componente flotante o sección dedicada).
- [ ] Configurar el backend para realizar llamadas seguras a la API de **OpenRouter** utilizando variables de entorno (`OPENROUTER_API_KEY`).
- [ ] Crear un **System Prompt** especializado para el gemelo digital que le otorgue contexto sobre ti (carrera en UTN Santa Fe, stack técnico, proyectos, filosofía profesional) para que actúe como tu avatar.
- [ ] **Protección contra Abuso y Rate Limiting (Crítico para Visitantes Anónimos):**
  - Implementar un sistema de limitación de tasa (*Rate Limiting* por IP) en FastAPI para evitar saturación del chat o ataques de denegación de servicio (DoS).
  - Configurar límites estrictos de tokens por respuesta en OpenRouter para controlar costos.
  - Añadir sanitización básica de entradas de usuario para prevenir inyecciones o prompts maliciosos.
- [ ] Crear el endpoint `/api/chat` en el backend que procese las preguntas del usuario anónimo de forma segura.
  - **Pruebas:** 
    - Prueba de conectividad simple ("2+2") con OpenRouter.
    - Prueba de estrés / límite de tasa (*Rate Limit test*) enviando múltiples peticiones rápidas desde una misma IP para verificar que el backend bloquea el abuso correctamente.
  - **Criterio de éxito:** El gemelo digital responde con contexto personalizado sobre ti de manera fluida y el sistema cuenta con protecciones activas contra saturación de llamadas y usuarios maliciosos.