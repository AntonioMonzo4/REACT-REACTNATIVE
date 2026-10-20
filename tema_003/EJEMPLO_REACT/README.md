# Ejemplo React — Módulo 4

Proyecto de ejemplo del **Módulo 4 (React desde Cero)** del curso.
Creado con Vite + React.

Está pensado para **leerse y ejecutarse mientras estudias**: no hace
falta que entiendas el 100 % de un archivo para pasar al siguiente.
Ábrelo con tu editor a un lado y el navegador (o la terminal) al otro.

## Qué practica este ejemplo

Un solo vistazo a lo que vas a reforzar con este proyecto:

- Cómo arranca una app React (`createRoot`, `StrictMode`) y se
  compone un componente raíz con varios hijos.
- Cómo se pasan datos con **props** (acceso directo,
  desestructuración, listas con `key`).
- Cómo se reacciona a **eventos** del usuario (`onClick`,
  `onChange`, `onSubmit`).
- Cómo se guarda estado con `useState` y se sincroniza con
  `useEffect`, además de `useMemo` y un **custom hook**
  (`useCounter`).
- Cómo se conectan **estilos CSS** por capas (`index.css`,
  `App.css`, `Navbar.css`).

## Cómo recorrerlo

Orden sugerido, de lo esencial a lo específico:

1. `src/main.jsx` — punto de entrada: dónde se monta la app y por qué
   `StrictMode`.
2. `src/App.jsx` — componente raíz: aquí verás **todos** los ejemplos
   montados y cómo se pasan props entre ellos.
3. `src/components/Navbar.jsx` — componente sencillo: `className`,
   interpolación y `Fragment`.
4. `src/components/Props.jsx` — props en profundidad: acceso,
   desestructuración, inmutabilidad y `key`.
5. `src/components/Eventos.jsx` — manejadores de eventos y catálogo
   de eventos de React.
6. `src/components/ComponenteHooks.jsx` — `useState` (varios estados,
   arrays de dependencias de `useEffect`, inputs controlados).
7. `src/components/ComponenteUseMemo.jsx` — `useMemo` para no
   recalcular sin necesidad.
8. `src/hooks/CustomHooks.js` — el custom hook `useCounter`
   (convención `use...`).

Si algo no te cuadra, vuelve a la unidad teórica correspondiente
(ver enlace más abajo) y retoma el archivo donde lo dejaste.

## Comandos

```bash
pnpm create vite [nombre]   # cómo se creó el proyecto
pnpm install                # instalar dependencias
pnpm dev                    # servidor de desarrollo
pnpm build                  # compilar para producción
pnpm lint                   # analizar el código con ESLint
pnpm preview                # previsualizar el build
```

## Estructura y conceptos que demuestra

| Archivo | Concepto |
|---------|----------|
| `src/main.jsx` | Punto de entrada, `createRoot`, `StrictMode` |
| `src/App.jsx` | Componente raíz, composición de componentes |
| `src/components/Navbar.jsx` | Componente funcional, `className`, interpolación, `Fragment` |
| `src/components/Props.jsx` | Props: acceso, desestructuración, inmutabilidad, `key` |
| `src/components/Eventos.jsx` | Manejo de eventos (`onClick`, `onChange`...) y catálogo de eventos |
| `src/components/ComponenteHooks.jsx` | `useState` (múltiples estados), `useEffect` (arrays de dependencias), inputs controlados |
| `src/components/ComponenteUseMemo.jsx` | `useMemo` para memorizar cálculos |
| `src/hooks/CustomHooks.js` | Custom hook `useCounter` (convención `use...`) |
| `src/style/` | Estilos CSS por capa (global, app, navbar) |

> Teoría completa: [`../docs/`](../docs/) — ver [Unidad 03 — Props, children y listas](../docs/Unidad_03_Props_children_y_map.md)

## Temario de referencia (Módulo 4 del README)

- [x] ¿Qué es React? / JSX / Virtual DOM (teoría en clase)
- [x] Functional Components
- [x] Props y Children
- [x] useState
- [x] Eventos (onClick, onChange, onSubmit)
- [ ] Proyecto: Calculadora *(pendiente)*

> Los archivos de ejemplo están pensados para leerse y ejecutarse: todos están
> montados en `App.jsx` y pasan `pnpm lint` y `pnpm build`.
