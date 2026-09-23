# Unidad 07 — Estilos en React

Bienvenido a la última unidad teórica del Módulo 4. Hasta ahora hemos
aprendido a crear componentes, pasarles props y manejar estado con hooks.
En esta unidad veremos cómo **darle color, forma y buena pinta** a lo que
el usuario ve en pantalla.

React no inventa un sistema de estilos propio: usa el CSS que ya conoces
(reglas, clases, selectores). Lo único que cambia es *dónde* escribes ese
CSS y *cómo* lo conectas con tus componentes.

## Objetivos

Al terminar esta unidad deberías poder:

- Explicar las tres formas habituales de estilar en React (CSS clásico,
  CSS Modules y librerías como styled-components o Tailwind).
- Importar un archivo `.css` dentro de un componente JSX.
- Usar `className` en lugar del atributo HTML `class`.
- Definir variables CSS en `:root` y usarlas como custom properties
  (`--accent`, `--bg`...).
- Configurar un modo oscuro con `prefers-color-scheme` sin escribir
  una sola línea de JavaScript.
- Entender por qué los nombres de clase deben ser únicos (y qué son los
  CSS Modules).

## Requisitos

Antes de leer esta unidad deberías haber completado las anteriores del
módulo:

- **U01** — [Introducción a React](Unidad_01_Introduccion_a_React.md):
  qué es React, Virtual DOM y JSX.
- **U02** — [Componentes y composición](Unidad_02_Componentes_y_composicion.md):
  functional components, Fragment.
- **U03** — [Props, children y map](Unidad_03_Props_children_y_map.md):
  pasar datos a los componentes y renderizar listas.
- **U04** — [Eventos](Unidad_04_Eventos.md): `onClick`, `onChange`,
  `onSubmit`.
- **U05** — [Estado y useState](Unidad_05_Estado_useState.md): estado,
  inputs controlados, renderizado condicional.
- **U06** — [Hooks básicos](Unidad_06_Hooks_basicos.md): `useEffect`,
  `useMemo` y custom hooks.

Si necesitas repasar cualquiera de esos temas, vuelve a la unidad
correspondiente antes de continuar.

## ¿Cómo se estila en React?

La buena noticia: **no hay que aprender CSS nuevo**. Sigues escribiendo
las mismas reglas de siempre:

```css
.navbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}
```

Lo que sí cambia es la *forma de conectar* esas reglas con tus
componentes. Exen tres métodos principales:

### Opciones

| Método | Cómo se usa | Uso en este ejemplo |
|--------|-------------|---------------------|
| CSS clásico (`import './style/x.css'`) | Importas el `.css` en el `.jsx` y usas `className="clase"` | ✅ `index.css`, `App.css`, `Navbar.css` |
| CSS Modules | Archivos `x.module.css`, importas `import styles from "./x.module.css"` y usas `styles.clase` | no usado aquí |
| Styled components / Tailwind | Librerías de CSS-in-JS o utilidades predefinidas | ver proyectos avanzados |

- **CSS clásico** es el más sencillo y el que usamos en el ejemplo:
  creas un archivo `.css` normal y lo importas arriba del todo en tu
  componente. El problema es que las clases son **globales**: si dos
  archivos usan `.card`, chocan.
- **CSS Modules** soluciona ese choque: al importar `styles.card`, la
  herramienta de build renombra la clase por ti de forma automática.
- **styled-components / Tailwind** son librerías populares que verás en
  proyectos más avanzados; aquí solo las mencionamos para que reconozcas
  sus nombres.

### El atributo `className`

En HTML escribirías `<nav class="navbar">`. En JSX, `class` es una
palabra reservada de JavaScript, así que React usa **`className`**:

```jsx
<nav className="navbar">...</nav>
```

Si pones `class="navbar"` React mostrará un aviso en consola y no
aplicará bien los estilos. Recuerda: **siempre `className` en JSX**.

## Variables y dark mode (`index.css`)

Las **variables CSS** (o *custom properties*) nos permiten guardar
valores reutilizables, igual que una constante pero para estilos. Se
definen dentro del selector `:root`, que representa el elemento raíz
del documento (en la práctica, `<html>`):

```css
:root {
  --accent: #aa3bff;
  --border: #e5e4e7;
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --accent: #c084fc;
    --bg: #16171d;
  }
}
```

Desglosemos las piezas:

- `:root { --accent: #aa3bff; }` crea la variable `--accent`. Para
  *usarla* después escribes `color: var(--accent);` en cualquier regla.
- `color-scheme: light dark;` le dice al navegador que esta página
  admite ambos temas, para que sus controles nativos (barras de
  scroll, inputs) se adapten.
- `@media (prefers-color-scheme: dark)` es una media consulta: solo se
  aplica si el **sistema operativo** del usuario está en modo oscuro
  (Windows, macOS o el móvil). Dentro redefinimos las mismas variables
  con otros valores.

