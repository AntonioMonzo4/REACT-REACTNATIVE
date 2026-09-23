# Unidad 01 — Visión y alcance del proyecto

## Qué es (y no es)

**Es** la integración de todo el roadmap en una app “empresa”: auth, roles, CRUD, dashboard, archivos, notificaciones, a11y, tests, Docker, CI/CD, deploy.

**No es** un clon pixel-perfect ni mobile-first obligatorio: prioriza **calidad demostrable** en entrevistas.

## Stack sugerido (portfolio)

| Capa | Opción A (todo JS) | Opción B (roadmap portfolio) |
|------|--------------------|------------------------------|
| Front | React + Vite | React + TS + Vite |
| API | Node/Express o FastAPI | **FastAPI + MySQL** (portfolio) |
| Estado | RTK o Zustand | según M9 |
| UI | Tailwind (M12) | Tailwind |
| Tests | Vitest + RTL (M10) | cobertura ≥ 80 % |
| Deploy | Vercel + API Railway | Docker + VPS/Cloud |

## MVP por fases

```text
F1  Catálogo público + login/registro
F2  Roles (user/admin) + CRUD con permisos
F3  Dashboard + subida de archivos
F4  Notificaciones + dark mode + i18n
F5  Tests + Dockerfile + CI + deploy
```

Regla: **cada fase deja la main verde** (build + tests).
