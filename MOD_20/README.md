# Módulo 20 — Optimización

Material del **Módulo 20** del roadmap.

En este módulo aprenderás a hacer que tus aplicaciones React carguen más rápido y se sientan más fluidas, pero con enfoque profesional: **primero se mide, después se cambia una sola cosa, y vuelve a medir**. Nada de “me parece que está lento”.

## Para quién es este módulo

Dirigido a quien ya sabe escribir componentes React con TypeScript (recorrido **M4–M15**) pero nunca ha abierto Lighthouse, no sabe qué es un “bundle” o sospecha que sus listas se re-renderizan sin motivo. **No hace falta experiencia previa en rendimiento**, ni conocimientos de Webpack: los ejemplos usan Vite y te llevamos de la mano con comandos concretos.

Al terminar el módulo podrás: sacar un score de Lighthouse y explicar las métricas Web Vitals, encontrar el archivo más pesado de tu bundle, partir un componente con `lazy`, optimizar las imágenes y usar el Profiler de React para detectar renders innecesarios.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — Medir](docs/Unidad_01_Medir.md) | Lighthouse, métricas Web Vitals |
| [02 — Bundle e imágenes](docs/Unidad_02_Bundle_imagenes.md) | lazy, visualizer, AVIF, lazy-loading |
| [03 — Memo y Profiler](docs/Unidad_03_Memo_Profiler.md) | React.memo, Profiler, WDUR |

## Cómo estudiar

| Fase | Qué hacer | Resultado esperado |
|------|-----------|--------------------|
| 1 — Leer | Lee las tres unidades **en orden**, sin saltarte la 01 | Entiendes el flujo medir → hipótesis → cambio → medir |
| 2 — Reproducir | Copia los comandos en `../EJEMPLO_MODERNO` (o cualquier ejemplo) | Tienes `stats.html` abierto y un score de Lighthouse guardado |
| 3 — Practicar | Ejecuta la checklist de **Práctica mínima** de abajo | Has hecho al menos un cambio medible (lazy, imágenes o estado colgado) |
| 4 — Auditar | Vuelve a medir, compara antes/después y responde la autoevaluación de cada unidad | Puedes justificar cada optimización **con números**, no con opiniones |

## Práctica mínima

Si solo tienes 30 minutos, haz exactamente esto:

1. `pnpm build` + `pnpm preview` y pasa Lighthouse **una vez** → guarda el score base.
2. Instala `rollup-plugin-visualizer`, vuelve a construir y abre `stats.html`.
3. Parte un componente pesado con `lazy(() => import(...))` y compara los tamaños de chunk.

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
