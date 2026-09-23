# Unidad 01 — Medir antes de optimizar

## Objetivos

- Entender por qué optimizar “a ojo” casi siempre es perder el tiempo (y a veces empeora las cosas).
- Conocer las métricas **Web Vitals** (LCP, CLS, INP) y traducirlas a la experiencia de una persona usuaria real.
- Ejecutar un análisis de **Lighthouse** en Chrome y guardar una línea base (score “antes”).
- Aplicar el ciclo **medir → hipótesis → cambio pequeño → volver a medir**.

## Requisitos

- Haber completado los módulos básicos de React (**M4–M15**): componentes, props, estado y efectos.
- Chrome instalado, con DevTools y la extensión **React DevTools** (la usaremos en la Unidad 03).
- Un ejemplo del curso que puedas construir con `pnpm build` (por ejemplo, `../EJEMPLO_MODERNO`).
- **No** necesitas saber WebPACK ni escribir configuración de bundler: los ejemplos ya usan Vite.

## Por qué se mide antes de tocar nada

Cuando una página “se siente lenta”, la intuición suele decir: “añade `useMemo` por si acaso”, “usa `lazy` en todo”, “memoiza esta función”. En la práctica, esa intuición tres problemas:

1. **No sabes qué está lento.** El cuello de botella puede ser la red, una imagen gigante, un JavaScript pesado o un cálculo en el hilo principal… y cada uno se arregla de forma distinta.
2. **Las micro-optimizaciones cuestan legibilidad.** `useMemo` y `useCallback` añaden complejidad; si no hay un problema medido, solo estás complicando el código.
3. **Sin línea base no puedes demostrar mejoras.** Si no guardas el “antes”, un “después” bonito no prueba nada: quizá siempre estuvo igual.

Por eso este módulo empieza por **medir**, no por optimizar. Medir es la única forma de tomar decisiones con datos.

## Métricas

Estas son las métricas que usaremos, con su herramienta y su objetivo orientativo:

| Métrica | Herramienta | Objetivo orientativo |
|---------|-------------|----------------------|
| LCP | Lighthouse | < 2.5 s |
| CLS | Lighthouse | < 0.1 |
| INP | Lighthouse | < 200 ms |
| TTI / bundle | Lighthouse, `vite build` | poco JS inicial |
| Renders | React DevTools Profiler | sin renders “fantasma” |

Qué significa cada una, en palabras sencillas:

- **LCP (Largest Contentful Paint)**: cuánto tarda en aparecer el elemento más grande de la pantalla (normalmente el título o la imagen principal). Si tarda más de 2,5 s, la persona siente que la página “tarda en cargar”.
- **CLS (Cumulative Layout Shift)**: cuánto se mueven los elementos mientras carga (el clásico “el botón se esconde y pincho mal”). Menos de 0,1 se considera bueno.
- **INP (Interaction to Next Paint)**: cuánto tarda la página en **reaccionar** a un clic o una tecla. Menos de 200 ms se percibe como inmediato.
- **TTI / bundle**: cuánto JavaScript hay que descargar y ejecutar antes de que la app esté usable. Menos JS inicial = carga más rápida, sobre todo en móviles.
- **Renders**: cuántas veces React vuelve a pintar tus componentes. Los “renders fantasma” son re-renderizaciones que no cambian nada visible: pura CPU desperdiciada.

## Flujo

```text
1. Medir (perfil real, no “me parece lento”)
2. Hipótesis (¿mucho JS? ¿estado que cambia mucho?)
3. Cambio pequeño
4. Medir otra vez
```

Este ciclo es la columna vertebral de toda la unidad. Fíjate en que el paso 3 dice **cambio pequeño**: si cambias cinco cosas a la vez y el score mejora, no sabrás cuál ayudó (o si alguna empeoró las cosas). Idealmente:

1. **Mide** con la app ya construida (`pnpm build` + `pnpm preview`), no en modo desarrollo.
2. **Formula una hipótesis concreta**: “el chunk principal pesa 400 kB porque importamos una librería de charts entera”, “este input re-renderiza la lista entera en cada tecla”.
3. **Cambia solo eso.**
4. **Mide otra vez** y compara con la línea base. Si no mejoró, deshaz y prueba otra hipótesis.

