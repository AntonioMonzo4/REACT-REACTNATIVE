# Módulo 20 — Optimización

Material del **Módulo 20** del roadmap.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — Medir](docs/Unidad_01_Medir.md) | Lighthouse, métricas Web Vitals |
| [02 — Bundle e imágenes](docs/Unidad_02_Bundle_imagenes.md) | lazy, visualizer, AVIF, lazy-loading |
| [03 — Memo y Profiler](docs/Unidad_03_Memo_Profiler.md) | React.memo, Profiler, WDUR |

## Práctica

```bash
cd ../EJEMPLO_MODERNO   # o cualquier ejemplo
pnpm build
```

1. **Lighthouse** en `pnpm preview` → guardar score base.
2. Añade `rollup-plugin-visualizer` → abre `stats.html` y busca lo más pesado.
3. Parte un panel pesado con `lazy(() => import(...))` → compara chunk sizes.
4. Graba el **React Profiler** en una interacción y busca renders repetidos.
5. Repite Lighthouse → compara.

## Mapa con el README

- [x] Lighthouse
- [x] Lazy Loading
- [x] Memoización
- [x] Optimización de imágenes
- [x] Bundle Analyzer
- [x] React DevTools Profiler
- [x] why-did-you-render / trazas de render
- [ ] Antes/después documentado — *pendiente*
