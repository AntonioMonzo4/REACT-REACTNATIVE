# Módulo 24 — Preparación Profesional

Material del **Módulo 24** del roadmap.

Este módulo cierra la parte "soft" de tu formación: no vas a aprender una librería nueva, sino a **trabajar como se trabaja en un equipo real** de desarrollo y a **prepararte para entrevistas**. Aquí se junta todo lo que un junior debe saber *además* de escribir código React: hablar el idioma de Scrum y Kanban, garantizar calidad automática con herramientas de lint/formato, hacer y recibir code reviews útiles, y defender tu proyecto en una entrevista técnica.

Si hasta ahora solo has "programado en tu habitación", este módulo es el puente hacia el trabajo en equipo.

## Para quién es este módulo

- **Va para ti si…** ya has pasado por los módulos de React (M4–M15), entiendes componentes, estado, hooks y TypeScript básico, pero **nunca has trabajado con un backlog, un PR real o un reviewer**.
- **No hace falta** que sepas de metodologías ágiles, Git avanzado a nivel de empresa ni tengas experiencia previa en entrevistas: aquí se explican desde cero, con analogías y ejemplos.
- **Sí conviene** tener a mano tu proyecto final (M23) y el ejemplo de testing (M10), porque la práctica consiste en aplicar lo del módulo a *ese* código, no a ejemplos inventados.

## Cómo estudiar

Sigue las fases en orden; cada una asimila la anterior.

| Fase | Qué haces | Unidad(es) | Tiempo orientativo |
|------|-----------|------------|--------------------|
| **1. Conceptos** | Lees la unidad completa sin saltarte "Errores comunes" y "Autoevaluación". Respondes la autoevaluación **antes** de abrir los `<details>`. | 01 y 02 | 1 sesión larga |
| **2. Manos a la obra** | Ejecutas los comandos reales en un repo de práctica (M10 o similar) y compruebas que los hooks disparan. | 02 (con Plantillas) | 1 sesión |
| **3. Simulación** | Haces la práctica del README: historias de usuario, code review simulada y grabación del pitch. Todo cuenta, nada es opcional. | 01, 03 y 04 | 1–2 sesiones |
| **4. Repaso** | Vuelves a la autoevaluación de cada unidad y al "Mapa con el README" de abajo; marcas lo que aún no dominas y lo repites. | todas | 30 min |

> **Consejo:** no te saltes la Fase 3. Leer sobre code review no es lo mismo que buscar tres problemas reales en un módulo antiguo; grabarte hablando dos minutos duele la primera vez y es exactamente por eso que funciona.

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

## Práctica mínima

Si solo tienes media hora y quieres sacar algo útil del módulo, haz **estas cuatro cosas** (son la versión reducida de la Práctica completa de abajo):

1. **10 historias** de tu proyecto final (M23) escritas con la fórmula "Como… quiero… para…" y al menos dos criterios de aceptación cada una.
2. **Un commit con formato convencional** (`feat: …`, `fix: …`) que pase el hook de commitlint.
3. **Una revisión de 10 minutos**: eliges un módulo antiguo y anotas 3 problemas (accesibilidad, rendimiento, seguridad).
4. **Un pitch de 2 minutos** grabado en el móvil.

Nada de esto requiere compañero, empresa ni herramientas de pago.

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
