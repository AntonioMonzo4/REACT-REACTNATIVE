# Módulo 3 — TypeScript

Material del **Módulo 3** del roadmap (tipado estático sobre JavaScript).

## Para quién es este módulo

**Alumnos que empiezan de cero.** No hace falta haber tocado TypeScript antes.  
Solo necesitas haber completado los módulos previos del roadmap (o conocer lo básico de JavaScript) y tener `pnpm` disponible en la terminal.

## Cómo estudiar (orden recomendado)

Sigue las unidades **en orden**: cada una usa ideas de la anterior.

| Fase | Unidades | Qué saldrás sabiendo |
|------|----------|----------------------|
| **1. Fundamentos** | 01 → 02 | Qué es TypeScript, `tsc`, `tsconfig` y los tipos básicos (primitivos, arrays, unions, `unknown`/`never`) |
| **2. Estructuras** | 03 → 05 | Interfaces, Type Alias, enums, literales y cómo tipar funciones y clases |
| **3. Avanzado** | 06 → 08 | Generics, Utility y Mapped Types, Conditional Types e `infer` |
| **4. Práctica** | `hello-world/` | Instalar, comprobar (`pnpm run check`) y compilar (`pnpm run build`) el proyecto mínimo, más autoevaluaciones de cada unidad |

> **Consejo:** tras cada unidad, responde a los “Conceptos clave” y a los ejercicios/autoevaluación sin mirar. Si fallas, relee solo esa sección.

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Introducción](docs/Unidad_01_Introduccion_TypeScript.md) | Qué es, pros/contras, `tsc`, `tsconfig` |
| [02 — Tipos básicos](docs/Unidad_02_Tipos_basicos.md) | Primitivos, arrays, tuples, unions, `unknown`/`never` |
| [03 — Interfaces y Type Alias](docs/Unidad_03_Interfaces_y_Type_Alias.md) | Objetos, merging, intersecciones |
| [04 — Enums y literales](docs/Unidad_04_Enums_y_literales.md) | Enums, literal types, `as const` |
| [05 — Funciones y clases](docs/Unidad_05_Funciones_y_clases.md) | Function types, clases, parameter properties |
| [06 — Generics](docs/Unidad_06_Generics.md) | `T`, `ApiResponse<T>`, restricciones |
| [07 — Utility y Mapped Types](docs/Unidad_07_Utility_y_Mapped_Types.md) | `Partial`, `Pick`, `Record`, `[K in keyof T]` |
| [08 — Conditional Types e Infer](docs/Unidad_08_Conditional_Types_e_Infer.md) | `extends ? :`, `infer`, `keyof`, `T[K]` |

## Práctica mínima del módulo

Proyecto mínimo de TypeScript (`src/index.ts` + `src/fundamentals.ts`):

```bash
cd hello-world
pnpm install
pnpm run check   # tsc --noEmit
pnpm run build   # tsc → dist/
```

## Mapa con el README

- [x] Tipos (primitivos, arrays, unions, `unknown`/`never`)
- [x] Interfaces (merging, index signatures)
- [x] Type Alias e intersecciones
- [x] Enums, literales, `as const`
- [x] Generics (clases, `ApiResponse<T>`)
- [x] Utility Types (`Partial`, `Pick`, `Omit`, `Record`…)
- [x] Mapped Types (`keyof`, `[K in keyof T]`)
- [x] Conditional Types e `infer`
- [x] Buenas prácticas (`strict`, `unknown` vs `any`)
- [x] Instalación + `tsc` + proyecto `hello-world`
- [ ] Proyecto: migrar una app JS a TypeScript — *pendiente*
- [ ] TypeScript + React (M14) — *pendiente*
