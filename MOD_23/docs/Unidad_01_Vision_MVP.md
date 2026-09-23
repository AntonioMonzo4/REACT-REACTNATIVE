# Unidad 01 — Visión y alcance del proyecto

## Objetivos

Al terminar esta unidad serás capaz de:

- Explicar qué es (y qué **no** es) el proyecto final del curso, y por qué el objetivo es *calidad demostrable*, no un clon pixel-perfect.
- Elegir un stack de portfolio justificando cada capa (front, API, estado, UI, tests, deploy).
- Definir un **MVP** y partirlo en **5 fases (F1–F5)** con una regla de oro: cada fase deja la `main` verde.
- Convertir esas fases en issues o tarjetas de tablero y decidir conscientemente qué queda *out of scope*.

## Requisitos

- Conocimientos de React del M4 al M15 (componentes, hooks, formularios, rutas, estado, APIs).
- Nociones de auth de M7 (rutas protegidas) y M8 (login/tokens).
- Git básico: `clone`, `commit`, `branch`, `push`. No hace falta dominar flujos avanzados.
- **No** se requiere experiencia previa en gestión de proyecto, Docker ni arquitectura: todo eso llega en las unidades siguientes.

---

## Gestión de proyecto desde cero: la analogía del viaje

Si nunca has gestionado un proyecto, piensa en preparar un viaje largo. Si solo dices *"quiero irme de viaje"*, acabarás sin billete, con la mochila a medias y sin saber qué ver. En cambio, si defines **destino** (visión), **etapas** (fases), **equipo mínimo** (stack) y **checklist de salida** (Definition of Done), el viaje ocurre aunque aparezcan imprevistos.

Un proyecto de software es lo mismo:

- **Visión** = a dónde vamos y qué *no* vamos a ver (alcance).
- **MVP** = lo mínimo que ya sirve para demostrar el destino.
- **Fases** = hitos en los que el proyecto siempre "funciona" (main verde).
- **Stack** = con qué transporte viajamos; elegido, no improvisado en ruta.
- **DoD** = las maletas cerradas antes de salir del hotel (Unidad 03).

Este módulo trata justamente de eso: no de *qué botones pulsar en React*, sino de **cómo no perderse** cuando el proyecto crece.

---

## Qué es (y no es)

**Es** la integración de todo el roadmap en una app “empresa”: auth, roles, CRUD, dashboard, archivos, notificaciones, a11y, tests, Docker, CI/CD, deploy.

Es decir: un solo repositorio donde conviven lo aprendido en M2–M22. No es una suma de ejercicios aislados: cada feature debe **conectar** con las demás (el CRUD respeta roles, los tests cubren la auth, el deploy sirve el todo).

**No es** un clon pixel-perfect ni mobile-first obligatorio: prioriza **calidad demostrable** en entrevistas.

Dos aclaraciones importantes para quien viene de cero:

- **No es un clon pixel-perfect**: copiar al píxel una web famosa consume semanas en detalles visuales que no demuestran programación. Un entrevistador valora más: *«aquí hay tests, hay CI, hay permisos reales en la API y está desplegado»*.
- **No es obligatorio mobile-first**: el proyecto debe ser *usable* en móvil (responsive razonable), pero no hace falta empezar por ahí si tu tiempo es limitado. La prioridad es la **calidad demostrable**: build verde, cobertura, seguridad básica (M22), deploy vivo y README claro.

Pregúntate siempre, al considerar una feature nueva: *¿esto mejora lo que puedo demostrar en una entrevista o en mi portfolio?* Si la respuesta es "solo se ve bonito", pospónlo.

---

## Stack sugerido (portfolio)

| Capa | Opción A (todo JS) | Opción B (roadmap portfolio) |
|------|--------------------|------------------------------|
| Front | React + Vite | React + TS + Vite |
| API | Node/Express o FastAPI | **FastAPI + MySQL** (portfolio) |
| Estado | RTK o Zustand | según M9 |
| UI | Tailwind (M12) | Tailwind |
| Tests | Vitest + RTL (M10) | cobertura ≥ 80 % |
| Deploy | Vercel + API Railway | Docker + VPS/Cloud |

Cómo leer esta tabla si es tu primera vez eligiendo stack:

