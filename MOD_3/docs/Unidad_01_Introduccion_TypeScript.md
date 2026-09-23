# Unidad 01 — Introducción a TypeScript

TypeScript es un lenguaje de programación **sobre JavaScript**: añade tipos estáticos opcionales que se eliminan al compilar a JS.

## Beneficios

- **Tipado estático**: errores en tiempo de compilación, no en runtime.
- **Mejor refactor**: el compilador marca dónde falta actualizar.
- **Autocompletado / IDE**: los tipos alimentan IntelliSense.

## Desventajas

- **Compilador extra**: hay que pasar por `tsc` (o Vite/SWC lo hace por ti).
- **Disciplina**: hay que escribir y mantener los tipos.

## Instalación

```bash
pnpm add -D typescript
# o npm i -D typescript
```

Si el proyecto es con React + Vite, TypeScript suele venir ya configurado.

## Ejecutar y configurar

```bash
pnpm tsc index.ts     # compilar un archivo
tsc --init            # generar tsconfig.json
pnpm run check        # tsc --noEmit (solo validar)
pnpm run build        # tsc → dist/
```

`tsconfig.json` clave de `hello-world/`:

| Opción | Efecto |
|--------|--------|
| `strict: true` | Activa el chequeo estricto (recomendado) |
| `rootDir` / `outDir` | `src/` → `dist/` |
| `noEmit` (script check) | Valida sin escribir JS |
| `sourceMap` / `declaration` | Depuración y `.d.ts` |

## Archivos

- `.ts` → JavaScript con tipos.
- `.tsx` → lo mismo + JSX (aquí `<string>input` **no** vale; usa `as`).

## En el ejemplo

Práctica en [`../hello-world/`](../hello-world/): `src/index.ts` y `src/fundamentals.ts`.
