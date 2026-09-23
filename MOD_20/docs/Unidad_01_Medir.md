# Unidad 01 — Medir antes de optimizar

## Métricas

| Métrica | Herramienta | Objetivo orientativo |
|---------|-------------|----------------------|
| LCP | Lighthouse | < 2.5 s |
| CLS | Lighthouse | < 0.1 |
| INP | Lighthouse | < 200 ms |
| TTI / bundle | Lighthouse, `vite build` | poco JS inicial |
| Renders | React DevTools Profiler | sin renders “fantasma” |

## Flujo

```text
1. Medir (perfil real, no “me parece lento”)
2. Hipótesis (¿mucho JS? ¿estado que cambia mucho?)
3. Cambio pequeño
4. Medir otra vez
```

## Lighthouse

- Chrome → DevTools → pestaña Lighthouse.
- Modo “simulated throttling” + 4G para móvil.
- Guardar corrida base antes/después.

## Errores comunes

- Micro-optimizar `useMemo` sin problema de rendimiento medido.
- Medir en dev build (React development es más lento).
