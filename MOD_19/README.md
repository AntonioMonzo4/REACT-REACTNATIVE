# Módulo 19 — CI/CD

Material del **Módulo 19** del roadmap.

**CI/CD** suena a siglas de consultora, pero la idea es simple: un **obrador automático** que, cada vez que haces `git push`, ejecuta solo tus comandos de siempre (lint, tests, build) en otra máquina y, si todo va bien, publica la nueva versión. Tú dejas de "acordarte" de comprobar cosas a mano; el obrador no olvida y no tiene mal día.

- **CI (Integración Continua)**: validar cada cambio (lint + tests + build) en cada push/PR.
- **CD (Despliegue Continuo/Entrega)**: si la validación pasa, llevar ese cambio a un entorno (preview o producción) automáticamente.

## Para quién es este módulo

- Ya sabes **React** y **git básico** (commit, push, PR).
- Has visto Docker en el Módulo 18 (ayuda, pero no es obligatorio para empezar).
- **No necesitas** saber GitHub Actions, Vercel ni Netlify: se explican desde cero.
- Quieres que tus proyectos se validen y se publiquen solos tras cada push.
- Ojo: algunas prácticas requieren **push real a GitHub**; pide confirmación antes de subir nada.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — GitHub Actions](docs/Unidad_01_GitHub_Actions.md) | Workflows, jobs, secrets |
| [02 — Vercel y Netlify](docs/Unidad_02_Vercel_Netlify.md) | Builds, SPA redirects, previews |
| [03 — Firebase y pipeline](docs/Unidad_03_Firebase_y_Pipeline.md) | Hosting, CI → deploy, checklist |

### Plantilla

- [`plantillas/ci.yml`](plantillas/ci.yml) — copia a `.github/workflows/ci.yml`

## Cómo estudiar

| Fase | Qué haces | Resultado |
|------|-----------|-----------|
| **1 — Mentalidad CI** | Lee la Unidad 01 sin ejecutar nada: workflow = obrador, job = obrero, step = tarea | Entiendes el vocabulario antes de tocar YAML |
| **2 — Primer workflow** | Copia `plantillas/ci.yml` a un ejemplo y ajusta scripts | Un push dispara lint + test + build en la nube |
| **3 — Plataformas de host** | Unidades 02 y 03: conecta Vercel/Netlify/Firebase al repo | Obtienes preview por PR y producción desde `main` |
| **4 — Pipeline completo** | Une CI + CD: build validado → deploy condicional | Tienes un CI/CD de verdad con checklist de seguridad |

## Práctica

1. Copia `plantillas/ci.yml` a `.github/workflows/ci.yml` de un ejemplo (p. ej. `MOD_10/EJEMPLO_REACT_TESTING`).
2. Ajusta package manager y scripts (`pnpm lint`, `pnpm test:run`, `pnpm build`).
3. `git push` → pestaña Actions del repo (requiere push; **pide confirmación**).
4. Conecta Vercel/Netlify al repo → preview por PR.

## Práctica mínima

Si solo puedes dedicar 30 minutos a este módulo:

1. Copia `plantillas/ci.yml` a `.github/workflows/ci.yml` en un proyecto de ejemplo y revisa que los scripts (`pnpm lint`, `pnpm test:run`, `pnpm build`) existan en tu `package.json`.
2. Haz `git push` a GitHub (pide confirmación si el repo no es tuyo) y mira la pestaña **Actions** quedarse en verde.
3. Conecta el repo a Vercel o Netlify y abre el link de **preview** de un PR.

Con eso ya tienes un CI básico funcionando; el resto afina deploy y seguridad.

## Mapa con el README

- [x] GitHub Actions
- [x] Vercel
- [x] Netlify
- [x] Firebase Hosting
- [ ] Pipeline real en este repo — *pendiente (requiere push a GitHub)*