- **Opción A (todo JS)**: la vía más rápida si TypeScript todavía te frena. Todo JavaScript, herramientas maduras, despliegue sencillo en PaaS (Vercel + Railway). Perfecta si tu prioridad es **terminar**.
- **Opción B (roadmap portfolio)**: la vía que mejor se ve en un CV siguiendo este curso: TypeScript, FastAPI + MySQL (la combinación que se ha trabajado en el portfolio del roadmap), tests con cobertura ≥ 80 % y despliegue con Docker en VPS/nube. Un poco más de fricción, más señales de "ingeniería".
- **Estado**: RTK o Zustand *según lo que hayas visto en M9*; no introduzcas una librería nueva el día antes del deadline.
- **UI**: Tailwind en ambos casos (M12); consistencia visual gratis y sin diseñar design systems desde cero.
- **Tests**: si eliges A, al menos Vitest + RTL básicos; si eliges B, apunta a cobertura ≥ 80 % en la lógica crítica (auth, CRUD, permisos).
- **Deploy**: A usa plataformas gestionadas; B empaqueta con Docker para no depender de la plataforma (habla de contenedores en la Unidad 03).

**Consejo**: elige **una** columna y quédate. Alternar entre A y B a mitad de F2 es la forma más fiable de no terminar nunca.

---

## MVP por fases

**MVP** significa *Minimum Viable Product* (producto mínimo viable): la versión más pequeña del proyecto que ya **sirve y puede demostrarse**. No es "una versión fea de todo": es una versión *completa de lo esencial*. La idea es validar pronto y iterar, en vez de construir durante meses a ciegas.

El proyecto se parte en **5 fases**:

```text
F1  Catálogo público + login/registro
F2  Roles (user/admin) + CRUD con permisos
F3  Dashboard + subida de archivos
F4  Notificaciones + dark mode + i18n
F5  Tests + Dockerfile + CI + deploy
```

Qué aporta cada fase y por qué este orden:

| Fase | Contenido | Por qué va ahí |
|------|-----------|----------------|
| **F1** | Catálogo público + login/registro | Lo primero: qué hace la app (catálogo) y quién puede entrar (auth). Ya en F1 tienes una web navegable y un usuario en BD |
| **F2** | Roles (user/admin) + CRUD con permisos | El corazón "empresa": sin roles y CRUD, no hay producto real. Aquí se integra M7/M8 y la autorización **en la API** |
| **F3** | Dashboard + subida de archivos | features de valor para el rol admin y datos que suelen pedir en pruebas técnicas |
| **F4** | Notificaciones + dark mode + i18n | pulido y accesibilidad; se deja después porque son lo más fácil de posponer y lo primero que se cae cuando hay prisa |
| **F5** | Tests + Dockerfile + CI + deploy | el empaque: convierte "funciona en mi máquina" en "funciona, verificado y publicado" |

Fíjate que **F5 no es opcional**: un proyecto sin deploy y sin CI es un ejercicio, no un proyecto de producción.

Regla: **cada fase deja la main verde** (build + tests).

Esta es la regla más importante de la unidad. Significa:

- Al cerrar cada fase, `main` compila (`pnpm build`) y los tests pasan (`pnpm test`).
- Nunca dejes `main` rota "temporalmente mientras acabo F3": los problemas se acumulan y el arreglo final es monstruoso.
- Trabaja en `feature/fase-2-roles`, merges cuando esté completo y verde, y solo entonces abres la siguiente.

En la práctica: la main verde es tu **pulso del proyecto**. Si late bien, avanzas; si se detiene, arreglas antes de seguir.

### Cómo materializar las fases (issues o tarjetas)

Antes de escribir código, convierte cada fase en trabajo visible:

1. Crea un tablero (GitHub Projects, Notion, Trello, o incluso `TODO.md` en el repo).
2. Una tarjeta/issue por fase (F1–F5), y subtareas por feature (p. ej. bajo F2: "guard en rutas", "middleware de roles en API", "CRUD con 403 en admin").
3. Marca *out of scope* lo que decidiste **no** hacer (p. ej. "app móvil", "pagos", "SSR"): escribirlo explícitamente evita que se convierta en un "y si además hacemos..." a mitad de proyecto.
4. Mueve la tarjeta a *Hecho* solo cuando la main esté verde con esa fase integrada.

No hace falta una herramienta cara: hace falta **que el estado del proyecto se vea de un vistazo**.

---

## Errores comunes

| Error | Por qué ocurre | Cómo evitarlo |
|-------|----------------|---------------|
| Empezar a codificar sin fases definidas | Ganas de "ver algo rápido" | Dedica la primera sesión **solo** a F1–F5 en el tablero; el código empieza después |
| Definir el MVP como "todo el checklist" | Confundir MVP con entrega final | MVP = lo esencial (F1–F2 mínimo); F3–F5 priorizadas, no todas obligatorias el primer día |
| Elegir stack y cambiarlo en F3 | Duda o aburrimiento | Elige columna A o B y comprométete; un stack conocido gana a uno "de moda" |
| Dejar `main` rota entre fases | Ramas vivas demasiado tiempo | Merge frecuente con build+tests verdes; la regla de la main verde |
| Hacer clone pixel-perfect de una web famosa | Presión estética | Prioriza calidad demostrable: tests, CI, permisos, deploy, README |
| Acumular todo "bonito" (i18n, dark, notis) al principio | Son visibles y gratificantes | Orden del README: features core → bonitas → empaque; respétalo |
| Features sin permisos en la API | Solo se protege el frontend | Roles y authz también en el servidor (M22): el front no es confiable |
| Sin datos demo al final | El entrevistador ve una web vacía | Añade seed de datos en F5 (ver Unidad 03) |

