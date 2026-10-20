# Ejemplo React Moderno — Módulo 15

Demo **React 19** (Vite) para practicar APIs nuevas **sin montar Next todavía**.

Para el proyecto full-stack Next.js, sigue los pasos en [`../README.md`](../README.md).

Este ejemplo está pensado como **primer contacto** con las novedades de React 19 (Unidad 01) en un entorno que ya conoces: una SPA con Vite, sin servidor, sin App Router y sin configuración extra. Así aislas la dificultad: primero dominas los hooks y el `ref` nuevo; después, en el `next-app`, añades server, rutas y caché.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

Qué obtienes con cada uno:

| Comando | Resultado esperado |
|---------|--------------------|
| `pnpm install` | `node_modules/` listo (usa pnpm como en todo el curso). |
| `pnpm dev` | servidor de desarrollo de Vite → abre la URL (normalmente `http://localhost:5173`). |
| `pnpm lint` | ESLint sin errores sobre los componentes del ejemplo. |
| `pnpm build` | build de producción en verde: tus componentes compilan con React 19. |

## Qué practica este ejemplo

- **`use()` con promesa + `Suspense`**: leer un valor asíncrono en el render y mostrar el `fallback` mientras resuelve — el mismo músculo que usarás en Server Components con `await`.
- **`ref` como prop**: componer refs sin `forwardRef` (la sintaxis de React 19).
- **`useActionState`**: estado de un envío asíncrono (`pending`, respuesta, error) con una action **simulada** (sin red): el patrón de las Server Actions antes de tocar el servidor.
- **`useOptimistic`**: pintar el resultado *como si* ya hubiera ocurrido mientras la mutación está en vuelo, y revertir si falla.

Lo que **no** practica (y sí el `next-app`): Server Components reales, `'use client'` como frontera, file-based routing, SSG/ISR y Route Handlers. Aquí todo es client; la demo es estática para no requerir red.

## Cómo recorrerlo

1. **Orden sugerido**: `LeerPromise.jsx` → `CampoRef.jsx` → `FormAction.jsx` → `Optimista.jsx` (de lo más declarativo a lo más “estado de mutación”).
2. Antes de mirar código, lee la [Unidad 01](../docs/Unidad_01_React_19.md): cada archivo de la tabla de abajo es la materialización de un apartado de esa unidad.
3. En `LeerPromise.jsx` busca dónde se **crea** la promesa (en el padre) y dónde se **lee** con `use()` (en el hijo dentro de `Suspense`). Prueba a quitar el `Suspense` para ver el error.
4. En `FormAction.jsx` rompe la simulación (rechaza la promesa) y observa el estado de error/`pending` del botón.
5. En `Optimista.jsx` observa que la UI cambia **antes** de que la acción “termine”, y que vuelve atrás si falla.
6. Cuando cada archivo te suene, pasa al `next-app` siguiendo el README del módulo: allí mismos hooks conviven con `app/`, `loading` y Route Handlers.

## Qué demuestra cada archivo

| Archivo | Concepto |
|---------|----------|
| `src/components/LeerPromise.jsx` | `use()` con promesa + `Suspense` |
| `src/components/CampoRef.jsx` | `ref` como prop (sin forwardRef) |
| `src/components/FormAction.jsx` | `useActionState` con action async simulada |
| `src/components/Optimista.jsx` | `useOptimistic` |

## Temario Módulo 15 — estado

- [x] `use()`, Server Actions (patrón), `ref` prop, hooks 19
- [x] Server vs Client, routing, SSR/SSG/ISR, data fetching, Route Handlers (teoría)
- [x] React Compiler (teoría)
- [ ] Proyecto App full-stack Next.js
