# Módulo 21 — Accesibilidad

Material del **Módulo 21** del roadmap.

La accesibilidad (*a11y*) es la práctica de que **cualquier persona** pueda usar tu app: con teclado, con lector de pantalla, con baja visión o con el motor de búsqueda de una red social. Este módulo te enseña a construir interfaces accesibles en React desde cero, sin jerga innecesaria.

## Para quién es este módulo

Dirigido a quien ya sabe maquetar y dar interacción con React (recorrido **M4–M15**) pero nunca ha navegado una web **solo con teclado**, no ha abierto el árbol de accesibilidad de DevTools o escribe `div onClick` sin saber por qué es un problema. **No necesitas experiencia previa en a11y ni conocer ARIA**: empezamos por los principios (WCAG) y acabamos probando con NVDA/VoiceOver paso a paso.

Al terminar el módulo podrás: explicar los 4 principios POUR y los niveles A/AA, auditar una pantalla con una checklist, hacer que un modal atrape y suelte el foco correctamente, y anunciar errores de formulario con ARIA sin romper los lectores de pantalla.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — WCAG](docs/Unidad_01_WCAG.md) | POUR, niveles, checklist |
| [02 — Teclado](docs/Unidad_02_Teclado.md) | Tab, skip link, focus trap |
| [03 — Screen readers](docs/Unidad_03_Screen_Readers.md) | ARIA, live regions, forms |

## Cómo estudiar

| Fase | Qué hacer | Resultado esperado |
|------|-----------|--------------------|
| 1 — Leer | Lee las tres unidades en orden (POUR → teclado → screen readers) | Entiendes los 4 principios y la regla de oro de ARIA |
| 2 — Probar | Abre un ejemplo **solo con teclado** (Tab, Shift+Tab, Enter, Espacio, flechas, Esc) | Has encontrado al menos una cosa inaccesible en tu ejemplo |
| 3 — Arreglar | Aplica la **Práctica mínima** (skip link, `focus-visible`, `div onClick` → `<button>`, `role="alert"`) | Tu ejemplo pasa la checklist de la Unidad 01 |
| 4 — Auditar | Comprueba con DevTools → Accessibility y, opcional, `eslint-plugin-jsx-a11y` + un screen reader | Tienes una auditoría a11y documentada |

## Práctica mínima

Si solo tienes 30 minutos, haz exactamente esto:

1. Navega un ejemplo **sin tocar el ratón**: solo Tab + Enter/Espacio.
2. Añade un *skip link* y un anillo `:focus-visible` en el CSS global.
3. Convierte un `div onClick` en `<button>`.
4. Añade `role="alert"` a un error de formulario y compruébalo en DevTools → Accessibility.

## Práctica

1. Abre cualquier ejemplo (`MOD_4/EJEMPLO_REACT`, `MOD_12/EJEMPLO_DISENO`) con **solo teclado**: Tab + Enter/Espacio.
2. Añade un skip link y `focus-visible` en el global CSS.
3. Convierte un `div onClick` en `<button>`.
4. Añade `role="alert"` a un error de formulario y comprueba con DevTools → Accessibility.
5. (Opcional) Instala `eslint-plugin-jsx-a11y` y limpia warnings.

## Mapa con el README

- [x] WCAG
- [x] Navegación por teclado
- [x] Screen Readers
- [ ] Auditoría a11y en un ejemplo — *pendiente*