---

## Conceptos clave

- **Proyecto final / integración**: una sola app que conecta M2–M22 en vez de ejercicios sueltos.
- **Calidad demostrable**: lo que un evaluador puede verificar (CI verde, tests, deploy, permisos) por encima del brillo visual.
- **MVP** (*Minimum Viable Product*): la versión mínima que ya sirve y puede demostrarse; no es "todo a medias".
- **Alcance / out of scope**: qué entra y, sobre todo, qué queda **explícitamente fuera**.
- **Fases (F1–F5)**: hitos con entregable integrado; cada uno cierra con `main` verde.
- **Main verde**: `pnpm build` + `pnpm test` pasan en la rama principal; base del trabajo iterativo.
- **Stack**: conjunto de tecnologías por capa (front, API, estado, UI, tests, deploy).
- **Opción A vs Opción B**: todo JS (velocidad) vs TS + FastAPI/MySQL + cobertura + Docker (portfolio).
- **Issues / tarjetas**: representación visual del trabajo pendiente; una tarjeta por fase con subtareas.
- **Responsive vs mobile-first**: usable en móvil (imprescindible) ≠ diseñar primero para móvil (opcional aquí).
- **A11y** (accesibilidad): teclado y lectores de pantalla; se revisa en F5/DoD.
- **Definition of Done**: checklist objetivo de "terminado" (Unidad 03).

---

## Autoevaluación

**1. ¿Qué diferencia hay entre "MVP" y "versión fea de todas las features"? Menciona al menos dos features que legítimamente pueden quedarse *out of scope* en el MVP.**

<details>
<summary>Respuesta</summary>

El **MVP** es completo en lo esencial pero **mínimo**: deja fuera lo que no es necesario para demostrar el valor central (F1–F2: catálogo, auth, roles, CRUD). Una "versión fea de todo" hace cada cosa a medias y suele dejar `main` rota. Ejemplos válidos de *out of scope* en el MVP: **internacionalización (i18n)**, **modo oscuro**, notificaciones avanzantes (SSE/WebSocket), subida de archivos o incluso gráficos del dashboard; también "clonar pixel-perfect" o hacer app móvil.

</details>

**2. Estás en F2 (roles + CRUD) y rompiste el build. ¿Qué dice la regla de la unidad y qué haces antes de tocar F3?**

<details>
<summary>Respuesta</summary>

La regla: **cada fase deja la main verde (build + tests)**. Antes de F3 debes **arreglar** build y tests en `main` (o no mergear esa rama): commit de hotfix o terminar la rama `feature/fase-2` con `pnpm build` + `pnpm test` en verde. Nunca se acumulan fases sobre una main rota: los fallos se multiplican y F5 se vuelve imposible.

</details>

**3. ¿Por qué se recomienda empezar el CI "desde el día 1" y no al final con F5?**

<details>
<summary>Respuesta</summary>

Porque una CI montada al final obliga a arreglar de golpe todos los problemas latentes (lint, tests que no existían, builds que fallan en limpio, secretos mal puestos) cuando el tiempo ya es escaso. Con CI desde el inicio, cada merge pequeño ya se valida solo (lint + tsc + tests), la main verde es automática y F5 se reduce a *añadir deploy* en vez de *inventar calidad de cero*. Además, la plantilla de M19 ya existe: es casi gratis activarla pronto.

</details>

**4. Elige Opción A u B del stack y justifica en dos frases por qué encaja con tu situación.**

<details>
<summary>Respuesta</summary>

*Ejemplo de respuesta válida (varía según tu caso):* elijo **Opción B (React + TS + FastAPI/MySQL + cobertura ≥ 80 % + Docker)** porque ya he practicado TS y FastAPI en el roadmap y quiero señales de ingeniería en el portfolio (tipos, tests con cobertura, contenedores). Si mi prioridad fuera cerrar el proyecto en el menor tiempo posible con lo que más cómodo me sale, elegiría **Opción A (todo JS + Vercel/Railway)**; lo importante es comprometerse con una columna desde F1 y no cambiar en F3.

</details>
