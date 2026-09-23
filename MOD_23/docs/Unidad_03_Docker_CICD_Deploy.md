# Unidad 03 — Docker, CI/CD y deploy

## Contenedores

- Multi-stage Vite → Nginx (M18 plantillas).
- API con su Dockerfile; `compose` para local (`web` + `api` + `db`).

## CI/CD mínimo del proyecto

```text
PR  → lint + tsc + unit tests (+ coverage)
main→ build + deploy preview
tag → deploy producción
```

Usa `MOD_19/plantillas/ci.yml` como base y añade `test:run` y paso de deploy.

## Deploy

| Front | API |
|-------|-----|
| Vercel/Netlify (`dist`, redirects SPA) | Railway/Render/VPS |
| o Nginx en VPS | FastAPI uvicorn detrás de proxy TLS |

- Secrets: GitHub Actions secrets / dashboard.
- Healthcheck `/health` en API.
- Logs estructurados (JSON) para depurar en prod.

## Definition of Done (proyecto final)

- [ ] Features MVP cerradas o marcadas out of scope
- [ ] `pnpm lint` + `pnpm test` + `pnpm build` en CI verde
- [ ] Cobertura ≥ 80 % en src crítica (o plan para subirla)
- [ ] README: screenshots, stack, run local, arquitectura
- [ ] Deploy live + seed de datos demo
- [ ] a11y audit (teclado + axe/lighthouse ≥ AA en lo esencial)
- [ ] `.env.example` documentado
