# Unidad 01 — WCAG (resumen práctico)

## Los 4 principios (POUR)

| Principio | En React ejemplos |
|-----------|-------------------|
| **P**ercibible | contraste ≥ 4.5:1, `alt` en imágenes, subtítulos |
| **O**perable | teclado, foco visible, sin traps, objetivos ≥ 24px |
| **U**nderstandable | labels claros, errores anunciados, idioma `lang` |
| **R**obust | HTML semántico, ARIA solo si no hay nativo |

## Niveles

- **A** → mínimo legal en muchos sitios
- **AA** → estándar objetivo (contraste, focus, etc.)
- AAA → estricto (caso a caso)

## Checklist rápido en una pantalla

- [ ] Todo interactuable con **Tab** y **Enter/Espacio**
- [ ] `:focus-visible` con anillo claro
- [ ] Sin `outline: none` sin sustituto
- [ ] Labels visibles o `aria-label` en icon-buttons
- [ ] Errores de form: `aria-invalid` + `aria-describedby` + `role="alert"`
- [ ] Contraste AA (DevTools → contraste de color)
- [ ] Zoom 200 % sin scroll horizontal raro
