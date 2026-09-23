# Unidad 02 — Bundle: lazy, analyzer, imágenes

## Code splitting / lazy

```jsx
const Reporte = lazy(() => import('./Reporte'))

<Suspense fallback={<Esqueleto />}>
  <Reporte />
</Suspense>
```

- Route-based (React Router `lazy`) + componentes pesados (charts, editores).

## Bundle analyzer (Vite)

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

- Busca: librerías duplicadas, imports de whole-lodash, CSS gigante.

## Tree-shaking

- ESM sí; `import _ from 'lodash-es'` mejor que `lodash` (CJS).
- Side-effect free → `"sideEffects": false` en libs (tuya con cuidado).

## Imágenes

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

- Siempre **width/height** → evitar CLS.
- Vite: import de assets → hash + optimización en build si usas plugins.
