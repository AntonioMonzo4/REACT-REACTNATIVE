# Unidad 04 — Zod: validación con esquemas
> 🧭 **Navegación:** [← Anterior: Unidad 03 — React Hook Form](Unidad_03_React_Hook_Form.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 05 — Integración: RHF + Zod + TanStack Query →](Unidad_05_Integracion_RHF_Zod_y_Query.md)

## Objetivos

Al terminar esta unidad podrás:

- Definir esquemas de datos con `z.object`, tipos primitivos y transforms.
- Derivar tipos TypeScript desde el esquema (`z.infer`) — una sola fuente de verdad.
- Validar datos fuera de React (API, tests, scripts) con `schema.parse` / `safeParse`.
- Explicar por qué el backend y el frontend deben validar, y qué gana el front con Zod.

## Requisitos

- TypeScript básico del camino (M3): interfaces, literales, utility types.
- [Unidad 03](Unidad_03_React_Hook_Form.md) leída (la integración RHF+Zod va en la 05).

## ¿Qué es Zod?

Zod es una librería de **validación y parsing de esquemas** en TypeScript, sin
dependencias. Defines una única descripción de tus datos y obtienes:

1. Validación en runtime (mensajes de error, defaults, transforms).
2. **Tipos estáticos** derivados con `z.infer` — se acaba el doble maintenance
   de "la interface y el schema que a veces no coinciden".

Es el estándar de facto junto a RHF en el ecosistema React moderno (y el
validador por defecto de muchísimos starters). Alternativas: Yup, Valibot,
ArkType; los conceptos son transferibles.

## Instalación y primer esquema

```bash
pnpm add zod
```

```ts
// src/schemas/post.ts
import { z } from 'zod'

export const esquemaPost = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(80, 'El título no puede superar los 80 caracteres'),
  body: z
    .string()
    .trim()
    .min(10, 'El contenido debe tener al menos 10 caracteres')
    .max(500, 'El contenido no puede superar los 500 caracteres'),
})

export type DatosPost = z.infer<typeof esquemaPost>
```

`DatosPost` es `{ title: string; body: string }`: si mañana añades un campo al
esquema, el tipo sigue al esquema automáticamente.

## Validar fuera de React

```ts
const resultado = esquemaPost.safeParse({ title: 'Hola', body: '' })

if (!resultado.success) {
  console.log(resultado.error.issues)
  // [{ path: ['body'], message: 'El contenido debe tener al menos 10 caracteres' }, …]
} else {
  console.log(resultado.data) // tipado como DatosPost, ya "parseado"
}
```

- `parse` lanza si falla (útil si el error debe romper el flujo).
- `safeParse` devuelve `{ success, data | error }` (útil en handlers y APIs).
- El **path** del issue te dice qué campo falló: la base para mapear errores a
  RHF o a un backend 422.

## Tipos de esquemas útiles

```ts
z.string().email().min(3)
z.number().int().positive()
z.boolean()
z.enum(['herramientas', 'accesorios'])     // literales unidos
z.literal('premium')
z.array(z.string()).min(1)
z.union([z.string(), z.number()])          // | en tipos
z.nullable()                               // T | null
z.optional()                               // T | undefined
z.object({ nested: z.object({}) }).strict() // prohíbe claves extra

// Defaults y transforms
z.string().default('anonimo')
z.string().transform((s) => s.toLowerCase())
z.coerce.number()                          // convierte "12" → 12 (con cuidado)

// Recursivo / relacional (por ejemplo, categoría que referencia otra)
const Categoria = z.object({ id: z.number() })
const Producto = z.object({
  categoriaId: z.number(),
  categoria: Categoria.optional(),
})
```

## Reutilización y composición

Los esquemas se componen como tipos:

```ts
const esquemaDireccion = z.object({
  calle: z.string().min(3),
  cp: z.string().regex(/^\d{5}$/),
})

const esquemaPedido = z.object({
  cliente: z.object({ email: z.string().email() }),
  direccion: esquemaDireccion,
  lineas: z.array(z.object({ sku: z.string(), cantidad: z.number().int().min(1) })),
})
```

Para "extender" un objeto: `esquemaBase.extend({ extra: z.string() })`. Para
hacer opcional todo: `esquemaBase.partial()`. Para extraer solo campos:
`esquemaBase.pick({ title: true })`.

