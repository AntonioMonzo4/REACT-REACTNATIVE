# Módulo 24 — Preparación Profesional

Material del **Módulo 24** del roadmap.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — Scrum y Kanban](docs/Unidad_01_Scrum_Kanban.md) | Artefactos, WIP, Jira/ADO |
| [02 — Calidad de código](docs/Unidad_02_Calidad.md) | Prettier, Husky, lint-staged, commitlint |
| [03 — Code review](docs/Unidad_03_Review_Teams.md) | Feedback, PRs, pair programming |
| [04 — Entrevistas](docs/Unidad_04_Entrevistas.md) | JS/React/TS, algoritmos, pitch |

### Plantillas

- [`plantillas/.prettierrc`](plantillas/.prettierrc)
- [`plantillas/commitlint.config.js`](plantillas/commitlint.config.js)

## Práctica

```bash
cd ../MOD_10/EJEMPLO_REACT_TESTING   # o cualquier ejemplo
pnpm add -D prettier husky lint-staged @commitlint/cli @commitlint/config-conventional
# configura como en la Unidad 02 y comprueba pre-commit al hacer git commit
```

1. Escribe 10 historias del proyecto final (M23) con criterios de aceptación.
2. Formatea un ejemplo con Prettier y revisa el diff.
3. Simula una code review: busca 3 problemas (a11y, perf, seguridad) en un módulo antiguo.
4. Grábate 2 minutos de pitch + explica el M10 o el M9.

## Mapa con el README

- [x] Scrum
- [x] Kanban
- [x] Jira / Azure DevOps
- [x] ESLint (propio del repo)
- [x] Prettier / Husky / Commitlint
- [x] Code Review / PRs / convenciones
- [x] Entrevistas (JS, React, TS, algoritmos, pair)
- [ ] Hooks reales en un ejemplo — *pendiente de ejecución local con git commit*
