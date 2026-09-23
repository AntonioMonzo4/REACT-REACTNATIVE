# Unidad 05 — CSS Modules y Styled Components

## CSS Modules

Archivos `Component.module.css`; los nombres de clase se **hashean** y se importan como objeto:

```css
/* Button.module.css */
.button {
  border-radius: 6px;
  padding: 0.5rem 1rem;
}
.primary {
  background: #3b5bdb;
  color: #fff;
}
```

```jsx
import styles from './Button.module.css'

export function Button({ primary, children }) {
  const cls = primary ? `${styles.button} ${styles.primary}` : styles.button
  return <button className={cls}>{children}</button>
}
```

- Soporte nativo de Vite/webpack, **0 runtime**.
- Scoping local sin metodología BEM.

## Styled Components (CSS-in-JS)

```bash
pnpm add styled-components
```

```jsx
import styled from 'styled-components'

const Boton = styled.button`
  border-radius: 6px;
  padding: 0.5rem 1rem;
  background: ${(p) => (p.$primary ? '#3b5bdb' : 'transparent')};
  color: ${(p) => (p.$primary ? '#fff' : '#3b5bdb')};
`

export function Button({ primary, children }) {
  return <Boton $primary={primary}>{children}</Boton>
}
```

- Props → estilos dinámicos, theming con `ThemeProvider`.
- Runtime cost y SSR considerations.

## Comparativa

| | CSS Modules | Styled Components | Tailwind |
|---|-------------|-------------------|----------|
| Runtime | no | sí | no |
| Dinámico por props | media | alta | media (variants) |
| Scope | automático | automático | utilities |

## Errores comunes

- Styled-components: props DOM filtradas → usa prefijo `$` o `shouldForwardProp`.
- Modules: confiar en orden de especificidad global olvidando cascade externa.

## En el ejemplo

`ui/Button.module.css` + variante “styled” con CSS-in-JS minimalista sin dependencia (template literals → className fija) documentada; para producción se instalaría `styled-components`.
