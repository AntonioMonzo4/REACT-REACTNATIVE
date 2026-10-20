# Unidad 01 — ¿Qué es testing E2E y dónde encaja en la pirámide?
> 🧭 **Navegación:** [← Anterior: tema_024 · Unidad 05 — Integración: RHF + Zod + TanStack Query](../../tema_024/docs/Unidad_05_Integracion_RHF_Zod_y_Query.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 02 — Playwright: configuración y locators →](Unidad_02_Playwright_configuracion_y_locators.md)

## Objetivos

Al terminar esta unidad podrás:

- Distinguir tests **unit**, **integration** y **E2E** (end-to-end) con ejemplos concretos de React.
- Situar cada capa en la **pirámide de testing** y explicar su coste/beneficio.
- Argumentar por qué el E2E no sustituye a los tests unitarios, sino que los complementa.
- Conocer las herramientas E2E del ecosistema React (Playwright y Cypress) y por qué este módulo elige Playwright.

## Requisitos

- Haber visto el Módulo 10 (Testing): Jest/Vitest y React Testing Library.
- Tener claro qué es una app Vite y cómo arrancarla con `pnpm dev`.

## El lugar del E2E en la pirámide

En M10 ya viste la pirámide:

```
        /\          E2E (pocos, lentos, navegador real)
       /  \
      /----\        Integration (medios, flujos de alto valor)
     /      \
    /--------\      Unit (muchos, rápidos, sin browser)
```

- **Unit**: testing `sumar(2,2)` o un reducer. Sin DOM de verdad. Milisegundos.
- **Integration**: RTL renderiza tu componente y simula eventos. Cubre "el formulario
  valida y llama a la mutación", pero el navegador es un **jsdom simulado**.
- **E2E**: un navegador real (Chromium/Firefox/WebKit) ejecuta la app compilada
  como lo haría un usuario: clics, navegación, red real, localStorage real.

El E2E responde una pregunta distinta: **"¿el usuario puede terminar su tarea?"**.
Los unit responden "¿esta lógica es correcta?". Las dos preguntas importan.

## Ejemplo del problema que cubre el E2E

Un test RTL puede dar verde mientras la app está rota en producción:

| Fallo | ¿Lo ve RTL (unit/integration)? | ¿Lo ve E2E? |
|-------|--------------------------------|-------------|
| Lógica de validación mal | ✅ | ✅ |
| El `onSubmit` no está conectado al `<form>` | ⚠️ a veces | ✅ |
| El CSS esconde el botón de enviar | ❌ | ✅ |
| El router no navega tras el login | ⚠️ si mockeas | ✅ |
| La variable de entorno `VITE_API_URL` apunta a otro host | ❌ | ✅ |
| Un script de terceros rompe el bundle | ❌ | ✅ |

Ese es el valor del E2E: cubre el **ensamblaje** (config, bundler, rutas, CSS,
red) que los tests de unidad mockean o ignoran.

## Playwright vs Cypress

| | Playwright | Cypress |
|---|------------|---------|
| Navegadores | Chromium, Firefox, WebKit | Chromium (Firefox/WebKit experimentales) |
| Lenguaje | TS/JS (también Python, Java…) | JS/TS |
| Multi-pestaña / iframes | ✅ nativo | ⚠️ limitado |
| Esperas | automáticas (auto-waiting) | auto-waiting |
| Precio (equipos) | gratuito | gratuito + plan pago para equipos |

Ambos son profesionales. Este módulo usa **Playwright** por su soporte multi-browser,
su tipado en TS y porque su modelo de locators encaja bien con la accesibilidad que
viste en M21 (`getByRole`).

## La regla de la proporción

No escribas un E2E por cada caso de unit. Proporción orientativa:

- **Unit/integration**: la mayor parte de la suite (cobertura de lógica).
- **E2E**: solo los **flujos críticos** (login, checkout, alta principal), típicamente
  5–20 specs al principio de un proyecto.

Un E2E tarda minutos; un unit milisegundos. Si tu CI tarda 40 minutos, nadie lo mira.

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Escribir E2E como si fueran unit | Specs gigantes que prueban detalles internos | E2E = flujo de usuario; detalles van en unit |
| `sleep(2000)` como espera | Specs lentas y flaky | Deja que Playwright espere (auto-waiting + assertions) |
| E2E sin CI | Nadie los ejecuta y se rompen en silencio | Ejecutar en cada PR (lo veremos en U04) |

## Conceptos clave

- **E2E (end-to-end)**: prueba el sistema completo como lo usaría una persona real.
- **Pirámide**: pocos E2E lentos arriba, muchos unit rápidos abajo.
- **Flaky**: test que falla sin que el código haya cambiado (esperas mal hechas).
- **Playwright**: framework E2E multi-browser con auto-waiting y modo TypeScript.

## Autoevaluación

<details>
<summary><b>1. Tu CI tarda 40 minutos porque hay un E2E por cada función. ¿Qué haces?</b></summary>

Reducimos E2E a los flujos de negocio críticos (login, alta, checkout) y movemos el
resto de cobertura a unit/integration. El objetivo es una suite E2E de pocos minutos.
</details>

<details>
<summary><b>2. ¿Por qué RTL no detecta que un botón está oculto por CSS?</b></summary>

Porque jsdom no aplica estilos reales (no hay layout ni cascade de verdad). El E2E
usa un navegador real con el CSS compilado, así que un `display:none` se ve.
</details>

<details>
<summary><b>3. Nombra 3 flujos críticos típicos de una app SaaS.</b></summary>

Registro/login, alta de un recurso principal (crear pedido/post) y el proceso de
pago o publicación. A eso apuntan los E2E del proyecto.
</details>

> 🧭 **Navegación:** [← Anterior: tema_024 · Unidad 05 — Integración: RHF + Zod + TanStack Query](../../tema_024/docs/Unidad_05_Integracion_RHF_Zod_y_Query.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 02 — Playwright: configuración y locators →](Unidad_02_Playwright_configuracion_y_locators.md)
