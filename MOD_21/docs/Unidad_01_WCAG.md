# Unidad 01 — WCAG (resumen práctico)

## Objetivos

- Entender qué son las **WCAG** y por qué son el marco de referencia de la accesibilidad web.
- Recordar los 4 principios (**POUR**) y traducirlos a ejemplos concretos de React.
- Distinguir los niveles **A**, **AA** y **AAA** y saber cuál es el objetivo habitual.
- Aplicar la **checklist rápida** a cualquier pantalla que hayas construido.

## Requisitos

- React M4–M15: JSX, imágenes, formularios controlados, CSS con clases.
- Chrome con DevTools (usaremos el inspector de contraste y el árbol de accesibilidad).
- No se requiere experiencia previa en a11y ni conocer ARIA todavía: eso llega en la Unidad 03.

## Qué son las WCAG

Las **WCAG** (*Web Content Accessibility Guidelines*, “Directrices de Contenido Web”) son un conjunto de pautas elaboradas por el W3C. No son una ley, pero sirven de base a legislaciones de accesibilidad de muchos países y a los estándares de compra pública. Su virtud para quien programa: convierten algo vago (“que sea accesible”) en **criterios comprobables** (contraste ≥ 4.5:1, todo alcanzable con teclado, etc.).

Toda la guía gira en torno a los 4 principios **POUR** (Perceivable, Operable, Understandable, Robust) y a tres niveles de conformidad (A, AA, AAA). Vamos a ellos.

## Los 4 principios (POUR)

| Principio | En React ejemplos |
|-----------|-------------------|
| **P**ercibible | contraste ≥ 4.5:1, `alt` en imágenes, subtítulos |
| **O**perable | teclado, foco visible, sin traps, objetivos ≥ 24px |
| **U**nderstandable | labels claros, errores anunciados, idioma `lang` |
| **R**obust | HTML semántico, ARIA solo si no hay nativo |

Qué significa cada uno, en cristiano:

- **Percibible**: la información debe poder **percibirse** por distintos sentidos o medios. Si hay texto, debe verse (contraste suficiente); si hay una imagen informativa, necesita `alt`; si hay vídeo, subtítulos. En React esto aparece al escribir `<img>`, elegir colores de tailwind/CSS o incrustar medios.
- **Operable**: la interfaz debe poder **operarse**. La vía principal es el teclado (Tab, Enter, flechas), con foco visible, sin trampas (*traps*) y con áreas de clic cómodas (objetivos ≥ 24 px). Es el tema central de la Unidad 02.
- **Understandable**: debe **entenderse**. Labels de formulario claros, errores que se explican bien y se anuncian, idioma declarado con `<html lang="es">` para que el lector de pantalla pronuncie bien.
- **Robust**: debe funcionar con **tecnologías diversas** (lectores de pantalla antiguos, navegadores variados). La receta: HTML semántico primero (`<button>`, `<nav>`, `<main>`) y ARIA **solo** cuando no existe un elemento nativo que haga el trabajo (la regla de oro de la Unidad 03).

## Niveles

- **A** → mínimo legal en muchos sitios
- **AA** → estándar objetivo (contraste, focus, etc.)
- AAA → estricto (caso a caso)

Cómo se leen:

- **A**: el piso. Cumple A y ya no estás excluyendo lo más básico, pero pocos se conforman con esto.
- **AA**: el **estándar objetivo** de la práctica totalidad de proyectos serios. Incluye cosas tan visibles como el contraste de texto 4.5:1, el foco visible o el cumplimiento de teclado. Si solo memorizas un nivel, memoriza **AA**.
- **AAA**: nivel estricto, pensado para contexts muy concretos (por ejemplo, plataformas de trámites gubernamentales). Se aplica **caso a caso**: cumplir AAA en todo sitio es extremadamente difícil, y las propias guías lo admiten.

## Checklist rápido en una pantalla

