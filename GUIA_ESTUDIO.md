# 📖 Guía de Estudio — Curso React / React Native / TypeScript

Guía para alumnos: qué estudiar, en qué orden y con qué material disponible en este repositorio.

**Roadmap oficial (24 módulos):** [`README.md`](README.md)

## Leyenda de estados

| Icono | Significado |
|-------|-------------|
| ✅ | Material completo y verificado en el repo |
| ⚠️ | Material parcial |
| ❌ | Sin material aún |

---

## Orden de estudio recomendado

1. **Prerrequisitos** (módulos 0–1, en otros repositorios)
2. **Base técnica** (módulos 2–3): Node.js y TypeScript
3. **React** (módulos 4–15): de cero a Next.js/React moderno
4. **React Native** (módulo 16)
5. **Complementos** (módulos 17–22): backend, DevOps, calidad
6. **Cierre profesional** (módulos 23–24): proyecto final y preparación

---

## Roadmap completo con estado del material

### Prerrequisitos

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 0 | Fundamentos de la Web | ❌ | Repositorio externo (HTML, CSS, JS) — *pendiente de enlazar* |
| 1 | Git Profesional | ❌ | Repositorio externo (Git, GitHub) — *pendiente de enlazar* |

### Base

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 2 | Node.js para Frontend | ✅ | [`MOD_2/`](MOD_2/) — teoría (`docs/`: 16 unidades: Node, Event Loop, npm, package.json, SemVer, npx, pnpm…) |
| 3 | TypeScript | ✅ | [`MOD_3/`](MOD_3/) — teoría (`docs/`: 8 unidades: tipos, interfaces, enums, generics, utility/mapped/conditional types) + [`hello-world/`](MOD_3/hello-world/) (`pnpm run check` / `pnpm run build`) |

### React

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 4 | React desde Cero | ✅ | [`MOD_4/`](MOD_4/) — teoría (`docs/`: 7 unidades: React intro, componentes, props/map, eventos, useState, hooks, estilos) + [`EJEMPLO_REACT/`](MOD_4/EJEMPLO_REACT/) — componentes (Props, Eventos, Hooks, useMemo), custom hook, estilos; `pnpm lint` y `pnpm build` OK |
| 5 | React Intermedio | ✅ | [`MOD_5/`](MOD_5/) — teoría (`docs/`: useRef, useReducer, useCallback, useLayoutEffect, formularios, comunicación) + [`EJEMPLO_REACT_INTERMEDIO/`](MOD_5/EJEMPLO_REACT_INTERMEDIO/) (`pnpm lint` / `pnpm build` OK). Pendiente: CRUD completo |
| 6 | React Avanzado | ✅ | [`MOD_6/`](MOD_6/) — teoría (`docs/`: Context, custom hooks, portals, lazy/Suspense, error boundaries, optimización) + [`EJEMPLO_REACT_AVANZADO/`](MOD_6/EJEMPLO_REACT_AVANZADO/) con chunk `HeavyPanel` separado. Pendiente: Dashboard |
| 7 | React Router | ✅ | [`MOD_7/`](MOD_7/) — teoría (`docs/`: BrowserRouter, params, query, nested, protected, lazy) + [`EJEMPLO_REACT_ROUTER/`](MOD_7/EJEMPLO_REACT_ROUTER/) (`pnpm lint` / `pnpm build` OK). Pendiente: proyecto Sistema de autenticación |
| 8 | Consumo de APIs | ✅ | [`MOD_8/`](MOD_8/) — teoría (`docs/`: HTTP/REST, fetch, axios, JWT, storage) + [`EJEMPLO_REACT_API/`](MOD_8/EJEMPLO_REACT_API/) contra JSONPlaceholder (`pnpm lint` / `pnpm build` OK). Pendiente: proyecto con API propia |
| 9 | Gestión de Estado | ✅ | [`MOD_9/`](MOD_9/) — teoría (`docs/`: Context, RTK, Zustand, Jotai, comparativa) + [`EJEMPLO_REACT_ESTADO/`](MOD_9/EJEMPLO_REACT_ESTADO/) (`pnpm lint` / `pnpm build` OK). Pendiente: proyecto E-commerce |
| 10 | Testing | ✅ | [`MOD_10/`](MOD_10/) — teoría (`docs/`: Jest/Vitest, RTL, mocking, unit, integration) + [`EJEMPLO_REACT_TESTING/`](MOD_10/EJEMPLO_REACT_TESTING/) (11 tests OK: `pnpm test:run`, lint y build OK). Pendiente: cobertura > 80 % en proyecto real |
| 11 | Arquitectura | ✅ | [`MOD_11/`](MOD_11/) — teoría (`docs/`: Atomic, Feature Based, Clean, modularización, DDD) + [`EJEMPLO_ARQUITECTURA/`](MOD_11/EJEMPLO_ARQUITECTURA/) (`pnpm lint` / `pnpm build` OK) |
| 12 | Diseño Profesional | ✅ | [`MOD_12/`](MOD_12/) — teoría (`docs/`: Tailwind, MUI, Chakra, shadcn, CSS Modules, styled) + [`EJEMPLO_DISENO/`](MOD_12/EJEMPLO_DISENO/) Tailwind v4 (`pnpm lint` / `pnpm build` OK). Pendiente: proyecto Sistema de componentes |
| 13 | Patrones Avanzados | ✅ | [`MOD_13/`](MOD_13/) — teoría (`docs/`: compound, render props, HOC, hooks avanzados, DI) + [`EJEMPLO_PATRONES/`](MOD_13/EJEMPLO_PATRONES/) (`pnpm lint` / `pnpm build` OK) |
| 14 | TypeScript + React | ✅ | [`MOD_14/`](MOD_14/) — teoría (`docs/`: componentes, eventos, hooks generics, unions, JSX+TS) + [`EJEMPLO_TS_REACT/`](MOD_14/EJEMPLO_TS_REACT/) (`pnpm run check` / lint / build OK). Pendiente: migrar M4 a TS |
| 15 | Next.js y React Moderno | ✅ | [`MOD_15/`](MOD_15/) — teoría (`docs/`: React 19, server/client, routing, SSR/SSG/ISR, route handlers, compiler) + [`EJEMPLO_MODERNO/`](MOD_15/EJEMPLO_MODERNO/) React 19 (`pnpm lint` / `pnpm build` OK). Pendiente: proyecto App full-stack Next (pasos en README M15) |