Resultado: CSS custom properties + `prefers-color-scheme` → tema
claro/oscuro **sin JS**. Cuando el usuario cambia de tema en su
sistema, la página se repinta sola.

## Capas del ejemplo

El proyecto de práctica divide los estilos en tres archivos, de lo más
general a lo más concreto:

- `index.css` — reset, tipografía, variables, `#root`.
  Es la hoja global: base tipográfica, márgenes a cero y las variables
  del tema. Se importa **una sola vez** en `main.jsx`.
- `App.css` — `.app-main` (flex, centrado), `.example` (cards),
  botones/inputs.
  Estilos del layout de la aplicación y de los componentes visuales.
- `Navbar.css` — `.navbar` flex horizontal.
  Estilos propios del componente `Navbar`.

### Importar CSS en un componente

Cada componente importa su propia hoja de estilos arriba del archivo:

```jsx
import "../style/Navbar.css"

function Navbar() {
  return <nav className="navbar">...</nav>
}
```

Vite (y la mayoría de herramientas de build) sabe procesar estos
imports: incluirá el CSS una vez en la página final.

> Las importaciones de CSS son globales; los nombres de clase deben ser
> únicos (o usar CSS Modules: `styles.navbar`).

Es decir, si en `App.css` defines `.example` y en `Navbar.css` defines
otra `.example`, la última que se cargue "gana" y tus estilos se
rompen de formas extrañas. Por eso conviene nombres descriptivos
(`.app-main`, `.navbar`, `.card-tarea`...) o directamente migrar a CSS
Modules cuando el proyecto crezca.

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Usar `class` en JSX | Aviso en consola, estilos no aplicados | Usa `className="mi-clase"` |
| Olvidar el `import "./x.css"` | El componente se ve sin estilos | Añade el import en la parte superior del `.jsx` |
| Dos hojas con la misma clase | Estilos "fantasma" que cambian sin motivo | Nombres únicos o CSS Modules (`styles.navbar`) |
| Escribir `style="color: red"` (string) | Error de sintaxis / no funciona | En JSX usa `style={{ color: "red" }}` (objeto) |
| Variables sin `--` o sin `var()` | La propiedad no se aplica | Define `--accent` en `:root` y usa `var(--accent)` |
| Esperar que `prefers-color-scheme` reaccione al botón de la app | El tema no cambia al pulsar | Esa media consulta sigue al sistema operativo; para un botón interno necesitas una clase/atributo extra en `<html>` |

## Conceptos clave

- **`className`**: el equivalente JSX de `class`.
- **CSS clásico en React**: `import "./style/Navbar.css"` + clases
  globales únicas.
- **CSS Modules**: `Navbar.module.css` → `styles.navbar`, clases
  renombradas automáticamente por el build.
- **`:root`**: selector del elemento raíz; lugar habitual para
  definir variables.
- **Custom properties**: variables CSS con formato `--nombre: valor`,
  se leen con `var(--nombre)`.
- **`prefers-color-scheme`**: media consulta que detecta el tema
  claro/oscuro del sistema.
- **`color-scheme`**: le indica al navegador qué temas admite la
  página.

## Autoevaluación

Responde de memoria antes de abrir la respuesta.

<details>
<summary>Respuesta</summary>

`className`. En JSX, `class` colisiona con la palabra reservada de
JavaScript, así que React renombra el atributo a `className`.
`className="navbar"`.

</details>

<details>
<summary>Respuesta</summary>

Porque al importar un `.css` en React sus reglas pasan a ser
**globales**: cualquier otro archivo del proyecto puede chocar con
esas clases. Para evitarlo usa nombres únicos o CSS Modules
(`styles.navbar`), que el build renombra automáticamente.

</details>

<details>
<summary>Respuesta</summary>

`:root` es el selector del elemento raíz (`<html>`) y tiene
especificidad suficiente para definir **variables CSS** accesibles en
todo el documento. Dentro se declara `--accent: #aa3bff;` y luego se
usa con `color: var(--accent);` en cualquier regla.

</details>

<details>
<summary>Respuesta</summary>

CSS custom properties + `@media (prefers-color-scheme: dark)`: cuando
el sistema operativo está en modo oscuro, las mismas variables se
redefinen con otros valores y la página cambia de tema **sin
JavaScript**. La hoja `index.css` del ejemplo lo hace con `--accent` y
`--bg`.

</details>

## En el ejemplo

Revisa los estilos completos del proyecto de práctica en
[`EJEMPLO_REACT/src/style/`](../EJEMPLO_REACT/src/style/).

Con esta unidad termina la teoría del Módulo 4: ahora pasa al
proyecto y consolida todo lo aprendido.
