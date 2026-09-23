# Unidad 02 — Bundle: lazy, analyzer, imágenes

## Objetivos

- Entender qué es el **bundle** y por qué partirlo (*code splitting*) acelera la carga.
- Aplicar `React.lazy` + `Suspense` a un componente o ruta pesada.
- Instalar `rollup-plugin-visualizer` y leer `stats.html` para encontrar lo que pesa.
- Conocer el **tree-shaking** y cómo afecta la forma en que importas librerías.
- Optimizar imágenes: formatos modernos, `srcset`, `loading="lazy"` y `fetchpriority`.

## Requisitos

- Haber completado la **Unidad 01** (saber medir con Lighthouse y tener una línea base).
- React M4–M15: imports dinámicos, JSX, rutas con React Router (si tu ejemplo los usa).
- Un ejemplo con Vite que puedas construir (`pnpm build`) en `../EJEMPLO_MODERNO` o similar.
- Terminal cómoda con `pnpm`.

## Code splitting / lazy

Por defecto, Vite (como cualquier bundler) empaqueta **todo** tu JavaScript en pocos archivos y la app los descarga antes de mostrar nada. Si tu app incluye un editor de texto, gráficas o una ruta de admin que solo usa una de cada 100 personas, **todas** pagan el coste de descargarlo.

El **code splitting** parte ese monolito en *chunks* que se descargan **solo cuando hacen falta**. En React, la forma clásica es `React.lazy` para un componente y `Suspense` para mostrar algo mientras el chunk llega:

```jsx
const Reporte = lazy(() => import('./Reporte'))

<Suspense fallback={<Esqueleto />}>
  <Reporte />
</Suspense>
```

Cómo funciona paso a paso:

1. `lazy(() => import('./Reporte'))` crea un componente que, **la primera vez que React lo necesita**, dispara la importación dinámica `import('./Reporte')`. Vite reconoce ese `import()` y genera un chunk separado para `Reporte`.
2. Mientras el chunk descarga, React renderiza el `fallback` que pusiste en `Suspense` (un esqueleto, un spinner…).
3. Cuando el chunk llega, React sustituye el fallback por el componente real.

Dónde conviene usarlo:

- **Por ruta** (React Router `lazy`): cada pantalla = su propio chunk; el usuario solo descarga la ruta que visita.
- **Componentes pesados**: charts, editores WYSIWYG, modales de terceros, PDF viewers… cosas grandes y no siempre visibles.

## Bundle analyzer (Vite)

Antes de partir nada, hay que **ver** qué pesa. `rollup-plugin-visualizer` genera un mapa HTML de tu bundle:

```bash
pnpm add -D rollup-plugin-visualizer
```

```js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [react(), visualizer({ open: true, gzipSize: true })],
})
```

Después de un `pnpm build` se abre `stats.html`: cada rectángulo es un módulo, y su tamaño es su peso real en el bundle. Con `gzipSize: true` ves el tamaño comprimido (más cercano a lo que baja por la red).

- Busca: librerías duplicadas, imports de whole-lodash, CSS gigante.

Es decir, en `stats.html` revisa si aparecen:

- **Librerías duplicadas** (dos versiones de la misma dependencia a la vez).
- **Imports de whole-lodash**: `import _ from 'lodash'` tira de la librería entera cuando quizá solo usas `debounce`.
- **CSS gigante**: hojas de estilos de librerías completas que solo usas un par de clases.

## Tree-shaking

El *tree-shaking* (“sacudir el árbol”) es la capacidad del bundler de **eliminar código que importaste pero nunca usas**. Para que funcione:

- ESM sí; `import _ from 'lodash-es'` mejor que `lodash` (CJS).
- Side-effect free → `"sideEffects": false` en libs (tuya con cuidado).

En detalle:

- El tree-shaking solo funciona bien con **ES Modules** (`import`/`export`). Por eso se prefiere `lodash-es` (ESM) antes que `lodash` (CommonJS, CJS): con CJS el bundler no puede saber con seguridad qué partes se usan.
- Un paquete se declara **side-effect free** (sin efectos secundarios) con `"sideEffects": false` en su `package.json`, lo que le permite al bundler descartar imports enteros que no aportan nada. Si **tú** publicas una librería puedes añadirlo, pero “tuya con cuidado”: si tu código tiene efectos globales (por ejemplo, un polyfill o CSS importado por su efecto), declararlo sin efectos secundarios hará que el bundler lo borre y algo se rompa.

## Imágenes

Las imágenes suelen ser el mayor peso de una página. Tabla de técnicas:

| Técnica | Cómo |
|---------|------|
| Formato | **WebP/AVIF** > PNG |
| `srcset` / `sizes` | responsive |
| `loading="lazy"` | below the fold |
| `fetchpriority="high"` | LCP hero |
| Preload solo lo crítico | `<link rel="preload">` |

```jsx
<img src="/hero.avif" alt="…" fetchPriority="high" width={1200} height={630} />
```