### React Native

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 16 | React Native | ⚠️ | [`MOD_16/`](MOD_16/) — teoría (`docs/`: Expo SDK 57) + [`ReactNative/`](MOD_16/ReactNative/) ([`README.md`](MOD_16/ReactNative/README.md), app Expo Router [`MiAplicacion/`](MOD_16/ReactNative/MiAplicacion/)). Faltan: navegación, estado, APIs del dispositivo, proyecto final. **Nota:** carpeta antes `MOD_5` / `MOD_14`. |

### Backend para Frontend

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 17 | REST / GraphQL / FastAPI / WebSockets | ✅ | [`MOD_17/`](MOD_17/) — teoría (`docs/`: REST/GraphQL, FastAPI, WebSockets, autenticación). Práctica: backend propio con snippets de los docs (fuera del repo) |

### DevOps

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 18 | Docker | ✅ | [`MOD_18/`](MOD_18/) — teoría (`docs/`) + [`plantillas/`](MOD_18/plantillas/) (Dockerfile multi-stage, compose, nginx SPA). Ejecución: requiere Docker Desktop local |
| 19 | CI/CD | ✅ | [`MOD_19/`](MOD_19/) — teoría (`docs/`) + [`plantillas/ci.yml`](MOD_19/plantillas/ci.yml). Pipeline real: requiere push a GitHub (*confirmar*) |

### Optimización y calidad

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 20 | Optimización | ✅ | [`MOD_20/`](MOD_20/) — teoría (`docs/`: Lighthouse, bundle/analyser, memo/Profiler/WDUR). Práctica: medir cualquier `EJEMPLO_*` |
| 21 | Accesibilidad | ✅ | [`MOD_21/`](MOD_21/) — teoría (`docs/`: WCAG, teclado, screen readers/ARIA). Auditoría manual pendiente en un ejemplo |
| 22 | Seguridad | ✅ | [`MOD_22/`](MOD_22/) — teoría (`docs/`: XSS/CSRF, CORS/OAuth, JWT) |

### Cierre profesional

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 23 | Proyecto Final | ⚠️ | [`MOD_23/`](MOD_23/) — guía de integración (`docs/`: MVP, features, Docker/CI). La app completa es el **proyecto del curso** (checklist en README) |
| 24 | Preparación Profesional | ✅ | [`MOD_24/`](MOD_24/) — teoría (`docs/`: Scrum/Kanban, calidad, reviews, entrevistas) + [`plantillas/`](MOD_24/plantillas/) (prettier, commitlint) |

---

## Faltantes consolidados

