# Unidad 05 — CSS Modules y Styled Components

## Objetivos

- Entender qué es un CSS Module y cómo se logra el **scope local** de clases.
- Escribir un componente React con su `Component.module.css` asociado.
- Instalar y usar Styled Components (CSS-in-JS) con props que cambian estilos.
- Conocer el coste de runtime del CSS-in-JS y sus implicaciones (SSR).
- Comparar con criterio CSS Modules vs Styled Components vs Tailwind (tabla).
- Evitar los errores típicos: props filtradas al DOM y sorpresas de especificidad.

## Requisitos

- Saber escribir CSS básico (clases, selectores, herencia).
- Haber leído la [Unidad 01 — Tailwind CSS](Unidad_01_Tailwind_CSS.md) (para tener el contraste utility-first).
- Entender componentes React y props (incluidas las booleanas).
- Vite o webpack como bundler (los dos soportan CSS Modules por defecto).

## CSS Modules

Archivos `Component.module.css`; los nombres de clase se **hashean** y se importan como objeto:

```css
/* Button.module.css */
.button {
  border-radius: 6px;
  padding: 0.5rem 1rem;
}
.primary {
  background: #3b5bdb;
  color: #fff;
}
```

```jsx
import styles from './Button.module.css'

export function Button({ primary, children }) {
  const cls = primary ? `${styles.button} ${styles.primary}` : styles.button
  return <button className={cls}>{children}</button>
}
```

- Soporte nativo de Vite/webpack, **0 runtime**.
- Scoping local sin metodología BEM.

**Explicación del mecanismo (esto es lo mágico):**

1. Creas un CSS normal con tus selectores (`.button`, `.primary`), en un archivo cuyo nombre lleva **`.module.css`**.
2. Al importarlo (`import styles from './Button.module.css'`), el bundler (Vite/webpack) **no te da un string**: te da un **objeto** cuyas claves son tus nombres de clase originales y cuyos valores son versiones **hasheadas** (`styles.button` → `"Button_button_a1b2c"`).
3. En el DOM no aparece `.button` a secas, sino la clase hasheada. Así, aunque otra hoja del proyecto tenga un `.button` distinto, **no colisionan**: cada módulo tiene su namespace automático.

Eso resuelve el problema de siempre de CSS en apps grandes (una clase global pisa a otra en cualquier pantalla) **sin** tener que renombrar todo a `.mi-app-botón-rojo-grande` (la vieja metodología BEM).

Ventajas prácticas:

- *0 runtime:* el CSS se resuelve en tiempo de **compilación**; el navegador solo recibe CSS ya escrito. Nada de JS que genere estilos al cargar.
- *Scope local sin BEM:* escribes `.button` a secas y confías en que no habrá guerra con otros archivos.

## Styled Components (CSS-in-JS)

```bash
pnpm add styled-components
```

```jsx
import styled from 'styled-components'

const Boton = styled.button`
  border-radius: 6px;
  padding: 0.5rem 1rem;
  background: ${(p) => (p.$primary ? '#3b5bdb' : 'transparent')};
  color: ${(p) => (p.$primary ? '#fff' : '#3b5bdb')};
`

export function Button({ primary, children }) {
  return <Boton $primary={primary}>{children}</Boton>
}
```

- Props → estilos dinámicos, theming con `ThemeProvider`.
- Runtime cost y SSR considerations.

**Cómo leerlo, línea a línea:**

1. `styled.button` crea un **componente de React** que renderiza un `<button>`. El CSS va dentro de una *template literal* (backticks), como si escribieras CSS puro.
2. `${(p) => ...}` son **interpolaciones**: cualquier prop del componente (`p.$primary`) puede decidir el estilo en tiempo de ejecución. Es dinámico de verdad: el mismo componente pinta azul o transparente según el dato.
3. `$primary` lleva **prefijo de dólar** a propósito: styled-components filtra por defecto las props que empiezan por `$` para que **no lleguen al DOM** (un `primary` sin `$` acabaría como atributo HTML inválido en el `<button>`; ver "Errores comunes").
4. El componente final `<Boton $primary={...}>` es el que usas en tu JSX.

Características clave:

- *Props → estilos dinámicos:* la mayor fortaleza frente a CSS Modules, donde condicionar clases es manual.
- *Theming con `ThemeProvider`:` mismo patrón que MUI/Chakra: defines un tema global (colores, fuentes) y lo consumen todos los `styled.*` sin prop-drilling.
- *Runtime cost:* este CSS **se genera con JavaScript al ejecutarse** (no en build como los Modules): consume CPU en el navegador y puede causar parpadeos si el CSS aún no está listo.
- *SSR considerations:* si haces renderizado en servidor (Next.js, etc.), necesitas el extractor de estilos (`ServerStyleSheet`) para que el CSS inicial viaje en la respuesta HTML.

## Comparativa

| | CSS Modules | Styled Components | Tailwind |
|---|-------------|-------------------|----------|
| Runtime | no | sí | no |
| Dinámico por props | media | alta | media (variants) |
| Scope | automático | automático | utilities |

**Cómo usar esta tabla para decidir:**

- **Runtime:** CSS Modules y Tailwind resuelven todo en build (más rápidos al cargar); Styled Components calcula estilos con JS en el navegador.
- **Dinámico por props:** Styled Components gana: `background: ${p => p.color}` es natural. En Modules haces `cls = cond ? styles.a : styles.b`; en Tailwind, variantes (`cva`) o interpolación de colores personalizados.
- **Scope:** los dos primeros aíslan automáticamente las clases; Tailwind no "scopea" por archivo, sino que evita colisiones usando nombres de utilidades únicos y convenciones (`hover:`, `focus:`).

**Regla práctica:** si tu proyecto es React puro con build simple → CSS Modules (cero fricción). Si haces mucho diseño dinámico/theming y aceptas el runtime → Styled Components. Si ya usas utility-first en el equipo → Tailwind (Unidad 01).

## Errores comunes

**Error 1: Styled-components: props DOM filtradas → usa prefijo `$` o `shouldForwardProp`.**

```jsx
// ❌ Mal: "primary" llega al DOM y React avisa de atributo desconocido
const Boton = styled.button`...`
<Boton primary={true}>OK</Boton>

