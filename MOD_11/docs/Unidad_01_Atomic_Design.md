# Unidad 01 — Atomic Design

## Origen

Brad Frost: componer UI como un **sistema** → de lo atómico a lo concreto.

| Nivel | Qué es | Ejemplo |
|-------|--------|---------|
| **Atoms** | primitivas sin lógica de negocio | botón, input, badge, label |
| **Molecules** | combinación de atoms con un rol | campo de búsqueda (input + botón), card de producto |
| **Organisms** | bloques completos | navbar, formulario de login, tabla de listado |
| **Templates / Pages** | layout y página con datos reales | `/productos` con filtros y lista |

## Por qué en React

- Reutilizabilidad: un `Button` atom se usa en 20 molecules.
- Testing: atoms casi gratuitos; organisms con RTL.
- Design tokens (color/espaciado) viven en atoms/CSS, no dispersos.

## Estructura de carpetas ejemplo

```
src/
  components/
    atoms/     Button.jsx, Badge.jsx
    molecules/ SearchBar.jsx, ProductCard.jsx
    organisms/ Navbar.jsx, ProductGrid.jsx
    templates/ MainLayout.jsx
  pages/       ProductosPage.jsx
```

## Reglas prácticas

1. **No over-engineer**: si una “molecule” solo existe en un sitio, puede vivir en `features/`.
2. Los atoms **no** importan molecules/organisms (dependencias hacia abajo).
3. Naming por dominio (`CartLine`) a veces gana a naming atómico estricto.

## Errores comunes

- Átomos con props infinitas (terminas con un `Button` de 30 flags).
- Copiar nivel de carpetas sin extraer componentes reales.

## En el ejemplo

`EJEMPLO_ARQUITECTURA`: atoms (`Button`, `Badge`), molecule (`SearchBar`), organism (`Header`), page.
