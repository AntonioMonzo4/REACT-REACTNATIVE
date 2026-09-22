# 📖 Guía de Estudio — Curso React / React Native / TypeScript

Guía para alumnos: qué estudiar, en qué orden y con qué material disponible en este repositorio.

**Roadmap oficial (22 módulos):** [`README.md`](README.md)

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
3. **React** (módulos 4–13)
4. **React Native** (módulo 14)
5. **Complementos** (módulos 15–20): backend, DevOps, calidad
6. **Cierre profesional** (módulos 21–22): proyecto final y preparación

---

## Roadmap completo con estado del material

### Prerrequisitos

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 0 | Fundamentos de la Web | ❌ | Repositorio externo (HTML, CSS, JS) — *pendiente de enlazar* |
| 1 | Git Profesional | ❌ | Repositorio externo (Git, GitHub) — *pendiente de enlazar* |

### React y React Native

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 2 | Node.js para Frontend | ✅ | [`MOD_2/Node.js/`](MOD_2/Node.js/) — 16 unidades: qué es Node, Event Loop, Node vs navegador, casos de uso, npm, package.json, dependencias, scripts, node_modules, lock files, SemVer, npx, pnpm |
| 3 | TypeScript | ✅ | [`MOD_3/Typescript.md`](MOD_3/Typescript.md) + [`MOD_3/hello-world/`](MOD_3/hello-world/) (`pnpm run check` / `pnpm run build`) |
| 4 | React desde Cero | ✅ | [`MOD_4/EJEMPLO_REACT/`](MOD_4/EJEMPLO_REACT/) — componentes (Props, Eventos, Hooks, useMemo), custom hook, estilos; `pnpm lint` y `pnpm build` OK. Ver también [`docs/extra.md`](MOD_4/EJEMPLO_REACT/docs/extra.md) |

### React (continuación)

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 5 | React Intermedio | ❌ | — |
| 6 | React Avanzado | ❌ | — |
| 7 | React Router | ❌ | — |
| 8 | Consumo de APIs | ❌ | — |
| 9 | Gestión de Estado | ❌ | — |
| 10 | Testing | ❌ | — |
| 11 | Arquitectura | ❌ | — |
| 12 | Diseño Profesional | ❌ | — |
| 13 | Patrones Avanzados | ❌ | — |

### React Native

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 14 | React Native | ⚠️ | [`MOD_14/ReactNative/`](MOD_14/ReactNative/) — [`doc.md`](MOD_14/ReactNative/doc.md) (Expo SDK 57), [`README.md`](MOD_14/ReactNative/README.md), app Expo Router [`MiAplicacion/`](MOD_14/ReactNative/MiAplicacion/). Faltan: navegación, estado, APIs del dispositivo, proyecto final. **Nota:** esta carpeta se llamaba `MOD_5`. |

### Backend para Frontend

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 15 | REST / GraphQL / FastAPI / WebSockets | ❌ | — |

### DevOps

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 16 | Docker | ❌ | — |
| 17 | CI/CD | ❌ | — |

### Optimización y calidad

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 18 | Optimización | ❌ | — |
| 19 | Accesibilidad | ❌ | — |
| 20 | Seguridad | ❌ | — |

### Cierre profesional

| # | Módulo | Estado | Material en el repo |
|---|--------|--------|---------------------|
| 21 | Proyecto Final | ❌ | — |
| 22 | Preparación Profesional | ❌ | — |

---

## Faltantes consolidados

- **Sin carpeta ni material:** módulos 0–1 (externos), 5–13, 15–22.
- **Parcial:** módulo 14 — solo intro a Expo, componentes base de la plantilla y docs; faltan secciones del checklist del README (FlatList, navegación, estado, cámara/GPS, etc.).
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

# Módulo 14 — Expo (requiere leer docs Expo v57 antes de editar código)
cd MOD_14/ReactNative/MiAplicacion
pnpm install
pnpm expo start
```
