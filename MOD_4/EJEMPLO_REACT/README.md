# Ejemplo React — Módulo 4

Proyecto de ejemplo del **Módulo 4 (React desde Cero)** del curso.
Creado con Vite + React.

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
| `docs/extra.md` | Apuntes: iterar con `map` y pasar props |

## Temario de referencia (Módulo 4 del README)

- [x] ¿Qué es React? / JSX / Virtual DOM (teoría en clase)
- [x] Functional Components
- [x] Props y Children
- [x] useState
- [x] Eventos (onClick, onChange, onSubmit)
- [ ] Proyecto: Calculadora *(pendiente)*

> Los archivos de ejemplo están pensados para leerse y ejecutarse: todos están
> montados en `App.jsx` y pasan `pnpm lint` y `pnpm build`.
