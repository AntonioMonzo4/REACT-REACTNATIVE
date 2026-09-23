# Unidad 02 — Vercel y Netlify

## Vercel

- Detecta Vite/Next automáticamente (`vercel` CLI o git integration).
- Build command: `npm run build` · Output: `dist` (Vite) o `.next` (Next).
- Env vars en dashboard (preview/production).
- Preview deployment por cada PR.

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # producción
```

## Netlify

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

- SPA redirects: **obligatorio** para React Router (equivalente a `try_files`).
- Contextos: production / deploy-preview / branch.

## Comparativa rápida

| | Vercel | Netlify |
|---|--------|---------|
| Next.js | óptimo | bien |
| Edge/funcs | Edge, middleware | Functions |
| Precio | generoso free | generoso free |

## Errores comunes

- Olvidar redirect `/* → /index.html` (404 en rutas deep-link).
- Rutas de build mal (`build` vs `dist`).
- Subir `.env` con secrets pensando que es privado en front.
