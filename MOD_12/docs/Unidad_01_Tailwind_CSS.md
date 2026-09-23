# Unidad 01 — Tailwind CSS

## Objetivos

- Entender qué significa "utility-first" y en qué se diferencia del CSS clásico.
- Instalar Tailwind v4 en un proyecto Vite + React (plugin, import, config).
- Escribir estilos directamente en el `className` de JSX con utilidades atómicas.
- Balancear los pros y los contras de Tailwind con criterio propio.
- Evitar cadenas de clases repetidas con `clsx` (y conocer `cva` / `tailwind-merge`).
- Localizar dónde se aplican las utilidades en el ejemplo `EJEMPLO_DISENO`.

## Requisitos

- Haber creado una app con Vite + React y saber qué es `className`.
- Tener algo de experiencia escribiendo CSS propio (clases, colores, padding).
- Node.js y `pnpm` instalados.
- No hace falta conocer SASS, PostCSS ni Webpack (Tailwind v4 los oculta).

## Qué es

Utility-first: clases atómicas en el HTML/JSX en lugar de hojas CSS propias.

**Explicación para quien empieza.** En el CSS tradicional inventas nombres: `.boton-grande-azul`, `.tarjeta-producto`, `.margen-uno`. El problema: los nombres hay que inventarlos, recordarlos y mantenerlos, y a mitad de proyecto nadie sabe si `.card-lg` es más grande o más pequeño que `.card-md`.

Tailwind propone otra idea: **no inventes nombres**. En su lugar, usa clases predefinidas con un significado exacto: `p-4` = padding de 1rem, `text-sm` = texto pequeño, `bg-blue-600` = azul de su paleta. Escribes el estilo **donde lo usas**, en el propio JSX.

Se llama *utility-first* (primero las utilidades) porque cada clase hace **una sola cosa** (es "atómica"): `px-4` solo pone padding horizontal, `rounded-lg` solo redondea, `text-white` solo pone color de texto. Compones el resultado como Lego.

### Instalación (Tailwind v4)

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```

```css
/* src/index.css */
@import "tailwindcss";
```

```jsx
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Guardar
</button>
```

**Paso a paso de lo que acabas de leer:**

1. Instalas dos paquetes en desarrollo: `tailwindcss` (el motor) y su **plugin oficial para Vite** (`@tailwindcss/vite`). En v4 ya no necesitas `postcss.config.js` ni `tailwind.config.js` para empezar: el plugin se encarga de todo.
2. En `vite.config.js` añades `tailwindcss()` a `plugins`, junto a `react()`. Así Vite sabe que cada vez que compilas debe procesar el CSS con Tailwind.
3. En tu CSS global solo escribes `@import "tailwindcss";`. Esa línea trae todas las utilidades y activa el **escaneo automático** de tus archivos: Tailwind mira tu `src/`, ve qué clases usas y genera **solo** esas (árbol de utilidades → CSS mínimo).
4. En el JSX, el botón lleva cinco clases: `rounded-lg` (redondeo grande), `bg-blue-600` (fondo azul), `px-4 py-2` (padding), `text-white` (texto blanco) y `hover:bg-blue-700` (otro azul al pasar el ratón). **No hay archivo CSS aparte**: el estilo vive en el componente.

## Ventajas / costes

| + | − |
|---|---|
| Velocidad y consistencia de spacing/color | JSX con cadenas largas |
| Design system en config (tokens) | Curva de nombres utilitarios |
| Tree-shake de CSS no usado | Colaboradores “creativos” con clases distintas |

**Leyendo la tabla en detalle:**

**Ventajas:**

- *Velocidad y consistencia:* usas siempre la misma escala (`p-4`, `m-4`, `gap-4`), así todo tu espaciado queda armónico sin pensar. No más `margin-left: 13px` porque sí.
- *Design system en config:* los colores y tallas salen de tokens (paletas `blue-500...900`) centralizados. Cambias el azul marca en un sitio y se propaga.
- *Tree-shake:* como Tailwind solo genera las clases que encontró en tu código, el CSS final es mínimo comparado con importar un CSS gigante.

**Costes:**

- *Cadenas largas:* el `className` de un botón bonito puede ocupar dos líneas. Se mitiga con `clsx` (lo verás más abajo).
- *Curva de nombres:* al principio "¿dónde está el padding mediano?" obliga a mirar la documentación. Es cuestión de dos semanas de uso.
- *Colaboradores creativos:* sin reglas, cada uno escribe `p-3` donde otro puso `p-4` y la UI queda irregular. Solución: normas de equipo y componentes compartidos (Módulo 11).

## Patrones en React

```jsx
// DRY con clsx / cn
import clsx from 'clsx'

