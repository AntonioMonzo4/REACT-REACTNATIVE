# Módulo 9 — Gestión de Estado

Material del **Módulo 9** del roadmap: Context, Redux Toolkit, Zustand y Jotai.

Hasta aquí (M4–M8) has aprendido a manejar estado **dentro** de un componente (`useState`, `useReducer`), estado que se comparte **bajando props** y estado que se comparte **con Context** cuando pocos componentes lo necesitan. Este módulo da el salto a lo que en inglés se llama *state management*: cuando el estado ya no es "de una pantalla", sino **de la aplicación entera** y muchos componentes lo leen y lo modifican a la vez.

## Para quién es este módulo

- **Alumnos que vienen del M4–M8** con soltura en hooks (`useState`, `useEffect`, `useMemo`, `useCallback`), en el router y en peticiones a APIs (`fetch`). No necesitas saber nada de estado global previo: aquí se empieza de cero.
- Quien haya hecho el M6 (Context) ya conoce la **primera** herramienta; en este módulo veremos **cuándo Context basta** y **cuándo hay que migrar** a una librería de estado (Redux Toolkit, Zustand o Jotai).
- Quien esté preparando un proyecto real (E-commerce, dashboard, etc.) y necesita criterios para **elegir** librería, no solo "usar la que más suena".

> Analogía: hasta ahora guardabas las cosas en el **cajón de tu habitación** (`useState`) o en un **cuaderno compartido de la casa** (Context). Este módulo es cuando la casa crece y necesitas un **sistema**: una caja fuerte contable (Redux), un archivo con cajones etiquetados (Zustand) o muchas cajas pequeñas independientes (Jotai).

## Cómo estudiar

| Fase | Qué haces | Dónde |
|------|-----------|-------|
| 1 — Fundamentos | Lee la teoría sin prisa: qué es un store, un reducer, una action, un átomo | `docs/Unidad_01_Context_estado_global.md`, `docs/Unidad_02_Redux_Store_y_Slice.md` |
| 2 — Asíncrono | Entiende el ciclo `pending → fulfilled → rejected` con AsyncThunk | `docs/Unidad_03_Redux_Actions_y_AsyncThunk.md` |
| 3 — Alternativas | Compara Zustand y Jotai: menos boilerplate, modelos distintos | `docs/Unidad_04_Zustand.md`, `docs/Unidad_05_Jotai.md` |
| 4 — Práctica | Recorre el ejemplo completo y modifica cosas sin mirar | `EJEMPLO_REACT_ESTADO/` + `docs/Unidad_06_Comparativa.md` |

Regla de oro: **primera lectura completa, segunda lectura con el ejemplo abierto**. No te quedes en solo leer; el ejemplo es la parte que fija el conocimiento.

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

Secuencia recomendada: **01 → 02 → 03 → 04 → 05 → 06**. La 01 repasa y perfila Context (M6); la 02–03 forman un bloque de Redux (store primero, async después); la 04–05 son las alternativas modernas; la 06 solo tiene sentido cuando ya conoces las cinco anteriores.

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

## Práctica mínima

Si solo tienes tiempo para lo esencial, haz esto (≈ 1 sesión):

1. Arranca el ejemplo con `pnpm dev` y juega: añade productos al carrito, recarga la página y mira qué se conserva y qué no (favoritos sí viven en `localStorage` gracias a `persist` de Zustand).
2. Abre `src/features/cart/cartSlice.js` y `src/store/useFavoritosStore.js` y compara: mismo botón "añadir", dos formas de escribirlo.
3. Cambia el tema claro/oscuro (`Context`) y busca en el código **dónde** se guarda ese estado.
4. Responde la autoevaluación de la Unidad 06 sin mirar: ¿qué librería usarías para X caso?

## Mapa con el README

- [x] Context (repaso + uso como store ligero)
- [x] Redux Toolkit — Store
- [x] Redux Toolkit — Slice
- [x] Redux Toolkit — Actions
- [x] Redux Toolkit — AsyncThunk
- [x] Zustand — introducción y casos de uso
- [x] Jotai — introducción y casos de uso
- [ ] Proyecto: E-commerce — *pendiente* (el ejemplo es un carrito mínimo)
