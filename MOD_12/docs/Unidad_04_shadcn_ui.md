# Unidad 04 — shadcn/ui

## Objetivos

- Entender por qué shadcn/ui **no es una librería npm** convencional.
- Explicar el patrón "copy-to-your-repo" y sus implicaciones de propiedad.
- Ejecutar el CLI (`init` y `add`) para incorporar componentes al proyecto.
- Reconocer el rol de **Radix primitives** (accesibilidad) y **Tailwind** (estilo).
- Valorar los pros (control total) y los contras (merge manual de updates).
- Situar el `Dialog` de shadcn respecto al demo ligero del `EJEMPLO_DISENO`.

## Requisitos

- Haber leído la [Unidad 01 — Tailwind CSS](Unidad_01_Tailwind_CSS.md) (shadcn lo requiere).
- Conocer la idea de "componente reutilizable" (Módulo 11 ayuda).
- Tener Node.js + `pnpm` y una app Vite con Tailwind (v4) funcionando.
- TypeScript se usa habitualmente con shadcn, aunque no es imprescindible para entender la teoría.

## Qué es

**No es una librería npm**: es un **catálogo de componentes** (Radix primitives + Tailwind) que **copias a tu repo** (`components/ui/button.tsx`).

**La idea, que es la que confunde a todo el mundo al principio.** Normalmente añades una librería con `pnpm add` y sus componentes viven en `node_modules`: no los tocas, los importas y rezas para que la API no cambie. shadcn/ui funciona al revés: te da el **código fuente** de componentes bonitos (botón, diálogo, menú...) y **lo copia dentro de tu proyecto**, por ejemplo en `src/components/ui/button.tsx`. A partir de ahí **es tuyo**: puedes editarlo, renombrarlo, adaptarlo. No hay `pnpm add @shadcn/button`.

Por dentro combina dos piezas que ya conoces o conocerás:

- **Radix UI:** las *primitives* headless: la lógica de accesibilidad de un diálogo (foco, `Esc`, `aria-modal`, click exterior) **sin** venir con diseño. Radix se ocupa de que funcione bien con teclado y lectores de pantalla.
- **Tailwind:** las clases que le dan la apariencia. Recuerda la Unidad 01: utility-first.

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog
```

- Editas el código **en tu proyecto** (sin upstream de librería).
- Accesibilidad y foco de **Radix** por debajo.
- Requiere Tailwind (y normalmente TypeScript).

**Qué hacen los comandos:**

| Comandos | Acción |
|----------|--------|
| `npx shadcn@latest init` | configura el proyecto (alias de paths, tema base, variables CSS) |
| `npx shadcn@latest add button card dialog` | copia a tu repo los archivos de esos componentes |

- *Edits en tu repo:* al terminar, `components/ui/button.tsx` aparece en **tu** árbol de archivos. Abre, cambia, hazlo tuyo. No esperas features del "upstream".
- *Radix por debajo:* esos archivos generados importan `@radix-ui/react-dialog` (etc.) para el comportamiento accesible. Tú no tocas Radix; vives en tu archivo generado.
- *Requisitos:* necesita Tailwind configurado (por eso la Unidad 01 es prerrequisito) y, en la práctica, TypeScript con el `paths` de `tsconfig` bien puesto (el `init` lo ayuda a montar).

## Por qué se volvió popular

1. Propiedad total del componente (no peleas con overrides de lib).
2. Headless good: lógica de dialog/popover sin UI “de otra marca”.
3. Tailwind tokens → encaja con design systems existentes.

**Desarrollando cada punto:**

1. *Propiedad total:* con una librería clásica, personalizar un `Dialog` a tu gusto puede ser 200 líneas de overrides y `!important`. Con shadcn, abres el archivo y lo cambias en la fuente: es **tu** `dialog.tsx`. Se acabó pelear con la especificidad.
2. *Headless good:* los componentes "sin cabeza" (headless) te dan la **lógica** sin imponer una estética de otra marca. Un popover de MUI "huele a MUI"; uno de shadcn usa Radix (que no pinta nada) + tus clases: la accesibilidad profesional sin la cara ajena.
3. *Tailwind tokens:* como el estilo son utilities Tailwind, hereda tu paleta, tus radios y tus espaciados. Si tu design system ya vive en Tailwind, shadcn se integra sin traducciones.

## Cuándo

- Quieres componentes sólidos **y** control total.
- Stack Tailwind + (TS) ya decidido.

**Casos ideales:**

- Tu stack ya es **Tailwind + TypeScript** (por ejemplo Next.js / Vite moderno): shadcn encaja como anillo al dedo porque habla su mismo idioma.
- Quieres empezar rápido **sin renunciar a control**: copy-paste inicial, personalización inmediata.
- Estás construyendo tu propio design system y necesitas una base de accesibilidad (Radix) sin atarte a la skin de una librería.

## Contras

- Actualizaciones: merge manual de diffs de los snippets.
- No hay “upgrade path” de librería; el código es tuyo.

**Por qué importa cada contra (son serios):**

- *Actualizaciones manuales:* si shadcn corrige un bug o mejora la accesibilidad de `dialog`, **no** hay `pnpm update`. Tienes que volver a generar el snippet y **fusionar los diffs con tu código personalizado** a mano. Con muchos componentes editados, esto es trabajo real.
- *No hay "upgrade path":* al ser tuyo, el "soporte" es tuyo. Si un día sale una v2, nadie migra tus archivos por ti. Es el precio de la propiedad total: libertad = mantenimiento propio.

Por eso conviene **no editar más de lo necesario** los componentes generados (cambios pequeños vía props/className) y así minimizar el dolor de los merges futuros.

## En el ejemplo

Patrón documentado; el demo implementa un `Dialog` estilo shadcn con Radix-free simple (details/aria) para no añadir deps pesadas — el README apunta al CLI real.

**Cómo estudiarlo sin instalar shadcn en la demo:** `EJEMPLO_DISENO` prioriza un bundle mínimo, así que **no** incluye ni shadcn ni Radix. En su lugar trae un `Dialog` "a la usanza shadcn" (abierto/cerrado con `<details>` y atributos ARIA) que ilustra la misma idea: componente tuyo, en tu repo, accesible. Para ver el flujo real, en una app con Tailwind + TS ejecuta los dos comandos del bloque `bash` y observa cómo aparece `src/components/ui/`: ese es exactamente el patrón que documenta el README del ejemplo (CLI real → código en tu repo).

## Errores comunes

**Error 1: Esperar que `shadcn add` instale una dependencia importable.**

```jsx
// ❌ Mal: no existe este paquete en node_modules
import { Button } from 'shadcn-ui'