// ✅ Bien: con $ no se filtra al DOM
<Boton $primary={true}>OK</Boton>
```

**Solución:** en styled-components v5.1+ usa el prefijo `$` (transient props) o configura `shouldForwardProp`. Verás el error de React en consola ("React does not recognize the `primary` prop on a DOM element") si te lo saltas.

**Error 2: Modules: confiar en orden de especificidad global olvidando cascade externa.**

```jsx
// ❌ Mal: crees que gana tu .button porque es de tu módulo...
// ...pero un CSS global con !important o selector más específico lo pisa
```

```css
/* somewhere else en el proyecto */
button { padding: 0 !important; }
```

**Solución:** recuerda que el scope de Modules evita **colisiones de nombres**, no las leyes de cascada con selectores globales que escribas tú (o librerías de terceros). Evita `!important` globales, revisa qué CSS global se carga (`index.css`, resets) y si necesitas ganar, sube la especificidad **dentro** de tu módulo, no con `!important` al azar.

**Error 3: Mezclar los tres modelos en el mismo componente a lo loco.**

```jsx
// ❌ Mal: Tailwind + module.css + styled() sobre el mismo <button>
```

**Solución:** elige **un** enfoque por proyecto (o al menos por capa: layout con Tailwind, widgets complejos con styled, etc.). Mezclar sin criterio duplica el CSS, confunde al equipo y hace imposible responder "¿dónde se estila esto?".

## En el ejemplo

`ui/Button.module.css` + variante “styled” con CSS-in-JS minimalista sin dependencia (template literals → className fija) documentada; para producción se instalaría `styled-components`.

**Qué encontrarás en `EJEMPLO_DISENO`:** el `Button` del ejemplo convive con un `Button.module.css` (scope local) y hay documentada una variante estilo "styled" hecha con template literals **sin** instalar la librería, para que veas la mecánica (interpolación → clase final) con cero dependencias. Para producción, en serio: `pnpm add styled-components` (instálalo en una app aparte y repite el ejemplo de este documento).

## Conceptos clave

- **CSS Module:** archivo `*.module.css` con clases **hasheadas** y scope local automático.
- **Import como objeto:** `styles.button` → nombre real hasheado en el DOM.
- **0 runtime:** el scope se resuelve en build; no hay JS generando CSS.
- **CSS-in-JS / Styled Components:** componentes `styled.x` con CSS en template literals.
- **Interpolaciones `${(p) => ...}`:** estilos dinámicos según props.
- **Transient props (`$`):** props que no se filtran al DOM.
- **`ThemeProvider`:** theming global para styled-components.
- **Costes CSS-in-JS:** runtime, posible FOUC y extractor para SSR.
- **Comparativa:** Modules/`no runtime` vs styled/`dinámico` vs Tailwind/`utilities`.

## Autoevaluación

**1. ¿Por qué no colisionan dos `.title` de dos CSS Modules distintos?**

<details>
<summary>Respuesta</summary>

Porque cada nombre se **hashea** al compilar: `styles.title` apunta a algo como `Blog_title_x1y2`, distinto del `title` de otro módulo. El scope local automático evita la guerra de especificidad entre archivos.

</details>

**2. ¿Qué problema resuelve el prefijo `$` en styled-components?**

<details>
<summary>Respuesta</summary>

Evita que la prop pase al DOM. Sin `$`, props como `primary` acabarían como atributo HTML inválido en el nodo y React mostraría un warning; con `$primary` solo se usan dentro de la interpolación de estilos.

</details>

**3. CSS Modules, styled-components o Tailwind: ¿cuál tiene runtime?**

<details>
<summary>Respuesta</summary>

Solo **styled-components**. Los Modules y Tailwind resuelven sus estilos en tiempo de compilación (build) y no ejecutan JS para generar CSS en el navegador.

</details>

**4. Estoy en SSR (Next.js) con styled-components: ¿qué cuidado extra tengo?**

<details>
<summary>Respuesta</summary>

Necesitas extraer el CSS generado en servidor (`ServerStyleSheet` o el integration del framework) para que viaje en el HTML inicial; si no, habrá un parpadeo (FOUC) al cargar el cliente y el CSS de hydration no coincidirá.

</details>
