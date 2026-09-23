# Módulo 9 — Gestión de Estado

Material del **Módulo 9** del roadmap (Context, Redux Toolkit, Zustand y Jotai).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Context como estado global](docs/Unidad_01_Context_estado_global.md) | Cuándo basta, splits, pitfalls |
| [02 — Redux: Store y Slice](docs/Unidad_02_Redux_Store_y_Slice.md) | `configureStore`, `createSlice`, Immer |
| [03 — Redux: Actions y AsyncThunk](docs/Unidad_03_Redux_Actions_y_AsyncThunk.md) | pending/fulfilled/rejected |
| [04 — Zustand](docs/Unidad_04_Zustand.md) | `create`, selectors, persist, async |
| [05 — Jotai](docs/Unidad_05_Jotai.md) | Átomos, derivados, scope |
| [06 — Comparativa](docs/Unidad_06_Comparativa.md) | Árbol de decisión y checklist |

### Práctica (`EJEMPLO_REACT_ESTADO/`)

Vite + React con las tres escuelas en una app:

- **Redux Toolkit** — carrito (`add`/`remove`/`clear`) + `fetchProductos` con AsyncThunk
- **Zustand** — favoritos con `persist` (localStorage)
- **Jotai** — contador + átomo derivado
- **Context** — tema claro/oscuro

```bash
cd EJEMPLO_REACT_ESTADO
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
```

## Mapa con el README

- [x] Context (repaso + uso como store ligero)
- [x] Redux Toolkit — Store
- [x] Redux Toolkit — Slice
- [x] Redux Toolkit — Actions
- [x] Redux Toolkit — AsyncThunk
- [x] Zustand — introducción y casos de uso
- [x] Jotai — introducción y casos de uso
- [ ] Proyecto: E-commerce — *pendiente* (el ejemplo es un carrito mínimo)
