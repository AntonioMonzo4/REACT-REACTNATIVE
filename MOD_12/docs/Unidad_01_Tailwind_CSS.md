# Unidad 01 — Tailwind CSS

## Qué es

Utility-first: clases atómicas en el HTML/JSX en lugar de hojas CSS propias.

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

## Ventajas / costes

| + | − |
|---|---|
| Velocidad y consistencia de spacing/color | JSX con cadenas largas |
| Design system en config (tokens) | Curva de nombres utilitarios |
| Tree-shake de CSS no usado | Colaboradores “creativos” con clases distintas |

## Patrones en React

```jsx
// DRY con clsx / cn
import clsx from 'clsx'

function Card({ className, children }) {
  return <div className={clsx('rounded-xl border p-4 shadow-sm', className)}>{children}</div>
}
```

Variants: `cva`, `tailwind-merge`.

## En el ejemplo

Clases Tailwind en `src/components/ui/Button.jsx` y layout (sin CSS file propio salvo `@import`).
