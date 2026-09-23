# Ejemplo TS + React — Módulo 14

Proyecto de práctica del **Módulo 14 (TypeScript + React)**. Vite + React + TS.

## Comandos

```bash
pnpm install
pnpm run check   # tsc
pnpm lint
pnpm build       # tsc -b && vite build
pnpm dev
```

## Qué demuestra cada archivo

| Archivo | Concepto |
|---------|----------|
| `src/components/UsuarioCard.tsx` | Props tipadas, optional |
| `src/components/Formulario.tsx` | `FormEvent`, `ChangeEvent` |
| `src/components/CampoTexto.tsx` | `forwardRef` + props de DOM |
| `src/components/EstadoCarga.tsx` | Discriminated union en props |
| `src/hooks/useLocalStorage.ts` | Generic `T` |
| `src/state/contador.ts` | Actions tipadas del reducer |
| `src/lib/tema.ts` | `as const` + `satisfies` |

## Temario Módulo 14 — estado

- [x] Componentes / eventos / children / refs tipados
- [x] Hooks con generics y custom hooks tipados
- [x] Unions, guards, satisfies, errores comunes JSX+TS
- [ ] Proyecto: migrar EJEMPLO_REACT del M4 a TS