- [ ] Todo interactuable con **Tab** y **Enter/Espacio**
- [ ] `:focus-visible` con anillo claro
- [ ] Sin `outline: none` sin sustituto
- [ ] Labels visibles o `aria-label` en icon-buttons
- [ ] Errores de form: `aria-invalid` + `aria-describedby` + `role="alert"`
- [ ] Contraste AA (DevTools → contraste de color)
- [ ] Zoom 200 % sin scroll horizontal raro

Cómo usarla: abre tu pantalla, recorre cada punto **con el ratón apagado (o mentalmente)** y marca. Donde falte, anota la corrección antes de pasar a la siguiente. Los dos últimos puntos se comprueban en DevTools: selecciona el texto → pestaña **Contraste de color**; y con `Ctrl` + `+` sube el zoom al 200 % para ver si aparece scroll horizontal (suele delatar maquetaciones rígidas en píxeles).

## Errores comunes

- **Confundir WCAG con “tener alt en las fotos”**: los 4 principios abarcan teclado, contraste, errores de formulario y robustez; el `alt` es solo una pieza de *Percibible*.
- **Apuntar al nivel AAA sin criterio**: el objetivo habitual es **AA**; AAA se aplica caso a caso.
- **Quitar el `outline` del foco** porque “feo en el diseño”: rompe el principio **Operable**. Sustitúyelo por un anillo `:focus-visible` bonito, no lo elimines sin más.
- **Auditar solo con el ratón**: una pantalla puede verse perfecta y ser inutilizable con teclado. La checklist empieza por Tab precisamente por eso.

## Conceptos clave

- **WCAG**: directrices del W3C que convierten la accesibilidad en criterios comprobables.
- **POUR**: los 4 principios — Percibible, Operable, Understandable, Robust.
- **Nivel A**: mínimo; **AA**: estándar objetivo (contraste 4.5:1, foco, teclado); **AAA**: estricto, caso a caso.
- **Contraste AA**: ratio ≥ 4.5:1 para texto normal (comprobable en DevTools → contraste de color).
- **Checklist de pantalla**: lista de verificación rápida que recorre teclado, foco, labels, errores, contraste y zoom.
- **`lang`**: atributo del idioma (`<html lang="es">`), parte de *Understandable*.

## Autoevaluación

1. Un botón se ve con contraste bajo y otro `div` no responde al teclado. ¿Qué principios POUR están rotos?

<details><summary>Respuesta</summary>

El contraste bajo rompe **P**ercibible (la información no se percibe bien). El `div` inalcanzable con teclado rompe **O**perable (la interfaz no puede operarse sin ratón). Fíjate que un mismo defecto suele afectar a más de un criterio, pero la checklist te ayuda a localizarlo.

</details>

2. Tu jefe te pide “que cumpla accesibilidad”. ¿Qué nivel convence como objetivo y por qué?

<details><summary>Respuesta</summary>

El nivel **AA**: es el estándar objetivo de la práctica totalidad de proyectos (e incluye contraste 4.5:1, foco visible y teclado). “A” es solo el mínimo legal en muchos sitios y “AAA” es estricto y de aplicación caso a caso, difícil de cumplir en todo un sitio.

</details>

3. ¿Por qué la checklist empieza por “todo interactuable con Tab y Enter/Espacio”?

<details><summary>Respuesta</summary>

Porque la navegación por teclado es la prueba más rápida y reveladora de la salud de una interfaz (**Operable**): si algo no se puede alcanzar ni activar con Tab/Enter/Espacio, es inaccesible para quien usa teclado, asistencia o, simplemente, un lector de pantalla que se apoya en el foco.

</details>

4. Aparece scroll horizontal al hacer zoom al 200 %. ¿Qué revisas?

<details><summary>Respuesta</summary>

Revisas la maquetación: anchos fijos en píxeles, contenedores sin `min-width` adecuado o elementos que no se reflowean. Las WCAG exigen que el contenido soporte zoom (reflow), así que busca layout flexible (%, `max-width`, flex/grid) en lugar de medidas rígidas.

</details>
