# Módulo 12 — Diseño Profesional

Material del **Módulo 12** del roadmap (Tailwind, MUI, Chakra, shadcn/ui, CSS Modules, Styled Components).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Tailwind CSS](docs/Unidad_01_Tailwind_CSS.md) | Utilities, `clsx`, variants |
| [02 — Material UI](docs/Unidad_02_Material_UI.md) | Componentes MUI, ThemeProvider |
| [03 — Chakra UI](docs/Unidad_03_Chakra_UI.md) | Style props, accesibilidad |
| [04 — shadcn/ui](docs/Unidad_04_shadcn_ui.md) | Copy-paste components + Radix + Tailwind |
| [05 — CSS Modules y Styled](docs/Unidad_05_CSS_Modules_y_Styled.md) | Scope local vs CSS-in-JS |

### Práctica (`EJEMPLO_DISENO/`)

Vite + React + **Tailwind v4**:

- `ui/Button.jsx` — variantes con `clsx`
- `ui/Card.jsx` — composición
- Página que muestra utility classes + tokens de color

```bash
cd EJEMPLO_DISENO
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
```

## Mapa con el README

- [x] Tailwind CSS
- [x] Material UI (teoría + patrón de theming)
- [x] Chakra UI (teoría + style props)
- [x] shadcn/ui (teoría + patrón copy-to-your-repo)
- [x] CSS Modules
- [x] Styled Components (teoría)
- [ ] Proyecto: Sistema de componentes reutilizables — *pendiente* (base: `ui/` del ejemplo)
