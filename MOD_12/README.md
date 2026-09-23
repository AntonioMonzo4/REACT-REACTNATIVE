# Módulo 12 — Diseño Profesional

Material del **Módulo 12** del roadmap (Tailwind, MUI, Chakra, shadcn/ui, CSS Modules, Styled Components).

Hasta ahora tu CSS probablemente ha sido "lo que sea que funcione": un `style.css` gigante, clases con nombres raros y reglas que pisan a otras. Este módulo te enseña las **cinco formas serias** en que los equipos reales estilan interfaces en React, sus pros y sus contras, y cómo elegir una sin morir en el intento.

La pregunta de fondo no es "¿cuál es la mejor?" (no lo hay), sino **"¿cuál encaja con mi proyecto, mi equipo y mi nivel?"**. Al terminar sabrás defender una elección en una entrevista o en una reunión de equipo.

## Para quién es este módulo

- Ya creaste al menos una app React y escribiste algo de CSS que te dolió (específicidad, !important, clases que rompían otras pantallas).
- Quieres que tu UI se vea profesional sin ser diseñador gráfico.
- Te interesa saber qué se usa en ofertas de trabajo: Tailwind, MUI, shadcn...
- Quieres entender las diferencias reales entre utility-first, librerías de componentes y CSS puro.
- **No** necesitas dominar CSS avanzado ni SASS: vamos de cero, con analogías y ejemplos mínimos.

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

## Cómo estudiar

El diseño se aprende **mirando y tocando**, no solo leyendo. Sigue las cuatro fases en orden; cada una apoya a la siguiente.

| Fase | Qué haces | Cuánto |
|------|-----------|--------|
| **1. Leer** | Lee la unidad en `docs/` y fíjate en los "+" y "−" de cada tecnología | 20-30 min por unidad |
| **2. Observar** | Arranca `EJEMPLO_DISENO` y cambia clases Tailwind en vivo para ver el efecto | 20 min |
| **3. Practicar** | Añade tu propio componente en `src/ui/` con `clsx` y variantes | 30-45 min |
| **4. Verificar** | `pnpm lint` + responde la autoevaluación de la unidad | 15 min |

> Consejo: instala una librería (MUI o Chakra) **solo cuando toque esa unidad**, en una app de prueba aparte. Así el bundle de la demo se mantiene ligero y tú sientes el "peso real" de cada opción.

## Práctica mínima

Lo mínimo que debes hacer antes de pasar de módulo:

```bash
cd EJEMPLO_DISENO
pnpm install
pnpm dev
```

- [ ] Abrir `src/ui/Button.jsx` y explicar qué hace `clsx`.
- [ ] Cambiar una utility class (`bg-blue-600` → `bg-emerald-600`) y verlo en el navegador.
- [ ] Añadir una variante nueva a `Button` (por ejemplo `variant="ghost"`).
- [ ] Explicar con tus palabras la diferencia entre "utility-first" (Tailwind) y "librería de componentes" (MUI).
- [ ] Ejecutar `pnpm lint` y `pnpm build` sin errores.

## Mapa con el README

- [x] Tailwind CSS
- [x] Material UI (teoría + patrón de theming)
- [x] Chakra UI (teoría + style props)
- [x] shadcn/ui (teoría + patrón copy-to-your-repo)
- [x] CSS Modules
- [x] Styled Components (teoría)
- [ ] Proyecto: Sistema de componentes reutilizables — *pendiente* (base: `ui/` del ejemplo)
