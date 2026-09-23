# Unidad 03 — Docker, CI/CD y deploy

## Objetivos

Al terminar esta unidad serás capaz de:

- Explicar qué resuelven los contenedores y empaquetar el front (Vite → Nginx multi-stage) y la API con sus Dockerfiles.
- Levantar el entorno local con `compose` (`web` + `api` + `db`).
- Montar el **pipeline mínimo** del proyecto: PR → lint/tsc/tests; `main` → build + preview; tag → producción.
- Desplegar front y API (Vercel/Netlify o Nginx en VPS; Railway/Render/VPS con uvicorn detrás de proxy TLS) con secrets fuera del repo y healthcheck `/health`.
- Aplicar la **Definition of Done** del proyecto final para decidir, con criterios objetivos, que el proyecto está terminado.

## Requisitos

- Haber completado las unidades 01 y 02: fases definidas, features del checklist integradas y `main` verde en local (`pnpm lint` + `pnpm test` + `pnpm build`).
- Plantillas de **M18** (Docker) y **M19** (CI) disponibles en el repo del curso; no hace falta saber Docker ni GitHub Actions de antes: se parte de ellas.
- Git con tags (`git tag`) y un repositorio en GitHub/GitLab donde exista Actions/GitLab CI.
- Cuenta en al menos una plataforma de deploy (Vercel, Netlify, Railway, Render) o un VPS; cuenta de un proveedor de BD si usas MySQL.
- **No** se requiere experiencia previa en DevOps: cada comando se explica con su porqué.

---

## La analogía del "funciona en mi máquina"

Has oído la frase mil veces: *«en mi máquina funciona»*. El problema de fondo es que en tu máquina tienes Node 20, un `.env` con claves reales, la BD con datos tuyos y nada de procesos extra. En el servidor hay otro sistema operativo, otra versión de Node y cero paciencia.

**Docker** resuelve esto empaquetando la app junto con su entorno: la misma "caja" corre en tu portátil y en producción. **CI/CD** resuelve el siguiente problema: que *alguien* verifique automáticamente (lint, tipos, tests) en cada cambio y que *algo* despliegue sin que tú tengas que recordar los pasos. **Deploy** es publicar la caja en un sitio accesible de verdad. Y la **Definition of Done** evita el clásico error del principiante: dar por terminado algo que solo "más o menos" funciona.

Orden mental de la unidad: **empaquetar → verificar → publicar → comprobar con criterios**. Todo lo demás es detalle de ejecución.

---

## Contenedores

- Multi-stage Vite → Nginx (M18 plantillas).
- API con su Dockerfile; `compose` para local (`web` + `api` + `db`).

### Front: multi-stage Vite → Nginx

- Multi-stage Vite → Nginx (M18 plantillas).

Un front de React **no necesita Node** para *servirse* en producción: solo necesita los archivos estáticos de `dist/`. Node es necesario para **construir**, no para entregar. Por eso se usa un **multi-stage build** (construcción por etapas):

1. **Etapa builder**: imagen con Node → `pnpm install` → `pnpm build` → genera `dist/`.
2. **Etapa runtime**: imagen mínima (Nginx) → copia **solo** `dist/` → Nginx sirve esos archivos y maneja los redirects de SPA (`try_files ... /index.html`).

Ganancias: la imagen final **no** lleva el código fuente, ni npm, ni las `node_modules` de build; es más pequeña, arranca más rápido y expone menos superficie de ataque. Las plantillas exactas están en **M18**: cópialas como base y no las reinventes.

```text
[pnpm install + pnpm build]  --dist-->  [nginx: sirve dist + SPA fallback]
      etapa builder                etapa runtime (imagen final)
```

### API con su Dockerfile

- API con su Dockerfile; `compose` para local (`web` + `api` + `db`).

La API también se empaqueta (Node o FastAPI según tu columna de stack), exponiendo su puerto (p. ej. `8000` o `3000`) y con el **`/health`** ya previsto desde M17: un endpoint sencillito (`{"status": "ok"}`) que usarán el healthcheck de Docker, el orquestador y el pipeline.

### Compose para local

- `compose` para local (`web` + `api` + `db`).

En local no quieres instalar MySQL a mano ni arrancar tres terminales: `docker compose up` levanta el trío completo con la red interna del compose:

```text
servicios:
  web  →  front (Vite en dev o Nginx con build)
  api  →  backend
  db   →  MySQL (con volumen para no perder datos al parar)
```

Ventajas concretas para un proyecto de curso: un solo comando para levantar el entorno, mismo comportamiento en tu máquina y en la de quien clona tu repo, y la BD aislada (si la quieres limpia, `docker compose down -v` y vuelves a empezar de cero). El detalle de los servicios (`web` + `api` + `db`) está en las plantillas de M18.

