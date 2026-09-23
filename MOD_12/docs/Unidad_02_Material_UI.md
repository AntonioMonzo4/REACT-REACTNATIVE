# Unidad 02 — Material UI (MUI)

## Objetivos

- Conocer qué ofrece Material UI y de dónde sale su estética (Material Design de Google).
- Instalar MUI con sus dependencias de Emotion e icons.
- Componer interfaces con componentes MUI (`Button`, `Stack`) y props declarativas (`variant`).
- Personalizar la app completa con `createTheme` + `ThemeProvider`.
- Evaluar con criterio cuándo elegir MUI y qué costes conlleva (bundle, estética).
- Entender por qué el ejemplo `EJEMPLO_DISENO` **no** instala MUI y cómo estudiarlo igualmente.

## Requisitos

- Haber leído la [Unidad 01 — Tailwind CSS](Unidad_01_Tailwind_CSS.md) (para comparar modelos de estilos).
- Saber crear componentes funcionales y usar props.
- Entender la idea de "envolver" la app con un Provider (`<ThemeProvider>`).
- Node.js + `pnpm`; una app Vite de prueba si quieres probarlo en vivo.

## Qué es

Librería de componentes con **Design System de Google Material**: botones, drawers, data grid…

**En palabras llanas:** en lugar de escribir tú el HTML y el CSS de cada botón, menú o tabla, MUI te da **componentes ya hechos, probados y con buena accesibilidad**, siguiendo las guías de diseño Material de Google (esa estética que ves en Gmail, YouTube o Flutter).

La diferencia clave con Tailwind (Unidad 01): Tailwind te da **ladrillos de CSS** y tú construyes; MUI te da **muebles terminados** (botones, drawers, date pickers) que personalizas con props. Si Tailwind es comprar madera y clavos, MUI es comprar un mueble de IKEA: rapidísimo de montar, pero la forma base es la del catálogo.

```bash
pnpm add @mui/material @emotion/react @emotion/styled @mui/icons-material
```

**Por qué cuatro paquetes:**

| Paquete | Para qué |
|---------|----------|
| `@mui/material` | los componentes (Button, Stack, Drawer...) |
| `@emotion/react` + `@emotion/styled` | el motor de CSS-in-JS que MUI usa por debajo |
| `@mui/icons-material` | el set de iconos oficiales (importa el que uses) |

```jsx
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

export function Acciones() {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="contained">Guardar</Button>
      <Button variant="outlined">Cancelar</Button>
    </Stack>
  )
}
```

**Lectura del código:**

- `Button` de MUI ya trae hover, foco, ripple y variantes listas: solo eliges `variant="contained"` (relleno) u `variant="outlined"` (borde).
- `Stack` es un contenedor que apila hijos con espaciado (`spacing={1}`) y dirección (`direction="row"`). Es el equivalente MUI de un flexbox con `gap`.
- Fíjate en el estilo de import: `@mui/material/Button` (ruta profunda). Es la forma recomendada para ayudar al tree-shaking (verás en "Costes").

## Theming

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: { primary: { main: '#3b5bdb' } },
  typography: { fontFamily: 'Inter, sans-serif' },
})

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

**Qué significa "theming":** defines **una sola vez** las decisiones globales de diseño (color primario, tipografía, radios, sombras) y todos los componentes MUI las respetan automáticamente. Sin esto, cada `Button` azul que quieras "a tu manera" requeriría CSS a mano.

- `createTheme({...})` crea el objeto de tema: aquí el azul primario pasa a ser `#3b5bdb` y la fuente a Inter.
- `ThemeProvider` envuelve la app (típicamente en `main.jsx`) y se lo **inyecta por contexto** a todos los componentes hijos.
- Los componentes consumen el tema por defecto: `color="primary"` ya no es el azul de Google, es el tuyo.
- Puedes anidar `ThemeProvider` (por ejemplo, un tema distinto solo para el backoffice).

## Cuándo

- Backoffice / dashboards rápidos con consistencia.
- Necesitas componentes densos (DataGrid, DatePicker) sin construirlos.

**Casos ideales:**

- **Backoffice y dashboards:** interfaces densas en botones, tablas, filtros y forms. MUI brilla aquí: todo llega con la misma consistentia sin que diseñes nada.
- **Componentes caros de construir:** un `DataGrid` con ordenación, paginación, selection y virtualización son semanas de trabajo. MUI lo trae (la versión community) de serie.
- **Equipos sin diseñador:** la estética Material ya es "aceptable por defecto"; no pasarás semanas discutiendo el radio de los bordes.

## Costes

- Bundle grande (importa desde `@mui/material/X` o tree-shake).
- Estética “MUI” reconocible; personalizar a fondo cuesta.
- Emotion en runtime (o `@mui/material/styles` static).

**Explicación honesta de cada coste (esto es lo que no te dicen en el tutorial):**

