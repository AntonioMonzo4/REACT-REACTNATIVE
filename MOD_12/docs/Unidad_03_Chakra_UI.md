# Unidad 03 — Chakra UI

## Objetivos

- Entender el concepto de **style props**: estilos como props de React.
- Instalar Chakra UI con sus dependencias (Emotion y framer-motion).
- Construir layouts con `Box`, `HStack` y componentes como `Button`.
- Personalizar tokens (color, espaciado, fuentes) con el theming de Chakra.
- Valorar la accesibilidad (foco, ARIA) que Chakra trae por defecto.
- Comparar con criterio Chakra vs MUI vs Tailwind usando la tabla de la unidad.

## Requisitos

- Haber leído la [Unidad 01 — Tailwind CSS](Unidad_01_Tailwind_CSS.md) y la [Unidad 02 — Material UI](Unidad_02_Material_UI.md) (para comparar).
- Saber qué es una prop en React y cómo se pasa un número (`p={4}`).
- Entender a grandes rasgos qué es ARIA / accesibilidad (no hace falta profundizar).
- Node.js + `pnpm`; app Vite de prueba para tocarlo en vivo.

## Qué es

Librería con **style props** accesibles: estilos como props de React, foco y ARIA cuidados.

**La idea en una frase:** en Chakra **el CSS se escribe dentro del JSX, pero como props de React**, no como string de clases ni como archivo aparte. Si sabes usar props, sabes estilizar Chakra.

**Analogía:** Tailwind te da palabras sueltas que escribes en `className`; Chakra te da las mismas palabras pero **en el lenguaje de props**: `p={4}` en vez de `p-4`, `bg="gray.50"` en vez de `bg-gray-50`. Además, los componentes Chakra traen bien resueltos el foco del teclado, los estados `:hover` y los atributos ARIA: cosas que en CSS puro a menudo se olvidan y fastidian a las personas que usan lectores de pantalla.

El "accesible por defecto" es su gran sello: un `Button` de Chakra ya viene con foco visible y semántica correcta; tú te concentras en la lógica.

```bash
pnpm add @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

| Paquete | Rol |
|---------|-----|
| `@chakra-ui/react` | componentes y sistema de estilos |
| `@emotion/react` + `@emotion/styled` | motor CSS-in-JS (igual que MUI) |
| `framer-motion` | animaciones/transiciones que Chakra usa internamente |

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

**Cómo leer estos ejemplos:**

- `HStack` apila en horizontal con `spacing={3}` (sistema de espaciado por *tokens*, no píxeles sueltos).
- `Button colorScheme="blue"` elige la paleta; `variant="outline"` el estilo. Mismo concepto de variantes que MUI.
- `Box` es el "div universal" de Chakra: con `as="section"` decides qué etiqueta HTML renderiza (aquí una `<section>`, buena para semántica/accessibility).
- Las props `p={4}`, `bg="gray.50"`, `borderRadius="md"` **son el CSS**: `p={4}` → padding del token 4, `gray.50` → color de la escala de grises, `md` → radio mediano del tema. Nota que `as`, `p`, `bg` y `borderRadius` no llegan al DOM como atributos extra: el sistema de Chakra los traduce a estilos.

## Theming

`extendTheme` / tokens de color, espaciado y fuentes; good defaults de contraste.

**Qué significa:** igual que `createTheme` en MUI, Chakra tiene su propio objeto de tema donde defines:

- **color:** tus colores de marca dentro de la escala (`brand.500`, etc.).
- **espaciado:** qué significan `spacing={1|3|4}` (normalmente múltiplos de 0.25rem).
- **fuentes:** la tipografía global.
- **radios, sombras, breakpoints...**

La ventaja de los **tokens** es la consistencia: nadie escribe `padding: 13px`; todos usan `p={4}` y el resultado es armónico en toda la app. Los *defaults* de contraste de Chakra ya vienen afinados (texto blanco sobre fondos oscuros, foco visible), lo que te ahorra dolores de cabeza de accesibilidad.

## Cuándo

- Equipos que quieren **rapidez + accesibilidad** sin escribir CSS.
- Style props encajan con composición React.

**Cuándo brilla:**

- *Rapidez + accesibilidad:* si tu equipo mueve rápido y no tiene a alguien de accesibilidad dedicada, Chakra te regala foco, ARIA y contraste razonables de serie.
- *Encaja con la composición:* los style props viven en los props, así que componer (`<Card>` que usa `<Box>`) se siente 100% "reactiano". No hay que cambiar de mentalidad entre "lógica en JSX" y "estilo en CSS file".
- Buen punto medio si dudas entre "librería de componentes" (MUI) y "utilities" (Tailwind): te da muebles *y* control granular por props.

## Costes

- Dependencias (emotion, motion).
- Menos “neutral” que Tailwind a largo plazo si el diseño es muy custom.

**Detalles de los costes:**

- *Dependencias:* arrastras Emotion y `framer-motion` aunque no uses animaciones. El bundle crece respecto a CSS puro o Tailwind. En apps muy ligeras se nota.
- *Menos neutral que Tailwind:* los componentes Chakra tienen "su punto" (sombras, radios, transiciones por defecto). Si el diseño es muy personal y se sale del sistema, acabas overrideando tokens o escribiendo CSS igual. Tailwind, al ser solo utilidades, no tiene una "cara" propia que rechazar.

## Chakra vs MUI vs Tailwind

| | Tailwind | MUI | Chakra |
|---|----------|-----|--------|
| Modelo | utilities | componentes Material | componentes + style props |
| Personalización | total | tema MUI | tema Chakra |
| Accesibilidad | manual | buena | muy buena por defecto |
| Velocidad inicial | alta con practice | muy alta | alta |

**Cómo usar esta tabla para decidir:**

- **Modelo:** ¿quieres ladrillos (Tailwind), muebles de catálogo (MUI) o muebles con perillas por props (Chakra)?
- **Personalización:** Tailwind es la más libre (todo es clases); MUI y Chakra pasan por su sistema de tema, muy potente pero con sus reglas.
- **Accesibilidad:** en Tailwind **tú** pones el foco, `aria-label`, los `:focus-visible`...; en Chakra vienen de serie (*muy buena por defecto*); MUI está en *buena*.
- **Velocidad inicial:** MUI y Chakra permiten pantallas completas muy rápido sin diseñar; Tailwind va *muy rápida* cuando ya dominas sus nombres (*alta con practice*).

## En el ejemplo

Comparativa en la página de “Prueba de estilo” del demo (clases utility vs componente).

En `EJEMPLO_DISENO`, la página de "Prueba de estilo" muestra justamente esta dualidad: a un lado estilos con **clases utility** (el modelo Tailwind) y al otro **componentes con props** (el modelo Chakra/MUI). Compáralos con el dev server corriendo: es la misma interfaz resuelta con dos filosofías. Recuerda que Chakra **no** está instalado en la demo (para no inflar el bundle); si quieres probarlo en serio, repite el patrón de esta unidad en una app Vite aparte.

## Errores comunes

**Error 1: Pasar números como píxeles crudos sin usar tokens.**

```jsx
// ❌ Mal: 13px aparece una vez, nunca más igual
<Box p="13px" />