---

## CI/CD mínimo del proyecto

```text
PR  → lint + tsc + unit tests (+ coverage)
main→ build + deploy preview
tag → deploy producción
```

**CI** (*Continuous Integration*): cada propuesta de cambio (PR) se verifica sola. **CD** (*Continuous Delivery/Deployment*): cuando pasa la verificación, el software avanza hacia preview/producción sin pasos manuales olvidadizos.

El pipeline mínimo del proyecto, tal cual se define en la unidad, significa:

1. **PR → lint + tsc + unit tests (+ coverage)**: mientras propones el cambio, CI ejecuta ESLint (estilo/coherencia), `tsc --noEmit` (tipos) y los tests unitarios; puedes añadir reporte de cobertura. Si algo falla, el PR no se mergea: los problemas se detectan en segundos, no semanas después.
2. **main → build + deploy preview**: al hacer merge, se verifica que el build pasa y se publica una **preview** (una URL con ese cambio) para revisar antes de producción. Esto es *delivery*: el cambio queda listo y visible.
3. **tag → deploy producción**: cuando marcas una versión (`git tag v1.0.0 && git push --tags`), se despliega a **producción**. El tag es el "botón" deliberado: producción no cambia porque sí, cambia cuando tú lo decides.

Usa `MOD_19/plantillas/ci.yml` como base y añade `test:run` y paso de deploy.

No partas de cero: esa plantilla ya tiene lo esencial del curso (lint, build, etc.). Tus añadidos concretos:

- **`test:run`**: el paso que ejecuta los tests en modo CI (Vitest/Jest). Sin esto, los tests existen pero nadie los corre automáticamente — y un test que no corre en CI no protege nada.
- **Paso de deploy**: según plataforma, un job con `if: startsWith(github.ref, 'refs/tags/')` para producción, o deploy de preview en `main`. Los **secrets** (`VERCEL_TOKEN`, `DATABASE_URL`, claves de API...) van en *GitHub Actions secrets* (o equivalentes), **nunca** en el repo ni en un `.env` commiteado.

```yaml
# Esquema conceptual (los detalles exactos están en M19)
# jobs:
#   ci:      lint + tsc + test:run          → en todo PR
#   preview: build + deploy a preview       → en main
#   prod:    deploy a producción            → solo en tags v*
```

---

## Deploy

| Front | API |
|-------|-----|
| Vercel/Netlify (`dist`, redirects SPA) | Railway/Render/VPS |
| o Nginx en VPS | FastAPI uvicorn detrás de proxy TLS |

La tabla son dos caminos según la columna de stack que eligieras en la Unidad 01:

**Front — fila 1 (plataforma gestionada):** Vercel o Netlify sirven `dist/` (el output de `pnpm build`), y debes configurar los **redirects SPA** (todas las rutas → `index.html`) para que las rutas de React no den 404 al refrescar. La idea es siempre la misma que hace Nginx con `try_files`.