## Lighthouse

- Chrome → DevTools → pestaña Lighthouse.
- Modo “simulated throttling” + 4G para móvil.
- Guardar corrida base antes/después.

Pasos detallados para tu primera corrida:

1. Construye y sirve la app de producción: `pnpm build` y luego `pnpm preview`.
2. Abre la app en Chrome, pulsa `F12` para abrir DevTools y ve a la pestaña **Lighthouse**.
3. Selecciona solo la categoría **Performance** para corridas rápidas; déjalo en **Mobile** (es el escenario exigente) con “simulated throttling” y una conexión **4G** simulada.
4. Pulsa **Analyze page load** y espera. Cuando termine, guarda el report (el propio Lighthouse te deja descargarlo) con un nombre tipo `lighthouse-base.png` o `lighthouse-base.json`.
5. Ese archivo es tu **línea base**: todo lo que optimices después se compara contra él.

¿Por qué “simulated throttling” y móvil? Porque la mayoría de tus usuarios reales navegan desde un teléfono con una conexión peor que la de tu portátil. Medir en tu máquina con fibra y sin throttling dará siempre números optimistas.

## Errores comunes

- Micro-optimizar `useMemo` sin problema de rendimiento medido.
- Medir en dev build (React development es más lento).

Y dos derivadas muy habituales de esos errores:

- **Medir con el servidor de desarrollo (`pnpm dev`)**: React en modo desarrollo ejecuta comprobaciones extra y es considerablemente más lento; tus métricas no serán las de producción. Usa siempre `pnpm build` + `pnpm preview`.
- **Cambiar varias cosas a la vez** y atribuir la mejora a la última: vuelve al ciclo de un cambio por corrida.

## Conceptos clave

- **Web Vitals**: conjunto de métricas estándar de Google (LCP, CLS, INP) para medir la experiencia real de carga e interacción.
- **Línea base (baseline)**: la medición inicial “antes” contra la que comparas cada cambio.
- **Throttling**: simulación de una conexión/máquina más lenta para que las métricas se parezcan a las de un móvil real.
- **Dev build vs. build de producción**: el código de desarrollo de React es más lento; medir solo tiene sentido sobre el build de producción.
- **Render fantasma**: un re-render de React que no produce ningún cambio visible en pantalla.

## Autoevaluación

1. ¿Por qué no debes optimizar “por si acaso” `useMemo` en un cálculo que tarda 0,1 ms?

<details><summary>Respuesta</summary>

Porque `useMemo` tiene un coste propio (comparar dependencias, ocupar memoria) y añade complejidad al código. Si el cálculo no es costoso **y no hay un problema de rendimiento medido**, la memoización no mejora nada y solo hace el código más difícil de leer. Regla: primero mide, después optimiza.

</details>

2. Tu app en `pnpm dev` tarda 4 s en cargar. ¿Es un problema real?

<details><summary>Respuesta</summary>

No necesariamente: estás midiendo el **dev build**, que es más lento que el de producción porque React ejecuta comprobaciones extra. Vuelve a medir con `pnpm build` + `pnpm preview` pasando Lighthouse con throttling móvil; solo esa medición refleja lo que verá tu usuaria.

</details>

3. ¿Qué dos preguntas debes hacerte en el paso 2 del flujo (hipótesis)?

<details><summary>Respuesta</summary>

¿Hay **mucho JavaScript** inicial (bundle grande, librerías pesadas, falta de lazy)? y ¿hay **estado que cambia mucho** provocando renders innecesarios? Son las dos causas típicas que atacarán las unidades 02 y 03 respectivamente.

</details>

4. ¿Qué guardas como “score base” y por qué?

<details><summary>Respuesta</summary>

Guardas el reporte de Lighthouse de la primera corrida (antes de cualquier optimización), idealmente descargándolo. Sin esa línea base no puedes comparar ni demostrar que tus cambios posteriores mejoraron (o empeoraron) las métricas.

</details>