## Una fuente de verdad, dos mundos

| Lugar | Cómo usa Zod |
|-------|----------------|
| Formularios (con RHF) | `zodResolver(esquema)` — Unidad 05 |
| Frontend antes de enviar | `safeParse` en acciones/Server Actions |
| Backend (Node/FastAPI con pydantic, o tRPC) | El mismo esquema (o un espejo) valida de nuevo |
| Tests | Assert de fixtures: `expect(esquema.safeParse(fixture).success).toBe(true)` |
| Datos externos (localStorage, query params) | Parse antes de confiar |

**El cliente valida para UX; el servidor valida de verdad.** Zod en el front
evita viajes inútiles y mejora los mensajes; nunca sustituye la validación del
backend.

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| `data` tipado pero "sucio" en runtime | Confiaste en el tipo sin parsear | Haz `safeParse` cuando el dato viene de fuera (API, storage) |
| `.trim()` no recorta en el tipo | `transform` afecta al valor parseado, no al tipo estático | Correcto: el tipo sigue siendo `string`; el valor parseado ya viene recortado |
| Errores de "clave extra" al validar | `.strict()` y el backend manda más campos | Usa `.passthrough()` o `.loose()` si necesitas ignorar extras |
| Enum de TS y `z.enum` desincronizados | Dos fuentes de verdad | Deriva el tipo del esquema: `type Cat = z.infer<typeof EsquemaCat>` |
| Zod 3 vs 4 con RHF | APIs de issues cambiaron ligeramente | Usa `@hookform/resolvers` actualizado (v6+ soporta Zod 4) |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **Zod** | Librería de validación/parsing de esquemas con tipos derivados |
| **`z.infer`** | Extrae el tipo TS de un esquema (fuente única de verdad) |
| **`safeParse`** | Valida sin lanzar; devuelve `{ success, data, error }` |
| **`issue`** | Error de validación: `path` + `message` |
| **Transform** | Transforma el valor al validarlo (trim, coerce, lowercase…) |
| **Composición** | Esquemas reutilizables (`extend`, `pick`, arrays, objetos anidados) |

## Autoevaluación

**1. ¿Qué gano usando `z.infer` en vez de escribir la interface a mano?**

<details>
<summary>Respuesta</summary>

Una sola fuente de verdad: si cambia el esquema, el tipo cambia con él. Se
elimina la deriva entre "lo que valida el runtime" y "lo que cree el compilador".

</details>

**2. Frontend valida con Zod, ¿el backend ya no necesita validar?**

<details>
<summary>Respuesta</summary>

El backend **siempre** debe validar. El cliente puede mentir (curl, JS
modificado, bots). Zod en el front es para UX (errores rápidos, sin viaje de
red); la seguridad y la integridad de datos son responsabilidad del servidor.

</details>

**3. `safeParse` vs `parse`: ¿cuál uso en un `onSubmit`?**

<details>
<summary>Respuesta</summary>

Con RHF+`zodResolver`, RHF ya llama al validador y tú recibes `data` validado:
no necesitas `parse` manual en el submit. Fuera de RHF (acciones, loaders),
`safeParse` es preferible para manejar `issues` sin try/catch.

</details>

**4. Mi API devuelve `{ id, title, body, extra }` y mi esquema no tiene `extra`. ¿Qué pasa?**

<details>
<summary>Respuesta</summary>

Por defecto `z.object` **quita** claves no declaradas en el resultado parseado
(no falla). Con `.strict()` fallaría. Con `.passthrough()`/`.loose()` mantiene
las claves extra en el resultado.

</details>

**5. ¿Cómo valido una lista de productos con categorías restringidas?**

<details>
<summary>Respuesta</summary>

```ts
z.object({
  categoria: z.enum(['herramientas', 'accesorios']),
  cantidad: z.number().int().min(1),
})
```

`z.enum` cierra el conjunto de valores válidos y en TS te da la unión de
literales derivada automáticamente.

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 03 — React Hook Form](Unidad_03_React_Hook_Form.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 05 — Integración: RHF + Zod + TanStack Query →](Unidad_05_Integracion_RHF_Zod_y_Query.md)