**Front — fila 2 (self-hosted):** Nginx en un VPS sirviendo `dist/`, con el mismo fallback a `index.html` y TLS delante (certificado Let's Encrypt o el proxy que uses).

**API — Railway/Render:** plataformas que reciben tu Dockerfile (o detectan el runtime), gestionan dominio TLS y scaling básico. Menos configuración, ideal para el proyecto del curso.

**API — VPS:** levantas tú el contenedor y pones **uvicorn (FastAPI) detrás de un proxy TLS** (Nginx/Caddy). El proxy termina HTTPS, redirige HTTP→HTTPS y hace de puente hacia la app. Nunca expongas uvicorn en claro directo a internet sin TLS: los tokens viajarían sin cifrar (recuerda HSTS de M22).

```text
Internet --HTTPS--> [proxy TLS: Nginx/Caddy] --http--> uvicorn/API
```

Complementos que conviene no saltarse:

- Secrets: GitHub Actions secrets / dashboard.
  Pones los tokens y URLs de BD en el gestor de secrets de CI **y/o** en el dashboard de la plataforma (variables de entorno del servicio). El repo solo lleva `.env.example` (ver DoD), jamás valores reales.
- Healthcheck `/health` en API.
  El endpoint que ya define M17: Docker, el orquestador o la monitorización comprueban que la app responda; si no responde, se reinicia o salta la alerta **antes** de que lo note un usuario.
- Logs estructurados (JSON) para depurar en prod.
  En local un `console.log` legible basta; en producción necesitas buscar: logs en **JSON** (timestamp, nivel, mensaje, request id) se filtran y agregan en la consola de la plataforma. "Desplegué y ahora no sé qué pasa" se cura con buenos logs.

---

## Definition of Done (proyecto final)

- [ ] Features MVP cerradas o marcadas out of scope
- [ ] `pnpm lint` + `pnpm test` + `pnpm build` en CI verde
- [ ] Cobertura ≥ 80 % en src crítica (o plan para subirla)
- [ ] README: screenshots, stack, run local, arquitectura
- [ ] Deploy live + seed de datos demo
- [ ] a11y audit (teclado + axe/lighthouse ≥ AA en lo esencial)
- [ ] `.env.example` documentado

La **Definition of Done** (DoD, "definición de hecho") es la lista que evita el autoengaño de "creo que está terminado". Si un ítem no está marcado, **no está hecho**. Se revisa en voz alta al final de F5 (y en cada retro si trabajas en equipo).

Desglose de cada casilla y por qué importa:

- **Features MVP cerradas o marcadas out of scope**: o está implementado y probado, o está **explícitamente** descartado con razón. Lo que queda en un limbo de "a ver si llego" no cumple DoD: o entra, o se anota fuera de alcance.
- **`pnpm lint` + `pnpm test` + `pnpm build` en CI verde**: los tres comandos pasan **en el pipeline**, no solo en tu portátil. Si el CI está rojo, el proyecto no está terminado aunque "funcione en mi máquina".
- **Cobertura ≥ 80 % en src crítica (o plan para subirla)**: enfocado al código que no puede fallar (auth, roles, CRUD, validaciones), coherente con el mínimo de la Opción B de la Unidad 01. Si aún no llegas, basta un **plan concreto** (qué módulos y para cuándo): la ausencia total de plan no vale.
- **README: screenshots, stack, run local, arquitectura**: quien evalúe debe poder (1) ver capturas de lo que hace, (2) saber con qué está hecho, (3) clonar y levantarlo con un par de comandos, (4) entender la estructura sin preguntarte. Un README pobre hunde un buen proyecto en una entrevista.
- **Deploy live + seed de datos demo**: la app **responde en una URL** y tiene datos con los que clicar (usuarios demo, roles, registros). Sin esto, el evaluador ve pantallas vacías y no puede juzgar el producto.
- **a11y audit (teclado + axe/lighthouse ≥ AA en lo esencial)**: recorre el flujo principal **solo con teclado** (tab, enter, foco visible) y pasa axe/Lighthouse en accesibilidad buscando ≥ AA en lo esencial. Los toasts `aria-live`, los `aria-invalid` de los forms y el `lang` de la Unidad 02 cobran aquí.
- **`.env.example` documentado**: un archivo `.env.example` (sin secretos) con **todas** las variables y un comentario de qué es cada una, para que quien clona sepa qué rellenar. Es la prueba de que tus secrets reales viven solo en secrets/dashboard (deploy).

---

## Errores comunes

| Error | Consecuencia | Cómo evitarlo |
|-------|--------------|---------------|
| Dejar CI "para el final" | Se arregla todo de golpe con el deadline encima | Activar `MOD_19/plantillas/ci.yml` desde el día 1 (Unidad 01) |
| CI verde pero sin `test:run` | Los tests no corren; falsa sensación de seguridad | Añadir explícitamente el paso `test:run` a la plantilla |
| Commitear `.env` con secretos | Credenciales públicas para siempre (history) | `.env.example` sin valores + secrets en Actions/dashboard; rotar claves si ya se filtró |
| Imagen de front gigante (todo en una etapa) | Builds lentos, fuente expuesta | Multi-stage: builder (Node) → runtime (Nginx solo con `dist/`) |
| Olvidar redirect SPA en el deploy | Recargar `/dashboard` da 404 | `try_files` en Nginx o redirects de Vercel/Netlify → `index.html` |
| Desplegar sin healthcheck | Incidentes descubiertos por usuarios | `/health` monitoreado por compose/orquestador/plataforma |
| uvicorn/API sin proxy TLS | Tokens y cookies en claro (ver M22) | Proxy TLS delante; HSTS en prod |
| Logs ilegibles en producción | Imposible depurar un 500 a las 3 de la mañana | Logs estructurados en JSON con nivel/timestamp/request id |
| Decir "terminado" sin DoD | Entrega incompleta bajo presión subjetiva | Revisar la checklist ítem a ítem; sin marcar = sin hacer |
| Deploy sin datos demo | Evaluador ve una app vacía | Seed de datos incluido en F5 |
| Comandos mágicos no documentados | Nadie más (ni tú en 2 meses) levanta el proyecto | README con run local + `.env.example` |

---

## Conceptos clave

- **Contenedor / Docker**: empaqueta app + dependencias para que corra igual en local y prod.
- **Multi-stage build**: etapas separadas (build con Node, runtime con Nginx); imagen final pequeña y sin fuentes.
- **Nginx como runtime del front**: sirve `dist/` estático + fallback SPA (`index.html`).
- **`docker compose`**: define y levanta varios servicios de una vez (`web`, `api`, `db`) con red interna y volúmenes.
- **Healthcheck `/health`**: endpoint sencillo de vida útil usado por Docker, monitorización y pipelines.
- **CI (Continuous Integration)**: verificación automática (lint, tsc, tests) en cada PR.
- **CD (Continuous Delivery/Deployment)**: publicación automática hacia preview (main) o producción (tag).
- **Preview deploy**: URL con el cambio del `main` antes de producción.
- **Tag como disparador de producción**: `git tag v*` → pipeline despliega a prod (decisión deliberada).
- **`test:run`**: comando que ejecuta los tests en CI; sin él, los tests no protegen.
- **Secrets de CI**: variables cifradas en GitHub Actions (o dashboard de plataforma), fuera del repo.
- **Redirects SPA**: todas las rutas → `index.html` para que el router de React no falle al refrescar.
- **Proxy TLS**: Nginx/Caddy delante de la API que termina HTTPS y redirige HTTP.
- **Logs estructurados (JSON)**: logs machine-readable (timestamp, level, mensaje) para depurar en prod.
- **Definition of Done (DoD)**: checklist objetivo de "terminado"; sin marcar, no hecho.
- **Cobertura ≥ 80 % en src crítica**: métrica de tests sobre el código sensible (auth, CRUD...).
- **`.env.example`**: plantilla documentada de variables sin secretos.
- **a11y audit**: revisión con teclado + axe/Lighthouse (≥ AA en lo esencial).

---

## Autoevaluación

**1. ¿Por qué el front se empaqueta en multi-stage (builder + Nginx) en vez de dejar Node corriendo en producción?**

<details>
<summary>Respuesta</summary>

Porque para **servir** una SPA solo hacen falta los archivos estáticos de `dist/`; Node solo es necesario para **construir**. En la etapa builder se ejecuta `pnpm install` + `pnpm build`, y la etapa runtime (Nginx) recibe únicamente `dist/`. Así la imagen final es más pequeña, arranca más rápido, no lleva `node_modules` ni código fuente (menor superficie de ataque) y hay menos desfase de versiones entre entornos. Si Node corriera en prod, estarías manteniendo un runtime que no usas y exponiendo herramientas de build sin motivo.

</details>

**2. Describe el pipeline mínimo (PR → main → tag) y di qué significa cada etapa para ti como desarrollador.**

<details>
<summary>Respuesta</summary>

- **PR → lint + tsc + unit tests (+ coverage)**: cada propuesta se verifica sola; si falla, no se mergea → calidad sin depender de la memoria de nadie.
- **main → build + deploy preview**: al integrar, se construye y se publica una **preview** → el cambio se puede revisar en una URL antes de producción (*delivery*).
- **tag → deploy producción**: un tag (`v1.0.0`) dispara el despliegue a prod → producción solo cambia cuando se decide de forma deliberada (*deployment*).

En conjunto: nada llega sin pasar los checks, nada avanza sin verse, y nada toca prod sin etiqueta.

</details>

**3. El proyecto "funciona en local" pero el CI falla en `tsc`. Tu compañero dice "mergeamos y lo arreglamos después". ¿Qué dice la DoD y qué haces?**

<details>
<summary>Respuesta</summary>

La DoD exige **`pnpm lint` + `pnpm test` + `pnpm build` en CI verde**: mientras `tsc` falle, el proyecto **no** está terminado y mezclar rompe la main (viola además la regla de "cada fase deja la main verde" de la Unidad 01). Lo correcto es arreglar los errores de tipos en la rama del PR (o en un hotfix prioritario), confirmar CI verde y solo entonces mergear. La DoD existe justamente para que "terminado" no dependa de la impresión de nadie.

</details>

**4. Antes de declarar el proyecto entregado, ¿qué compruebas sobre deploy, datos y accesibilidad?**

<details>
<summary>Respuesta</summary>

Tres casillas de la DoD: (1) **Deploy live** responde en una URL real y el healthcheck `/health` está OK; (2) hay **seed de datos demo** (usuarios, roles, registros) para que el evaluador pueda clicar sin verte pedir cuentas; (3) **a11y audit**: recorrido del flujo principal solo con teclado (tab, foco visible) y axe/Lighthouse ≥ AA en lo esencial (regiones `aria-live` de toasts, `aria-invalid` en forms, `lang` correcto). Si alguna no está, el proyecto no está terminado según la DoD.

</details>
