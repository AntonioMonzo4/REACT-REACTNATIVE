# Unidad 02 — Vercel y Netlify

## Objetivos

- Entender qué hacen Vercel y Netlify por ti (build + hosting estático) sin gestionar servidores.
- Configurar build, output y **redirects de SPA** en ambas plataformas.
- Aprovechar los **deploy previews** por Pull Request.
- Evitar los errores que dejan las rutas de React Router en 404.

## Requisitos

- Saber qué produce `npm run build` en Vite (`dist/`).
- Concepto de rutas de React Router (SPA).
- (Recomendado) Haber leído la Unidad 01 de GitHub Actions y tener el repo en GitHub.

---

## Vercel

Vercel es "conecto el repo y listo": detecta el framework, ejecuta el build y sirve el resultado desde su CDN.

- Detecta Vite/Next automáticamente (`vercel` CLI o git integration).
- Build command: `npm run build` · Output: `dist` (Vite) o `.next` (Next.
- Env vars en dashboard (preview/production).
- Preview deployment por cada PR.

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # producción
```

Dos formas de desplegar:

1. **Integración git** (recomendada): en vercel.com conectas el repo; cada push a `main` va a producción y **cada PR recibe una URL de preview** única para revisar.
2. **CLI**: `vercel` crea un despliegue de preview de tu directorio actual; `vercel --prod` publica en producción. Útil para probar sin tocar el repo.

Las **env vars** se configuran en el dashboard y pueden tener valores distintos para *Preview* y *Production*, así un PR nunca usa la base de datos de producción.

---

## Netlify

Netlify es el equivalente directo: git integration, builds automáticos, previews por branch/PR y CDN global. Su configuración principal vive en `netlify.toml`:

- `netlify.toml`:

```toml
[build]
  command = "npm run build"
  directory = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- `[build]` le dice a Netlify cómo construir (`npm run build`) y **qué carpeta servir** (`dist`).
- El bloque `[[redirects]]` es el equivalente al `try_files` de Nginx del Módulo 18: cualquier ruta que no sea un fichero real cae en `index.html` con status 200, y React Router se encarga del resto.
- SPA redirects: **obligatorio** para React Router (equivalente a `try_files`).
- Contextos: production / deploy-preview / branch.
  - **production**: lo que hay en `main`.
  - **deploy-preview**: cada PR.
  - **branch**: cada rama desplegada. En cada contexto puedes usar distintas env vars.

---

## Comparativa rápida

| | Vercel | Netlify |
|---|--------|---------|
| Next.js | óptimo | bien |
| Edge/funcs | Edge, middleware | Functions |
| Precio | generoso free | generoso free |

- Si tu app es **Next.js**, Vercel (que lo mantiene) suele exprimirlo más.
- Para **Vite/React puro**, ambas van sobradas; elige por preferencia de UI, límites o ecosistema.
- Ambas ofrecen funciones serverless/edge si más adelante necesitas un endpoint.

---

## Errores comunes

- Olvidar redirect `/* → /index.html` (404 en rutas deep-link).
  - La app carga en `/` pero al recargar `/perfil` da 404. Añade el redirect de arriba (Netlify), el equivalente `rewrites` (Firebase) o `try_files` (Nginx propio).
- Rutas de build mal (`build` vs `dist`).
  - Si apuntas a la carpeta equivocada, el CDN sirve una carpeta vacía o los fuentes. Comprueba que `directory`/Output sea donde Vite escribe (`dist` por defecto).
- Subir `.env` con secrets pensando que es privado en front.
  - En un SPA **todo lo que se empaqueta en el bundle es público**. Los secretos van en variables de entorno del servidor (Functions/Edge) o en el backend; en el cliente solo URLs públicas y flags.

---

## Conceptos clave

| Término | Definición corta |
|---------|------------------|
| Plataforma estática | Servicio que hace build + CDN sin que gestiones servidores |
| Build command / Output | Cómo construir y qué carpeta publicar |
| SPA redirect / rewrite | Fallback a `index.html` para rutas de React Router |
| Deploy preview | URL única por PR/rama para revisar cambios |
| Contexto | production / deploy-preview / branch, con sus env vars |
| Edge / Functions | Código que corre cerca del usuario (o serverless) |

---

## Autoevaluación

1. El sitio funciona en `/` pero al entrar directamente a `/about` y recargar aparece 404. ¿Qué falta?

<details>
<summary>Respuesta</summary>

El redirect/rewrite de SPA: `/* → /index.html` (status 200) en Netlify, el `rewrites` equivalente en Firebase o `try_files ... /index.html` en Nginx. Sin él, el servidor no encuentra un fichero `about` real.
</details>

2. ¿Qué diferencia hay entre el despliegue de `main` y el de un PR en Vercel/Netlify?

<details>
<summary>Respuesta</summary>

`main` (production) es la web pública; cada PR/rama genera un **deploy preview** con su propia URL para revisar el cambio antes de merge, sin tocar producción. Cada contexto puede tener sus env vars.
</details>

3. Necesito una API key para llamar a un servicio de pago desde mi app Vite. ¿La pongo en el `.env` con prefijo `VITE_`?

<details>
<summary>Respuesta</summary>

No. Cualquier `VITE_*` queda embebida en el bundle JS público. La key debe vivir en el backend o en Functions/Edge con la variable en el dashboard de la plataforma; en el cliente solo datos públicos.
</details>

4. En `netlify.toml`, ¿qué significan `command` y `directory`?

<details>
<summary>Respuesta</summary>

`command` es el comando de build (`npm run build`) y `directory` es la carpeta resultante que Netlify publica (`dist` en Vite). Si `directory` está mal, se sirve una carpeta incorrecta o vacía.
</details>
