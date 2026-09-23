# Módulo 23 — Proyecto Final

Material de apoyo para el **Módulo 23** (aplicación empresarial completa). No es un módulo de teoría nueva: **integra** M2–M22.

Este es el módulo donde dejas de "hacer ejercicios sueltos" y construyes **una sola aplicación que demuestre todo el roadmap**. Aquí no aprenderás un framework nuevo: aprenderás a *gestionar* un proyecto de verdad —definir un MVP, partirlo en fases, decidir qué entra y qué se queda fuera, automatizar con CI/CD y declarar terminado algo con criterios objetivos—.

El enfoque es **gestión de proyecto para quien viene de cero** en eso: quizás nunca has abierto un issue, nunca has ramificado a `feature/*`, nunca has escrito una "Definition of Done". Si React ya te es familiar (M4–M15) y has tocado auth (M7/M8), este módulo es la puerta entre "sé programar" y "sé entregar software".

---

## Para quién es este módulo

- **Ya has estudiado React** (aprox. M4–M15): componentes, hooks, formularios, rutas, estado, consumo de APIs. No necesitas ser experto, pero el proyecto integrará todo eso, así que conviene no ir a ciegas.
- **Tienes nociones de auth** (M7 routes, M8 tokens/sesiones): el proyecto incluye login, roles y permisos, y se apoya en lo que ya viste.
- **Vienes de cero en gestión de proyecto**: no sabes qué es un MVP, una fase, un pipeline o una Definition of Done. Todo se explica desde cero con ejemplos y una secuencia concreta de pasos.
- **Vienes de cero (o casi) en Docker/CI/CD/deploy**: se parte de las plantillas ya vistas en M18/M19; no hace falta experiencia previa con contenedores.
- **No necesitas** un diseño original ni clonar pixel-perfect una web famosa: lo que se valora es **calidad demostrable** (tests, CI verde, deploy vivo) para entrevistas y portfolio.

Si este es tu primer proyecto "grande", lee primero la Unidad 01 entera antes de tocar el editor: el orden en que hagas las cosas importa más que la cantidad de features.

---

## Cómo estudiar

| Fase | Qué haces | Duración orientativa | Resultado |
|------|-----------|----------------------|-----------|
| **1 — Visión y alcance** | Lee la Unidad 01. Elige stack (Opción A o B), define las 5 fases (F1–F5) y las conviertes en issues o tarjetas. Decide qué queda *out of scope*. | 1 sesión de planificación | Tablero/issue list con las 5 fases; README borrador con stack y alcance |
| **2 — Esqueleto + primeros features** | Sigue "Cómo empezar" de este README: scaffold (estructura M11, UI M12, auth M7+M8, estado M9), backend M17 con `/health`, CI desde el día 1 (M19). Completa F1 y F2 de la Unidad 02. | Varias sesiones | App desplegable con login, roles y CRUD básico; `main` verde en CI |
| **3 — Features de producto** | F3 y F4: dashboard, archivos, notificaciones, dark mode, i18n, tests (Unidad 02). Prioriza lo del checklist; lo bonito al final. | Varias sesiones | Checklist del README mayoritariamente marcado |
| **4 — Entrega y cierre** | F5 + Unidad 03: Docker, pipeline completo, deploy, Definition of Done. Revisa seguridad (M22) y accesibilidad antes de dar por terminado. | 1–2 sesiones de empaque | Deploy live + README final + DoD completada |

Regla transversal: **cada fase deja la main verde** (build + tests). Si la fase 3 rompe CI, no se empieza la 4.

---

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — Visión y MVP](docs/Unidad_01_Vision_MVP.md) | Stack, fases, prioridades |
| [02 — Features](docs/Unidad_02_Features.md) | Auth, CRUD, dashboard, dark, i18n, tests |
| [03 — Docker/CI/CD](docs/Unidad_03_Docker_CICD_Deploy.md) | Pipeline y Definition of Done |

---

## Checklist del roadmap (M23)

- [ ] Login
- [ ] Registro
- [ ] Roles
- [ ] Dashboard
- [ ] CRUD
- [ ] Subida de archivos
- [ ] Notificaciones
- [ ] Modo oscuro
- [ ] Internacionalización
- [ ] Testing
- [ ] Docker
- [ ] CI/CD
- [ ] Deploy

---

## Cómo empezar

1. Define 5 fases (Unidad 01) en issues o tarjetas.
2. Scaffold: copia lo aprendido (estructura M11, UI M12, auth M7+M8, estado M9).
3. Backend: M17 (FastAPI o Node) con `/health`.
4. CI desde el día 1 (plantilla M19).
5. Solo entonces features “bonitas” (i18n, dark, notis).

Comentario de por qué este orden y no otro: las fases primero porque sin alcance todo crece sin control; el scaffold y el backend con `/health` porque CI necesita *algo* que buildar y *algo* a lo que hacer ping; la CI **desde el día 1** porque montarla al final duele el doble; y las features “bonitas” al final porque son las que con más frecuencia se retrasan y las que menos aportan si el cimiento (auth, CRUD, tests) no está firme.

---

## Práctica mínima

Si tu tiempo es limitado, esto es lo **imprescindible** para que el proyecto cuente como M23 completo. Todo lo demás (i18n, notificaciones avanzadas, gráficos...) es ampliación.

| # | Acción mínima | Por qué es suficiente (y por qué no menos) |
|---|---------------|--------------------------------------------|
| 1 | Las 5 fases (F1–F5) escritas en issues/tarjetas con alcance definido | Demuestra **gestión**, que es justo lo que enseña este módulo; sin esto, es "otro repo con features" |
| 2 | Login + roles + CRUD funcionando con permisos **también en la API** | El 80 % de las apps de empresa se sostienen sobre esto; integra M7/M8/M22 |
| 3 | `pnpm lint` + `pnpm test` + `pnpm build` verdes en CI (plantilla M19) | Un pipeline verde es la señal más creíble de calidad ante un reclutador |
| 4 | Un solo deploy live + `/health` + seed de datos demo | Sin deploy no hay "proyecto terminado"; con seed, el entrevistador puede clicar sin pedirte cuentas |
| 5 | Definition of Done (Unidad 03) revisada y README con screenshots | Cierra el círculo: criterios objetivos de "terminado" y puerta de entrada para quien evalúe |

Tiempo estimado de la práctica mínima: **varias sesiones concentradas en F1–F2 + F5**, dejando F3–F4 como ampliación. Si solo puedes hacer una cosa extra tras la práctica mínima, añade **testing con cobertura** (cierra el checklist y es lo primero que se pregunta en entrevistas técnicas).

---

## Mapa con el README

- [x] Guía de visión, features y pipeline
- [ ] Aplicación empresarial completa — *proyecto de curso, no commiteada aquí*
