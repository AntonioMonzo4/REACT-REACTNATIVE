# Módulo 25 — TanStack Query, React Hook Form y Zod
> 🧭 **Navegación:** [← Anterior: tema_023 — Preparación Profesional](../tema_023/README.md) · [Índice del curso](../GUIA_ESTUDIO.md) · [🏁 Índice general →](../README.md)

Material del **Módulo 25** del roadmap (data fetching moderno y formularios
profesionales). Módulo añadido tras revisar huecos del curso: M8 enseña
`useFetch` casero y M5 formularios con `useState`, pero el stack que usan las
empresas hoy es **TanStack Query + React Hook Form + Zod**.

## Para quién es este módulo

- **Para ti si** terminaste M4–M14 (React, APIs con fetch/axios, formularios
  controlados, TypeScript) y quieres el estándar actual de data + forms.
- **Para ti si** ya reutilizas `useFetch` por todos lados y notas que te faltan
  caché, reintentos, invalidación y mutaciones.
- **Para ti si** tus formularios tienen un `useState` por campo y validaciones
  repartidas en el código del componente.
- **No hace falta** haber usado estas librerías antes; se construye sobre los
  conceptos de M5 (forms), M8 (APIs) y M9 (estado del cliente vs servidor).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — TanStack Query: fundamentos](docs/Unidad_01_TanStack_Query_fundamentos.md) | `useQuery`, `queryKey`, caché, `staleTime`, errores |
| [02 — TanStack Query: mutaciones](docs/Unidad_02_TanStack_Query_mutaciones.md) | `useMutation`, invalidación, optimista |
| [03 — React Hook Form](docs/Unidad_03_React_Hook_Form.md) | `register`, `handleSubmit`, `formState`, `Controller` |
| [04 — Zod: validación con esquemas](docs/Unidad_04_Zod_validacion.md) | `z.object`, `z.infer`, `safeParse`, composición |
| [05 — Integración RHF + Zod + Query](docs/Unidad_05_Integracion_RHF_Zod_y_Query.md) | `zodResolver`, CRUD completo, patrón final |

Cada unidad incluye: objetivos, requisitos, prosa para novatos, código, **Errores
comunes** con solución, **Conceptos clave** y **Autoevaluación** con respuestas
plegadas.

### Práctica (`EJEMPLO_QUERY_FORMS/`)

Demo Vite + TypeScript + React 19 contra **JSONPlaceholder**:

- `useQuery` lista de posts con loading/error/refetch y borrado.
- `useMutation` crear post + `invalidateQueries` de la lista.
- Formulario con **React Hook Form + Zod** (`zodResolver`), errores accesibles
  (`aria-invalid`, `aria-describedby`) y botón deshabilitado durante el envío.
- Tipos derivados del esquema (`z.infer`) compartidos por form y mutación.

```bash
cd EJEMPLO_QUERY_FORMS
pnpm install
pnpm run check   # tsc
pnpm lint
pnpm run build
pnpm dev         # http://localhost:5173
```

## Cómo estudiar

| Fase | Qué haces | Producto |
|------|-----------|----------|
| **1. Query (lectura)** | Lee las Unidades 01 y 02; corre la demo y observa `ListaPosts` (refetch, borrar). | Entiendes caché e invalidación sin tocar un store global. |
| **2. Forms (escritura)** | Lee las Unidades 03 y 04; escribe un esquema Zod propio y un form pequeño sin resolver. | Dominas `register`/`errors` y `z.infer`. |
| **3. Integración** | Lee la Unidad 05 y recorre `FormularioPost.tsx` + `usePosts.ts` del ejemplo. | Ves el patrón completo end-to-end. |
| **4. Proyecto** | Extiende el ejemplo: edición (PUT) de un post con precarga (`useQuery` + `reset(valores)`). | Mini-CRUD con el stack profesional. |

## Práctica mínima

1. `pnpm install && pnpm dev` en `EJEMPLO_QUERY_FORMS/` y abre el navegador.
2. Envía el formulario vacío: comprueba los mensajes de Zod vía RHF.
3. Crea un post válido: observa el spinner (`mut.isPending`), el toast de éxito
   y cómo la lista se invalida y refresca sola.
4. Borra un post de la lista y repite el mismo razonamiento con `useBorrarPost`.
5. Cambia un `min` del esquema (`schemas/post.ts`), guarda y verifica que el
   error del formulario cambia sin tocar el componente.
6. Responde las autoevaluaciones de las cinco unidades sin mirar.

## Mapa con el README

- [x] Por qué Query y no `useEffect`+estado para datos remotos
- [x] `useQuery`: estados, `queryKey`, `staleTime`, reintentos
- [x] `useMutation` + `invalidateQueries`
- [x] Actualización optimista (snippets en U02)
- [x] React Hook Form: register, handleSubmit, formState, Controller
- [x] Zod: esquemas, `z.infer`, `safeParse`, composición
- [x] Integración: `zodResolver` + mutación + invalidación de lista
- [x] Tipos compartidos de punta a punta (esquema → form → API)
- [ ] Proyecto: mini-CRUD (PUT con precarga) — *extensión del ejemplo*

## Relación con el resto del roadmap

| Módulo | Relación |
|--------|----------|
| M5 / M8 | Aquí se modernizan forms y data fetching de esos módulos |
| M9 | Query para servidor; Zustand/RTK siguen para estado de cliente |
| M10 | El ejemplo puede servir de base para tests de hooks con RTL |
| M16 | Las mismas librerías funcionan en React Native/Expo |
| M23 | El proyecto final puede adoptar este stack en su CRUD |

---

> 🧭 **Navegación:** [← Anterior: tema_023 — Preparación Profesional](../tema_023/README.md) · [Índice del curso](../GUIA_ESTUDIO.md) · [🏁 Índice general →](../README.md)
