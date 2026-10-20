# Ejemplo Gestión de Estado — Módulo 9

Proyecto de práctica del **Módulo 9 (Gestión de Estado)**. Vite + React.

Aquí conviven **las tres escuelas** de estado global del módulo (Redux Toolkit, Zustand y Jotai) más un **Context** clásico, en una sola app pequeña. No hay backend propio: los "productos" llegan de un `fetch` simulado, así que puedes observar los estados de red sin levantar servidor.

## Qué practica este ejemplo

- **Redux Toolkit**: cómo se organiza un dominio completo — `store.js` (registro de reducers), `cartSlice.js` (acciones síncronas con Immer) y `productsSlice.js` (`createAsyncThunk` con `pending`/`fulfilled`/`rejected`).
- **Patrón de red en store**: `status` (`idle` → `loading` → `succeeded`/`failed`) + `error`, el mismo contrato que en las notas de la Unidad 03, con botón "Recargar" para volver a dispararlo.
- **Zustand con `persist`**: favoritos que **sobreviven a un F5** porque el middleware los guarda en `localStorage`. Compáralo: el carrito (RTK) se pierde al recargar, los favoritos no.
- **Jotai**: un átomo primitivo (`contador`) y un átomo derivado (`doble`) compartidos entre componentes **sin Provider**.
- **Context al estilo M6**: tema claro/oscuro con Provider + hook de consumo; la pieza que ya conocías, ahora conviviendo con las librerías.
- **Comparar sin sesgo**: la home muestra las tres demos a la vez — mismo patrón "añadir/quitar", tres formas de escribirlo. Esa comparación de líneas y boilerplate es el objetivo real del ejemplo.

## Cómo recorrerlo

Orden sugerido (de lo que ya conoces a lo nuevo; ~1 sesión):

1. **Arranca**: `pnpm install` y `pnpm dev`; abre la home y toca tema, carrito, favoritos y contador para ver *qué cambia y qué persiste* tras recargar.
2. **Context** (repaso M6): lee `src/context/ThemeContext.js` y `ThemeProvider.jsx`; localiza el `createContext`, el Provider y el hook. Pregunta: ¿por qué esta pieza no necesita librería externa?
3. **Redux — estado síncrono**: `src/features/cart/cartSlice.js` → `src/store.js` (¿dónde se registra el reducer?) → `src/components/DemoRedux.jsx` (`useDispatch`/`useSelector` en el botón de añadir).
4. **Redux — asíncrono**: `src/features/products/productsSlice.js` (`createAsyncThunk`, tres `addCase`) y el botón "Recargar" de `DemoRedux.jsx`; corta la red y observa `failed`.
5. **Zustand**: `src/store/useFavoritosStore.js` (estado + acciones en un `create()`, `persist` con `{ name }`) → `src/components/DemoZustand.jsx` (selectores finos).
6. **Jotai**: `src/jotaiDemo.js` (átomo primitivo + derivado) → `src/components/DemoJotai.jsx` (`useAtom`/`useAtomValue`).
7. **Cierre**: vuelve a la Unidad 06 (`docs/Unidad_06_Comparativa.md`) y responde su autoevaluación **con el código a la vista**.
8. **Modifica sin miedo**: añade una acción `clear` al store de favoritos, un estado de error al Context del tema, o persiste (o no) el carrito — comprobarás las consecuencias en caliente.

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