Qué hace cada una:

- **Formato**: AVIF y WebP comprimen muchísimo mejor que PNG/JPG sin pérdida visible. Reserva PNG solo si necesitas transparencia y no puedes usar WebP/AVIF.
- **`srcset` / `sizes`**: le dices al navegador qué versiones de la imagen existen y cuándo usar cada una; el móvil descarga la pequeña, el retina o el escritorio la grande.
- **`loading="lazy"`**: carga diferida para todo lo que está **below the fold** (por debajo de la primera pantalla): el usuario no paga el coste de imágenes que aún no ve.
- **`fetchpriority="high"`** (en React: `fetchPriority`): se usa en la imagen **LCP del hero**, la que sí debe llegar cuanto antes. Ojo con la trampa: lazy y high prioridad son para sitios distintos.
- **`<link rel="preload">`**: solo lo crítico; si haces preload de todo, el navegador prioriza nada.

Y dos reglas de oro:

- Siempre **width/height** → evitar CLS. Sin dimensiones, el navegador no reserva espacio y el contenido salta al llegar la imagen (peor CLS en Lighthouse).
- Vite: import de assets → hash + optimización en build si usas plugins. Si haces `import hero from './hero.avif'`, Vite le pone hash de versión (cache perfecto) y con los plugins adecuados puede optimizarlo en build.

## Errores comunes

- **Poner `loading="lazy"` a la imagen del hero**: retrasa justamente la imagen que define el LCP y empeora tu métrica principal.
- **Olvidar `width`/`height`** en `<img>`: reserva de espacio incorrecta y saltos de layout (CLS alto).
- **Importar librerías enteras** (`import _ from 'lodash'`) en lugar de módulos concretos o la variante ESM: el tree-shaking no puede ayudarte.
- **Medir el bundle en dev**: `stats.html` se genera a partir de `pnpm build`; en desarrollo no hay chunks reales.
- **`<link rel="preload">` de todo**: anula la prioridad del navegador; precarga solo lo verdaderamente crítico (fuente, hero).

## Conceptos clave

- **Bundle**: archivo(s) JS/CSS resultantes de empaquetar tu app para producción.
- **Chunk**: fragmento del bundle generado por code splitting (una ruta, un componente lazy…).
- **Code splitting / `React.lazy`**: descarga JavaScript por partes bajo demanda, con `Suspense` mostrando el fallback.
- **Bundle analyzer (`rollup-plugin-visualizer`)**: mapa HTML del peso de cada módulo (`stats.html`).
- **Tree-shaking**: eliminación de código importado pero no usado; funciona mejor con ESM y paquetes sin efectos secundarios.
- **AVIF/WebP, `srcset`, `loading="lazy"`, `fetchpriority="high"`**: conjunto de técnicas de imágenes para peso, respuesta y CLS.
- **CLS**: el salto de layout que se produce si no reservas `width`/`height`.

## Autoevaluación

1. Tu app tiene una ruta `/admin` con un editor pesado que solo usan los administradores. ¿Qué técnica aplicas y qué ve la persona usuaria mientras descarga?

<details><summary>Respuesta</summary>

Code splitting con `lazy(() => import('./EditorAdmin'))` envuelto en `<Suspense fallback={<Esqueleto />}>` (o el equivalente lazy de React Router por ruta). Las personas usuarias normales **nunca descargan** ese chunk; quien entra a `/admin` ve primero el `fallback` (esqueleto/spinner) mientras llega el JavaScript.

</details>

2. Abres `stats.html` y ves que `moment` ocupa un rectángulo enorme. ¿Cuáles son dos respuestas razonables?

<details><summary>Respuesta</summary>

(1) Reducir lo que importas: usar solo funciones concretas o un paquete más ligero (por ejemplo `dayjs` o los módulos puntuales), evitando imports que arrastran la librería entera. (2) Asegurarte de que el código permite tree-shaking (ESM, sin side effects); con el visualizer compruebas el efecto en la siguiente corrida de `pnpm build`.

</details>

3. ¿Por qué el `<img>` del hero lleva `fetchPriority="high"` y `width`/`height`, pero el resto de imágenes de la página `loading="lazy"`?

<details><summary>Respuesta</summary>

El hero es el elemento **LCP**: debe llegar primero y con máxima prioridad. Las demás están *below the fold* y cargarlas con `loading="lazy"` evita competir por ancho de banda antes de que la persona haga scroll. `width`/`height` siempre, para que el navegador reserve espacio y no haya saltos de layout (CLS).

</details>

4. ¿Qué dos diferencias prácticas tienes que comprobar en `stats.html` tras añadir `visualizer({ gzipSize: true })`?

<details><summary>Respuesta</summary>

El tamaño **gzip real** (lo que viaja por la red, más representativo que el bruto) y qué módulos concretos dominan cada chunk: así detectas librerías duplicadas, imports de whole-lodash o CSS gigante antes de partir nada con `lazy`.

</details>
