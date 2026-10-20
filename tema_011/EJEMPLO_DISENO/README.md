# Ejemplo Diseño — Módulo 12

Proyecto de práctica del **Módulo 12 (Diseño Profesional)**. Vite + React + **Tailwind CSS v4**.

Esta demo es tu **laboratorio de estilos**: una app mínima donde ver el modelo *utility-first* en acción (variantes con `clsx`, composición de tarjetas, tokens de color y un knob de tema). Todo lo demás del módulo (MUI, Chakra, shadcn) es teoría con su unidad correspondiente en [`../docs/`](../docs/), para no inflar el bundle de esta muestra.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

| Comandos | Qué hace |
|----------|----------|
| `pnpm install` | instala dependencias (primera ejecución) |
| `pnpm dev` | servidor de desarrollo con hot reload para tocar estilos en vivo |
| `pnpm lint` | ESLint: que tu JSX no tenga errores tontos |
| `pnpm build` | bundle de producción en `dist/` |

> Truco de estudio: deja `pnpm dev` corriendo en una pestaña y el código en otra. Cambia una utility class, guarda, y observa el cambio al instante. Esa es la forma más rápida de interiorizar Tailwind.

## Qué demuestra

| Archivo | Concepto |
|---------|----------|
| `src/ui/Button.jsx` | Variantes con `clsx` sobre utilities Tailwind |
| `src/ui/Card.jsx` | Composición de tarjeta reutilizable |
| `src/ui/Badge.jsx` | Talla/color como props → clases |
| `src/App.jsx` | Página con tokens de color y knob de tema |

> MUI, Chakra y shadcn/ui: ver teoría en [`../docs/`](../docs/) (no se instalan en la demo para no inflar el bundle).

**Leyendo la tabla con detalle:**

- `src/ui/Button.jsx` → el patrón **DRY** de la Unidad 01: clases base combinadas con `clsx` según `variant`/`size`. Este archivo es la "plantilla" de la que partirá tu proyecto del final del módulo.
- `src/ui/Card.jsx` → composición: la tarjeta no sabe qué hay dentro; recibe `children` (y quizá un `className` extra). Principio de caja neutra reutilizable.
- `src/ui/Badge.jsx` → traducción de **props a clases**: `size="sm"` y `color="emerald"` se mapean a utilidades Tailwind concretas. Mira cómo `clsx` o un objeto de maps evita el `if` enrevesado.
- `src/App.jsx` → la página que lo ensambla y muestra la **paleta de tokens** (`bg-blue-600`, `text-emerald-700`...) más el **knob de tema** (un control que alterna claro/oscuro para ver cómo reacciona el diseño).

> Recordatorio: el README del módulo documenta el patrón `ThemeProvider` de MUI; aquí no se instala MUI para mantener la demo ligera.

## Qué practica este ejemplo

Antes de navagar a ciegas, ten claro qué habilidad entrena cada rincón:

- **Componer con `clsx`:** ver en `Button.jsx` cómo se suman clases base + variantes + lo que pase el padre, sin repetir cadenas mágicas.
- **Mapear props → estilo:** en `Badge.jsx`, practicar el patrón "la prop decide la clase", la base de cualquier sistema de variantes (`cva` incluido).
- **Composición de componentes:** en `Card.jsx`, entender el patrón `children` + `className` extensible (composición al estilo Módulo 11).
- **Leer una paleta de tokens:** en `App.jsx`, recorrer los swatches de color y relacionarlos con las escalas `blue-*`, `emerald-*`... de Tailwind.
- **Flujo de trabajo real:** `pnpm dev` (editar) → `pnpm lint` (limpiar) → `pnpm build` (verificar) — el mismo ciclo que usarás en cualquier proyecto profesional.

## Cómo recorrerlo

Orden recomendado: **observa → rompe → repara → extiende**. No leas todo seguido; alterna lectura y edición con el dev server abierto.

1. **Arranca:** `pnpm install` y `pnpm dev`. Abre la URL y pulsa el knob de tema para ver la página en claro y oscuro.
2. **Inspecciona el DOM:** con las DevTools, selecciona un `<button>` y mira sus clases reales en el panel de Elements. Relaciónalas con las líneas de `src/ui/Button.jsx`.
3. **Sigue la cadena de variantes:** abre `Button.jsx` y busca dónde se traducen `variant="primary"` y `size="sm"` a utilidades Tailwind. Haz lo mismo con `Badge.jsx`.
4. **Composición:** abre `Card.jsx` y fíjate en el `className` que acepta y en cómo recibe `children`. Usa una `Card` nueva dentro de `App.jsx` para verla renderizada.
5. **Rompe a propósito:** en `Button.jsx`, borra `clsx` y concatenación a mano mal (o duplica `px-4 px-8`) para **ver** el problema de duplicados; luego repáralo (pista: `tailwind-merge`, Unidad 01).
6. **Añade tu variante:** crea `variant="ghost"` en el mapeo de `Button` y úsalo en la página. Ejecuta `pnpm lint` y corrige lo que señale.
7. **Cierra el ciclo:** `pnpm build` debe pasar sin errores antes de pasar a la siguiente unidad o de embarcarte en el proyecto final del módulo (sistema de componentes reutilizables, base: esta carpeta `ui/`).

> Regla del laboratorio: si la cosa se rompe fea, deshaz el cambio (`git checkout .` o Ctrl+Z múltiple) y vuelve a intentarlo. El objetivo es entender el sistema de estilos, no atesorar un estado roto.

## Temario Módulo 12 — estado

- [x] Tailwind CSS
- [x] Material UI (teoría)
- [x] Chakra UI (teoría)
- [x] shadcn/ui (teoría)
- [x] CSS Modules (teoría + nota en docs)
- [x] Styled Components (teoría)
- [ ] Proyecto Sistema de componentes reutilizables
