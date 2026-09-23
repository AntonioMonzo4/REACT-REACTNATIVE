# Unidad 03 — Chakra UI

## Qué es

Librería con **style props** accesibles: estilos como props de React, foco y ARIA cuidados.

```bash
pnpm add @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

```jsx
import { Button, Box, HStack } from '@chakra-ui/react'

export function Acciones() {
  return (
    <HStack spacing={3}>
      <Button colorScheme="blue">Guardar</Button>
      <Button variant="outline">Cancelar</Button>
    </HStack>
  )
}
```

```jsx
<Box as="section" p={4} bg="gray.50" borderRadius="md">
  Contenido
</Box>
```

## Theming

`extendTheme` / tokens de color, espaciado y fuentes; good defaults de contraste.

## Cuándo

- Equipos que quieren **rapidez + accesibilidad** sin escribir CSS.
- Style props encajan con composición React.

## Costes

- Dependencias (emotion, motion).
- Menos “neutral” que Tailwind a largo plazo si el diseño es muy custom.

## Chakra vs MUI vs Tailwind

| | Tailwind | MUI | Chakra |
|---|----------|-----|--------|
| Modelo | utilities | componentes Material | componentes + style props |
| Personalización | total | tema MUI | tema Chakra |
| Accesibilidad | manual | buena | muy buena por defecto |
| Velocidad inicial | alta con practice | muy alta | alta |

## En el ejemplo

Comparativa en la página de “Prueba de estilo” del demo (clases utility vs componente).