- **Sin carpeta ni material:** módulos 0–1 (externos, *pendiente de enlazar*).
- **Parcial:** módulo 16 — solo intro a Expo, componentes base de la plantilla y docs; faltan secciones del checklist del README (FlatList, navegación, estado, cámara/GPS, etc.). Módulo 23 — guía ✅, la app empresarial sigue pendiente. Módulos 5 y 6: checklists de hooks/forms/avanzado cubiertos, faltan los **proyectos** (CRUD y Dashboard). Módulos 7–10: temario cubierto, faltan los **proyectos** (auth, API propia, E-commerce, cobertura > 80 %).
- **Nuevos en el roadmap (añadidos tras revisar huecos):** M14 TypeScript + React y M15 Next.js/React moderno — ambos con material ✅ en el repo.
- **Proyectos del roadmap sin empezar:** Calculadora (M4), CRUD (M5), Dashboard (M6), Sistema de autenticación (M7), Frontend con API (M8), E-commerce (M9), cobertura > 80 % (M10), migrar M4 a TS (M14), App full-stack Next (M15), App empresarial completa (M23), etc. — ver checklist en [`README.md`](README.md).
- **Ejecución local pendiente (requiere acción externa):** build Docker (M18), pipeline GitHub Actions (M19, necesita push), hooks Husky (M24, necesita commit), backend FastAPI propio (M17), proyecto M16 Expo.
- **Enlaces pendientes:** repositorios de los módulos 0 y 1 en el README.
- **Commit del material nuevo:** sin confirmar (no hacer push/commit sin tu OK).

---

## Recursos: `libros/`

| Archivo | Tema |
|---------|------|
| [`ReactJSNotesForProfessionals.pdf`](libros/ReactJSNotesForProfessionals.pdf) | React (notas) |
| [`React_Cheatsheet_Zero_To_Mastery_V1.02.pdf`](libros/React_Cheatsheet_Zero_To_Mastery_V1.02.pdf) | React cheatsheet |
| [`ReactNativeNotesForProfessionals.pdf`](libros/ReactNativeNotesForProfessionals.pdf) | React Native (notas) |
| [`survivejs-react-es.pdf`](libros/survivejs-react-es.pdf) | SurviveJS React (español) |

---

## Comandos útiles

```bash
# Módulo 3 — TypeScript
cd MOD_3/hello-world
pnpm install
pnpm run check   # typecheck
pnpm run build   # compila a dist/

# Módulo 4 — React (Vite)
cd MOD_4/EJEMPLO_REACT
pnpm install
pnpm lint
pnpm build

# Módulo 5 — React Intermedio
cd MOD_5/EJEMPLO_REACT_INTERMEDIO
pnpm install
pnpm lint
pnpm build

# Módulo 6 — React Avanzado
cd MOD_6/EJEMPLO_REACT_AVANZADO
pnpm install
pnpm lint
pnpm build

# Módulo 7 — React Router
cd MOD_7/EJEMPLO_REACT_ROUTER
pnpm install
pnpm lint
pnpm build

# Módulo 8 — Consumo de APIs
cd MOD_8/EJEMPLO_REACT_API
pnpm install
pnpm lint
pnpm build

# Módulo 9 — Gestión de Estado
cd MOD_9/EJEMPLO_REACT_ESTADO
pnpm install
pnpm lint
pnpm build

# Módulo 10 — Testing
cd MOD_10/EJEMPLO_REACT_TESTING
pnpm install
pnpm test:run
pnpm lint
pnpm build

# Módulo 11 — Arquitectura
cd MOD_11/EJEMPLO_ARQUITECTURA
pnpm install
pnpm lint
pnpm build

# Módulo 12 — Diseño Profesional
cd MOD_12/EJEMPLO_DISENO
pnpm install
pnpm lint
pnpm build

# Módulo 13 — Patrones Avanzados
cd MOD_13/EJEMPLO_PATRONES
pnpm install
pnpm lint
pnpm build

# Módulo 14 — TypeScript + React
cd MOD_14/EJEMPLO_TS_REACT
pnpm install
pnpm run check
pnpm lint
pnpm build

# Módulo 15 — React Moderno (Vite) / Next: ver MOD_15/README.md
cd MOD_15/EJEMPLO_MODERNO
pnpm install
pnpm lint
pnpm build

# Módulo 16 — Expo (requiere leer docs Expo v57 antes de editar código)
cd MOD_16/ReactNative/MiAplicacion
pnpm install
pnpm expo start

# Módulo 17 — FastAPI (snippet en MOD_17/docs/Unidad_02; venv aparte)
pip install fastapi "uvicorn[standard]"
uvicorn main:app --reload

# Módulo 18 — Docker (requiere Docker Desktop)
docker build -t curso-react:vite -f MOD_18/plantillas/Dockerfile.frontend .
docker compose -f MOD_18/plantillas/compose.yaml config

# Módulo 19 — CI/CD: copiar plantilla y hacer push (pedir confirmación)
# cp MOD_19/plantillas/ci.yml .github/workflows/ci.yml

# Módulo 24 — Calidad (en un ejemplo, tras configurar husky)
pnpm add -D prettier husky lint-staged @commitlint/cli @commitlint/config-conventional
```