function Card({ className, children }) {
  return <div className={clsx('rounded-xl border p-4 shadow-sm', className)}>{children}</div>
}
```

Variants: `cva`, `tailwind-merge`.

**Qué significa este patrón:**

- **DRY** = *Don't Repeat Yourself* (no te repitas). Copiar y pegar la misma cadena de 6 clases en 10 archivos es una bomba de tiempo: mañana cambias una clase en 10 sitios.
- **`clsx`** es una utilidad minúscula: recibe clases (incluso condicionales) y devuelve un string con las válidas. En el ejemplo, `Card` siempre lleva sus clases base (`rounded-xl border p-4 shadow-sm`) **más** lo que el padre pase por `className` (para personalizarla sin perder lo base).
- El patrón `className` recibido como prop es estándar en React: quien usa tu componente puede *extender* tus estilos sin editar tu archivo.
- **`cva`** (*class variance authority*) sirve para declarar variantes (`variant="primary" | "ghost"`, `size="sm" | "lg"`) de forma estructurada, sin `if`s regados por el componente.
- **`tailwind-merge`** resuelve el choque de utilidades: si tus clases base dicen `px-4` y el padre pasa `px-8`, un merge inteligente se queda solo con la última en vez de dejar dos paddings peleando por la especificidad.

```bash
pnpm add clsx tailwind-merge
```

## En el ejemplo

Clases Tailwind en `src/components/ui/Button.jsx` y layout (sin CSS file propio salvo `@import`).

En `EJEMPLO_DISENO` puedes comprobarlo: `Button.jsx` usa `clsx` para combinar sus clases base con las variantes, y el único CSS del proyecto es el `@import "tailwindcss"` inicial. Abre `App.jsx` y verás párrafos con tokens de color (`bg-blue-600`, `text-emerald-700`...) que puedes editar en vivo con `pnpm dev` corriendo.

## Errores comunes

**Error 1: Copiar mismas clases en muchos sitios y que luego diverjan.**

```jsx
// ❌ Mal: copiado en 7 archivos, mañana hay que cambiarlo en 7 sitios
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white">Guardar</button>

// ✅ Bien: un componente con sus clases encapsuladas
<Button variant="primary">Guardar</Button>
```

**Solución:** en cuanto una combinación de clases se repita dos veces, extráela a un componente (siguiendo Atomic Design del Módulo 11) o a una variante `cva`. Tailwind es para *estilar*, no para sustituir a los componentes.

**Error 2: Importar todo el CDN de Tailwind en producción.**

```html
<!-- ❌ Mal en producción: genera CSS en el navegador, sin optimizar -->
<script src="https://cdn.tailwindcss.com"></script>
```

**Solución:** usa el flujo de build (`@tailwindcss/vite` + `@import "tailwindcss"`). El CDN es solo para prototipos rápidos; en producción ralentiza la carga y no hace el tree-shake.

**Error 3: Peleas de especificidad por no usar `tailwind-merge`.**

```jsx
// className={clsx('px-4 p-2', className)} // el padre pasa 'px-8'... ¿cuál gana?
```

**Solución:** usa `tailwind-merge` (o `cn` = `clsx` + `twMerge`) para que, ante dos utilidades de la misma familia (`px-4` vs `px-8`), gane la última de forma explícita y predecible.

## Conceptos clave

- **Utility-first:** estilos con clases atómicas predefinidas en lugar de CSS propio.
- **Utilidad atómica:** una clase = una propiedad visual (`p-4`, `text-white`).
- **Instalación v4:** `@tailwindcss/vite` + `@import "tailwindcss"` (sin config por defecto).
- **Escaneo/tree-shake:** Tailwind genera solo las clases que tu código usa.
- **Tokens / paleta:** colores y espaciados centralizados (`blue-600`, escala `1-96`).
- **`clsx`:** combina clases (bases + personales + condicionales) en un string.
- **`cva`:** declara variantes (`variant`, `size`) de un componente.
- **`tailwind-merge`:** resuelve duplicados de la misma familia de utilidades.

## Autoevaluación

**1. ¿Qué significa "utility-first"?**

<details>
<summary>Respuesta</summary>

Que estilas componiendo clases utilitarias atómicas (una clase por efecto: `p-4`, `bg-blue-600`) directamente en el JSX, en vez de crear y mantener hojas CSS con nombres propios (`.mi-tarjeta`).

</details>

**2. ¿Cuántos archivos CSS necesita un proyecto Tailwind v4 mínimo?**

<details>
<summary>Respuesta</summary>

Uno global con `@import "tailwindcss";` (por ejemplo `src/index.css`) más el plugin en `vite.config.js`. El resto de estilos viven en los `className` de los componentes; no necesitas un CSS por componente.

</details>

**3. Tu `Card` recibe `className` del padre. ¿Cómo evitas duplicar clases?**

<details>
<summary>Respuesta</summary>

Combinando con `clsx` (o `cn` con `tailwind-merge`): `clsx('rounded-xl border p-4', className)`. Así las clases base siempre están y las del padre se suman (o reemplazan si son de la misma familia, con `twMerge`).

</details>

**4. Menciona dos costes reales de Tailwind.**

<details>
<summary>Respuesta</summary>

Dos habituales: (1) cadenas de clases largas en el JSX, y (2) la curva de aprendizaje de los nombres de utilidades; a ellos se suma el riesgo de que cada compañero use espaciados distintos sin normas de equipo.

</details>