// ✅ Bien: importas TU archivo copiado
import { Button } from '@/components/ui/button'
```

**Solución:** tras `add`, busca el archivo en `src/components/ui/` (o `components/ui/`) e impórtalo desde ahí (con el alias `@/` que configura `init`). Si buscas el componente en `package.json`, estás pensando como con una librería clásica: shadcn no funciona así.

**Error 2: Editar radicalmente un componente y quebrarse los merges futuros.**

```tsx
// ❌ Mal: reescribes la mitad del dialog.tsx generado y luego...
//    npx shadcn@latest add dialog  → conflicto enorme que fusionas a ciegas
```

**Solución:** personaliza lo máximo posible **por fuera** (props, `className` con Tailwind) y deja lo generado casi intacto. Guarda el diff original; cuando actualices, fusionas con calma y contexto.

**Error 3: Instalar shadcn sin Tailwind (o sin el `paths` de TS).**

```bash
# ❌ Falta la base: Tailwind no está configurado en la app
npx shadcn@latest init
```

**Solución:** antes de `init`, ten una app con Tailwind funcionando (Unidad 01) y, si usas TypeScript, comprueba que el alias (`@/*`) está en `tsconfig.json` para que los imports del snippet resuelvan. El propio `init` suele preguntar por esto: no lo saltes a la ligera.

## Conceptos clave

- **shadcn/ui:** catálogo de componentes que se **copia** al repo; no es una librería npm convencional.
- **Patrón copy-to-your-repo:** el código vive en `components/ui/` y es tuyo de pleno derecho.
- **Radix primitives:** lógica headless accesible (foco, teclado, ARIA) sin estilos.
- **Tailwind:** la capa de apariencia de los componentes shadcn.
- **CLI:** `npx shadcn@latest init` (configura) y `... add <comp>` (copia archivos).
- **Control total:** personalizas en la fuente, sin overrides de librería.
- **Contra principal:** actualizaciones con merge manual de diffs.
- **Stack idóneo:** Tailwind + TypeScript (alias `@/`).

## Autoevaluación

**1. ¿Puedo hacer `pnpm add shadcn-ui`?**

<details>
<summary>Respuesta</summary>

No en el sentido clásico: shadcn/ui no es una librería que importas desde `node_modules`. Usas el CLI (`npx shadcn@latest init` / `add`) para **copiar** el código de los componentes a tu repo y de ahí en adelante es tuyo.

</details>

**2. ¿Quién se ocupa de la accesibilidad de un diálogo shadcn?**

<details>
<summary>Respuesta</summary>

**Radix UI** por debajo (foco, `Esc`, `aria-modal`, click fuera) mientras que Tailwind aporta el estilo. Tu archivo generado orquesta ambas cosas, pero la lógica accesible viene de las Radix primitives.

</details>

**3. Principal contra de este patrón frente a una librería npm.**

<details>
<summary>Respuesta</summary>

Las actualizaciones: no existe un `pnpm update` mágico; cuando el snippet mejora, tienes que regenerarlo y **fusionar manualmente** los diffs con tus personalizaciones. Y no hay "upgrade path" oficial: el mantenimiento del código es tuyo.

</details>

**4. ¿Por qué shadcn encaja bien con un design system existente en Tailwind?**

<details>
<summary>Respuesta</summary>

Porque sus componentes están hechos con utilities Tailwind: heredan tus tokens (colores, radios, espaciados) de forma natural. Si tu sistema ya vive en Tailwind, no hay que traducir entre dos mundos de estilos.

</details>