- *Bundle grande:* si haces `import { Button } ... from '@mui/material'` a lo bestia, puedes arrastrar decenas de KB. **Mitigación:** importa desde la ruta profunda (`@mui/material/Button`), que es lo que muestra el ejemplo, y deja que el tree-shake elimine lo no usado. Aun así, MUI pesa más que Tailwind.
- *Estética reconocible:* todo el mundo identifica una app MUI ("esta es la del curso de MUI"). Si tu marca quiere un diseño muy propio, vas a pelear con overrides. **Mitigación:** `createTheme` cubre el 70%; el resto son `sx` y `styled`.
- *Emotion en runtime:* MUI genera estilos en tiempo de ejecución (JS), lo que añade trabajo al pintar y complica el SSR/CSS extraído. **Mitigación:** MUI ofrece build estático (`@mui/material/styles` con extractor) para proyectos que lo necesiten.

## En el ejemplo

Nota de uso (el ejemplo no instala MUI para mantener el bundle de demo ligero); patrón de ThemeProvider documentado en el README del módulo.

**Cómo estudiarlo igualmente:** `EJEMPLO_DISENO` es una demo pequeña pensada para cargar rápido, así que **no** incluye MUI. La idea (patrón `ThemeProvider`) está documentada en el README del módulo. Si quieres probarlo en tus carnes, crea una app Vite aparte, instala el cuarteto de paquetes del bloque anterior y envuelve `<App />` con el theme de este documento: en 5 minutos tendrás tu primera app con el azul que tú quieras.

## Errores comunes

**Error 1: Importar todo desde el paquete raíz y hinchar el bundle.**

```jsx
// ❌ Mal: difícil de tree-shakear
import { Button, Stack } from '@mui/material'

// ✅ Bien: rutas profundas
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
```

**Solución:** importa siempre desde `@mui/material/Componente` (como en el ejemplo). Si ya tienes el import raíz, comprueba el tamaño con `pnpm build` antes y después para ver la diferencia.

**Error 2: Luchar con la estética en CSS puro en vez de usar el tema.**

```css
/* ❌ Mal: pisa MUI a mano, se rompe en la próxima actualización */
.MuiButton-root { background: #3b5bdb !important; }
```

```jsx
// ✅ Bien: declara el color en createTheme({ palette: { primary: { main: ... } } })
```

**Solución:** casi cualquier cambio global de color, tipografía o radio **entra en el tema**. Reserva el `sx` / `styled` para excepciones locales. Nunca selectores de clase internos con `!important`.

**Error 3: Instalar `@mui/icons-material` completo.**

```jsx
// ❌ Mal: no hace esto
import * as Icons from '@mui/icons-material'

// ✅ Bien: un icono concreto
import SaveIcon from '@mui/material/Icons/Save'
```

**Solución:** importa iconos uno a uno por su ruta (o usa el paquete `@mui/icons-material` con importaciones nombradas puntuales). Importar el set entero puede costarte cientos de KB.

## Conceptos clave

- **Material UI:** librería de componentes siguiendo Material Design de Google.
- **Dependencias:** `@mui/material` + Emotion (`react`, `styled`) + `@mui/icons-material`.
- **`variant`:** prop declarativa para cambiar la apariencia (`contained`, `outlined`, `text`).
- **`Stack`:** contenedor MUI para filas/columnas con `spacing` y `direction`.
- **`createTheme`:** objeto con la identidad visual global (palette, typography...).
- **`ThemeProvider`:** inyecta el tema por contexto a toda la app.
- **Rutas profundas de import:** `@mui/material/Button` favorece el tree-shaking.
- **Costes:** bundle, estética reconocible, runtime de Emotion.
- **Cuándo usarla:** backoffices, dashboards y componentes densos sin diseñador.

## Autoevaluación

**1. Tailwind vs MUI: ¿cuál es la diferencia fundamental?**

<details>
<summary>Respuesta</summary>

Tailwind da utilidades de CSS que compones tú en el JSX (ladrillos); MUI da componentes terminados (`<Button>`, `<DataGrid>`) que personalizas con props y tema (muebles). Uno estila, el otro entrega UI ya construida.

</details>

**2. ¿Cómo cambio el azul primario de todos los botones MUI a la vez?**

<details>
<summary>Respuesta</summary>

Creando el tema: `createTheme({ palette: { primary: { main: '#3b5bdb' } } })` y envolviendo la app con `<ThemeProvider theme={theme}>`. Todos los componentes que usen `color="primary"` adoptan el nuevo color sin tocarlos uno a uno.

</details>

**3. ¿Por qué conviene importar `Button` desde `@mui/material/Button`?**

<details>
<summary>Respuesta</summary>

Porque las rutas profundas facilitan el tree-shaking: el bundler incluye solo el componente que usas en vez de arrastrar partes del paquete raíz. Es una de las mitigaciones del coste de bundle.

</details>

**4. Menciona dos buenas razones para elegir MUI.**

<details>
<summary>Respuesta</summary>

(1) Backoffices/dashboards que necesitan consistencia rápido sin diseñador, y (2) componentes caros de construir (DataGrid, DatePicker) que vienen listos. También vale si tu equipo no quiere discutir estética desde cero.

</details>
