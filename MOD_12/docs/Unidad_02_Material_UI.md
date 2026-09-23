# Unidad 02 — Material UI (MUI)

## Qué es

Librería de componentes con **Design System de Google Material**: botones, drawers, data grid…

```bash
pnpm add @mui/material @emotion/react @emotion/styled @mui/icons-material
```

```jsx
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

export function Acciones() {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="contained">Guardar</Button>
      <Button variant="outlined">Cancelar</Button>
    </Stack>
  )
}
```

## Theming

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: { primary: { main: '#3b5bdb' } },
  typography: { fontFamily: 'Inter, sans-serif' },
})

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## Cuándo

- Backoffice / dashboards rápidos con consistencia.
- Necesitas componentes densos (DataGrid, DatePicker) sin construirlos.

## Costes

- Bundle grande (importa desde `@mui/material/X` o tree-shake).
- Estética “MUI” reconocible; personalizar a fondo cuesta.
- Emotion en runtime (o `@mui/material/styles` static).

## En el ejemplo

Nota de uso (el ejemplo no instala MUI para mantener el bundle de demo ligero); patrón de ThemeProvider documentado en el README del módulo.