// ✅ Bien: token de espaciado, consistente en toda la app
<Box p={4} />
```

**Solución:** usa la escala numérica (`p={2|3|4...}`) y define el significado en el tema. Si necesitas un valor especial, que salga de un token (`space.special`), no de un número mágico suelto.

**Error 2: Escribir CSS global de Chakra con selectores crudos.**

```css
/* ❌ Mal: pierdes el theming y la mantenibilidad */
section p { color: red !important; }
```

```jsx
// ✅ Bien: style props o props de sistema en el componente
<Box as="section" color="red.500">...</Box>
```

**Solución:** estiliza desde las props del propio componente (o con `sx` puntual). Así el estilo viaja con el componente y respeta los tokens.

**Error 3: Pensar que `as="button"` convierte un `Box` en un botón accesible de verdad.**

```jsx
// ⚠️ A medias: renderiza la etiqueta, pero...
<Box as="button">Hola</Box>
```

**Solución:** para controles reales usa los componentes semánticos de Chakra (`<Button>`, `<Link>`, `<Input>`), que traen foco, teclado y ARIA correctos. `as` es para etiquetas neutras (`div`→`section`), no para saltarte la accesibilidad.

## Conceptos clave

- **Style props:** estilos declarados como props de React (`p`, `bg`, `borderRadius`).
- **`Box`:** contenedor universal; `as` cambia la etiqueta HTML semántica.
- **`HStack` / `VStack`:** apilados horizontales/verticales con `spacing`.
- **`colorScheme` + `variant`:** paleta y estilo del componente.
- **`extendTheme` / tokens:** espaciado, color y tipografía centralizados.
- **Accesibilidad por defecto:** foco visible, ARIA y contraste ya resueltos.
- **Dependencias:** Emotion y framer-motion incluidas.
- **Coste:** menos neutral que Tailwind en diseños muy personalizados.

## Autoevaluación

**1. ¿Qué son los "style props"?**

<details>
<summary>Respuesta</summary>

Props de React que representan estilos: `p={4}`, `bg="gray.50"`, `borderRadius="md"` se traducen internamente a CSS. Estilizas en el "idioma de props" en vez de crear clases en un archivo CSS aparte.

</details>

**2. ¿Qué gana Chakra en accesibilidad respecto a Tailwind?**

<details>
<summary>Respuesta</summary>

Que trae foco visible, estados de interacción y atributos ARIA ya resueltos en sus componentes ("muy buena por defecto"). Con Tailwind todo eso lo diseñas y acuerdas tú manualmente.

</details>

**3. Mi diseño es muy personal, casi del pixel. ¿Tailwind o Chakra?**

<details>
<summary>Respuesta</summary>

Probablemente **Tailwind** (o CSS Modules): su modelo de utilidades no impone una "cara" de librería que tengas que deshacer. Chakra/MUI brillan cuando aceptas su sistema; si peleas contra él en cada componente, te conviene un modelo más neutro.

</details>

**4. ¿Por qué no debo escribir `p="13px"`?**

<details>
<summary>Respuesta</summary>

Porque rompe los tokens: introduces un valor mágico que no está en la escala, no es reutilizable y no se ajusta al tema. Usa la escala numérica (`p={4}`) o crea un token si de verdad necesitas un valor especial.

</details>
