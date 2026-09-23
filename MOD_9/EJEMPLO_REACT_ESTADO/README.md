# Ejemplo Gestión de Estado — Módulo 9

Proyecto de práctica del **Módulo 9 (Gestión de Estado)**. Vite + React.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Qué demuestra cada archivo

| Archivo | Concepto |
|---------|----------|
| `src/store.js` | `configureStore` de Redux Toolkit |
| `src/features/cart/cartSlice.js` | Slice, actions, Immer |
| `src/features/products/productsSlice.js` | `createAsyncThunk` + estados de red |
| `src/store/useFavoritosStore.js` | Zustand + `persist` |
| `src/jotaiDemo.js` | Átomos de Jotai (contador + derivado) |
| `src/context/ThemeContext.js` + `ThemeProvider.jsx` | Context para tema |
| `src/components/DemoRedux.jsx` | Carrito + fetch de productos |
| `src/components/DemoZustand.jsx` | Favoritos persistidos |
| `src/components/DemoJotai.jsx` | useAtom / átomo derivado |

## Temario Módulo 9 — estado

- [x] Context
- [x] Redux Toolkit — Store / Slice / Actions / AsyncThunk
- [x] Zustand — introducción y casos de uso
- [x] Jotai — introducción y casos de uso
- [ ] Proyecto E-commerce
