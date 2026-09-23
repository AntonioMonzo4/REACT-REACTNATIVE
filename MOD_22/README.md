# Módulo 22 — Seguridad

Material del **Módulo 22** del roadmap.

Este módulo es tu primera toma de contacto seria con **seguridad web** desde el lado del frontend. Si hasta ahora has construido pantallas, consumido APIs y montado auth "funcionando" (M7/M8), aquí vas a entender *por qué* esas soluciones a veces son frágiles y *qué reglas* siguen los profesionales para no regalar la aplicación a un atacante.

La seguridad no es un módulo opcional ni un "extra" que se añade al final: es una forma de pensar que acompaña cada `fetch`, cada `localStorage`, cada formulario y cada cookie. Tras este módulo deberás mirar tu propio código y preguntarte: *¿y si alguien malicioso mete texto aquí? ¿Y si otra web intenta llamar a mi API usando la sesión de mi usuario?*

---

## Para quién es este módulo

- **Vienes de cero en seguridad web**: no sabes aún qué es XSS, CSRF, CORS o un JWT, y no pasa nada. Todo se explica desde cero con analogías.
- **Ya sabes React** (aprox. M4–M15): hooks, componentes, formularios, rutas, consumo de APIs. No hace falta que seas experto, pero debes poder leer un componente sin quedarte perdido.
- **Tienes "algo" de auth** (M8): has visto tokens o sesiones alguna vez. Aquí vamos a profundizar y a corregir malas prácticas habituales.
- **No necesitas** saber backend a fondo, ni criptografía, ni haber usado nunca burp suite. El enfoque es **frontend + integración con API**.

Si en algún momento suena un concepto de servidor (headers, cookies, CORS), se explica lo mínimo indispensable para que entiendas la parte que te toca a ti como desarrollador React.

---

## Cómo estudiar

| Fase | Qué haces | Duración orientativa | Resultado |
|------|-----------|----------------------|-----------|
| **1 — Entender la amenaza** | Lee las 3 unidades seguidas sin código. Solo prosa, tablas y analogías. Anota tus dudas. | 1 sesión larga o 2 cortas | Sabes explicar en voz alta qué es XSS, CSRF, CORS y OAuth con tus palabras |
| **2 — Localizar en tu código** | Abre un ejemplo tuyo y busca `dangerouslySetInnerHTML`, `localStorage`, cookies, fetch con credenciales. Marca puntos peligrosos. | 1 sesión | Lista concreta de "aquí podría mejorar" en tu propio proyecto |
| **3 — Practicar los ejercicios** | Ejecuta la sección **Práctica** de este README, uno por uno, en un ejemplo real. | 2–3 sesiones | Has provocado un error de CORS, has leído una CSP, has refactorizado tu auth del M8 |
| **4 — Consolidar** | Repasa **Errores comunes** y **Conceptos clave** de cada unidad y resuelve la **Autoevaluación** sin mirar. | 1 sesión | Checklist del README al día y respuestas acertadas |

No saltes a la fase 3 sin la 1: practicar sin entender produce código que "funciona" pero no es seguro.

---

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — XSS y CSRF](docs/Unidad_01_XSS_CSRF.md) | Tipos XSS, CSP, tokens CSRF, SameSite |
| [02 — CORS y OAuth](docs/Unidad_02_CORS_OAuth.md) | Preflight, allowlist, PKCE |
| [03 — JWT prácticas](docs/Unidad_03_JWT_practicas.md) | Almacenamiento, rotación, checklist |

---

## Práctica

1. En un ejemplo, busca `dangerouslySetInnerHTML` / `innerHTML` y documenta por qué es (o no) seguro.
2. Con una API de ejemplo, provoca un error de CORS y lee el mensaje en DevTools (compara con Postman).
3. Refactor del M8: pasa el access token a memoria y el refresh a cookie httpOnly (simula en docs).
4. Añade a un form `aria-invalid` + validación cliente **y** server (server es la fuente de verdad).
5. Revisa `pnpm audit` en un ejemplo y actualiza si hay advisories.

---

## Práctica mínima

Si tienes muy poco tiempo, esto es lo **imprescindible** para decir que has estudiado el módulo. Todo lo demás es profundización.

| # | Acción mínima | Por qué es suficiente (y por qué no menos) |
|---|---------------|--------------------------------------------|
| 1 | Explicar con tus palabras XSS, CSRF y CORS (sin mirar) | Si no puedes explicarlo, no lo has entendido: son los 3 ataques/errores que verás en cada entrevista básica |
| 2 | Ejercicios 1 y 2 de la Práctica | Ver con tus ojos un `innerHTML` peligroso y un error de CORS en DevTools fija el conocimiento teórico |
| 3 | Completar el Checklist de seguridad JWT de la Unidad 03 en un proyecto tuyo | Es la lista que aplicas de verdad en el trabajo día a día |
| 4 | Resolver la Autoevaluación de las 3 unidades | Detecta huecos antes de que te los pregunte un entrevistador |

Tiempo estimado de la práctica mínima: **una tarde**. Si puedes, amplía con los ejercicios 3–5: son los que más valor aportan en un portfolio.

---

## Mapa con el README

- [x] XSS
- [x] CSRF
- [x] CORS
- [x] OAuth
- [x] Buenas prácticas con JWT
- [ ] Revisión de seguridad guiada en proyecto — *pendiente*
