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
| 2 | Node.js para Frontend | ✅ | [`MOD_2/Node.js/`](MOD_2/Node.js/) — 16 unidades: qué es Node, Event Loop, Node vs navegador, casos de uso, npm, package.json, dependencias, scripts, node_modules, lock files, SemVer, npx, pnpm |
| 3 | TypeScript | ✅ | [`MOD_3/Typescript.md`](MOD_3/Typescript.md) + [`MOD_3/hello-world/`](MOD_3/hello-world/) (`pnpm run check` / `pnpm run build`) |

### React

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 4 | React desde Cero | ✅ | [`MOD_4/EJEMPLO_REACT/`](MOD_4/EJEMPLO_REACT/) — componentes (Props, Eventos, Hooks, useMemo), custom hook, estilos; `pnpm lint` y `pnpm build` OK. Ver también [`docs/extra.md`](MOD_4/EJEMPLO_REACT/docs/extra.md) |
| 5 | React Intermedio | ✅ | [`MOD_5/`](MOD_5/) — teoría (`docs/`: useRef, useReducer, useCallback, useLayoutEffect, formularios, comunicación) + [`EJEMPLO_REACT_INTERMEDIO/`](MOD_5/EJEMPLO_REACT_INTERMEDIO/) (`pnpm lint` / `pnpm build` OK). Pendiente: CRUD completo |
| 6 | React Avanzado | ✅ | [`MOD_6/`](MOD_6/) — teoría (`docs/`: Context, custom hooks, portals, lazy/Suspense, error boundaries, optimización) + [`EJEMPLO_REACT_AVANZADO/`](MOD_6/EJEMPLO_REACT_AVANZADO/) con chunk `HeavyPanel` separado. Pendiente: Dashboard |
| 7 | React Router | ❌ | — |
| 8 | Consumo de APIs | ❌ | — |
| 9 | Gestión de Estado | ❌ | — |
| 10 | Testing | ❌ | — |
| 11 | Arquitectura | ❌ | — |
| 12 | Diseño Profesional | ❌ | — |
| 13 | Patrones Avanzados | ❌ | — |
| 14 | TypeScript + React | ❌ | — (checklist en el README; combina M3 y M4) |
| 15 | Next.js y React Moderno | ❌ | — (React 19, App Router, React Compiler) |

### React Native

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 16 | React Native | ⚠️ | [`MOD_16/ReactNative/`](MOD_16/ReactNative/) — [`doc.md`](MOD_16/ReactNative/doc.md) (Expo SDK 57), [`README.md`](MOD_16/ReactNative/README.md), app Expo Router [`MiAplicacion/`](MOD_16/ReactNative/MiAplicacion/). Faltan: navegación, estado, APIs del dispositivo, proyecto final. **Nota:** carpeta antes `MOD_5` / `MOD_14`. |

### Backend para Frontend

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 17 | REST / GraphQL / FastAPI / WebSockets | ❌ | — |

### DevOps

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 18 | Docker | ❌ | — |
| 19 | CI/CD | ❌ | — |

### Optimización y calidad

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 20 | Optimización | ❌ | — (incluye DevTools Profiler) |
| 21 | Accesibilidad | ❌ | — |
| 22 | Seguridad | ❌ | — |

### Cierre profesional

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 23 | Proyecto Final | ❌ | — |
| 24 | Preparación Profesional | ❌ | — |

---

## Faltantes consolidados

- **Sin carpeta ni material:** módulos 0–1 (externos), 7–15, 17–24.
- **Parcial:** módulo 16 — solo intro a Expo, componentes base de la plantilla y docs; faltan secciones del checklist del README (FlatList, navegación, estado, cámara/GPS, etc.). Módulos 5 y 6: checklists de hooks/forms/avanzado cubiertos, faltan los **proyectos** (CRUD y Dashboard).
- **Nuevos en el roadmap (añadidos tras revisar huecos):** M14 TypeScript + React y M15 Next.js/React Moderno — checklist en el README, sin material aún.
- **Proyectos del roadmap sin empezar:** Calculadora (M4), CRUD (M5), Dashboard (M6), etc. — ver checklist en [`README.md`](README.md).
- **Enlaces pendientes:** repositorios de los módulos 0 y 1 en el README.

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

# Módulo 16 — Expo (requiere leer docs Expo v57 antes de editar código)
cd MOD_16/ReactNative/MiAplicacion
pnpm install
pnpm expo start
```
