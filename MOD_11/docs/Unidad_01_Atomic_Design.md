# Unidad 01 — Atomic Design

## Objetivos

- Entender qué es Atomic Design y por qué la inventó Brad Frost.
- Distinguir con claridad los cinco niveles: atoms, molecules, organisms, templates y pages.
- Saber en qué nivel colocar un componente nuevo de tu app.
- Reconocer los errores típicos (átomos con 30 props, carpetas vacías de name).
- Aplicar las reglas prácticas para no caer en el "over-engineering".
- Situar los atoms, molecules y organisms del ejemplo `EJEMPLO_ARQUITECTURA`.

## Requisitos

- Haber creado alguna app con Vite + React y saber qué es un componente.
- Entender props a nivel básico: `<Boton texto="Guardar" />`.
- Tener Node.js y `pnpm` instalados (el ejemplo los usa).
- No hace falta saber de design systems ni de Figma.

## Origen

Brad Frost: componer UI como un **sistema** → de lo atómico a lo concreto.

**¿Qué significa esto?** Imagina la química: en la naturaleza no existen "casas" y "árboles" como bloques fundamentales, existen átomos (oxígeno, hidrógeno) que se combinan en moléculas (agua), que a su vez forman tejidos y finalmente organismos completos (una persona). Brad Frost aplicó la misma idea a la interfaz de usuario: en lugar de construir "la pantalla de login" como un bloque gigante e indivisible, la descompones en piezas pequeñas que se reutilizan en todas partes.

**¿Por qué importa?** Porque en un proyecto real tendrás 50 pantallas. Si cada pantalla inventa su propio botón, tendrás 50 botones distintos que nunca se parecen entre sí, y cuando el cliente diga "el azul debe ser más oscuro" tendrás que cambiar 50 archivos. Con un sistema atómico cambias **uno** y las 50 pantallas se actualizan.

| Nivel | Qué es | Ejemplo |
|-------|--------|---------|
| **Atoms** | primitivas sin lógica de negocio | botón, input, badge, label |
| **Molecules** | combinación de atoms con un rol | campo de búsqueda (input + botón), card de producto |
| **Organisms** | bloques completos | navbar, formulario de login, tabla de listado |
| **Templates / Pages** | layout y página con datos reales | `/productos` con filtros y lista |

**Cómo leer esta tabla:** los *atoms* son la hoja de estilo viva: un `Button` no sabe si lo van a usar para borrar o para comprar, solo sabe dibujarse. Las *molecules* ya tienen un pequeño propósito: la `SearchBar` junta un `input` (atom) con un `Boton` (atom) para buscar; separados no buscan nada, juntos sí. Los *organisms* son secciones reconocibles de una web: la barra de navegación de arriba es un organismo porque ya incluye logo, enlaces y botón de sesión. Los *templates* describen el esqueleto ("aquí va el menú, aquí el contenido") y las *pages* son ese esqueleto relleno con datos de verdad (productos del servidor).

## Por qué en React

- Reutilizabilidad: un `Button` atom se usa en 20 molecules.
- Testing: atoms casi gratuitos; organisms con RTL.
- Design tokens (color/espaciado) viven en atoms/CSS, no dispersos.

**En palabras llanas:** React premia la reutilización, así que este método le viene como anillo al dedo.

- **Reutilizabilidad:** si `Button` vive en un solo sitio, cualquier molecule o organism puede importarlo. Un solo archivo, un solo lugar donde arreglar el padding.
- **Testing:** probar un atom es trivial (¿se renderiza? ¿dispara `onClick`?). Testing Library tarda tres líneas. Probar un organismo como el navbar es más trabajo, pero al menos sus piezas ya están probadas por separado.
- **Design tokens:** los colores oficiales (`--color-primary`) y los espaciados (`8px`, `16px`) se declaran una vez y los atoms los consumen. Si no, acabas con `#3b5bdb` en un archivo, `#3b5cdc` en otro y `blue` en un tercero.

## Estructura de carpetas ejemplo

```text
src/
  components/
    atoms/     Button.jsx, Badge.jsx
    molecules/ SearchBar.jsx, ProductCard.jsx
    organisms/ Navbar.jsx, ProductGrid.jsx
    templates/ MainLayout.jsx
  pages/       ProductosPage.jsx
```

**Qué significa cada línea:**

- `atoms/` → piezas indivisibles. No importan de otros niveles.
- `molecules/` → importan atoms. Por ejemplo `SearchBar` hace `import { Button } from '../atoms/Button'`.
- `organisms/` → importan molecules (y a veces atoms). `Navbar` puede usar `Button`.
- `templates/` → definen el layout con slots (`children`) pero no traen datos.
- `pages/` → conectan el template con datos reales (fetch, store) y las rutas.

La regla de oro es que las **flechas de importación apuntan hacia abajo**: el atom nunca importa una molecule. Si lo hace, has mezclado los niveles y el sistema se rompe.

## Reglas prácticas

1. **No over-engineer**: si una “molecule” solo existe en un sitio, puede vivir en `features/`.
2. Los atoms **no** importan molecules/organisms (dependencias hacia abajo).
3. Naming por dominio (`CartLine`) a veces gana a naming atómico estricto.

**Explicación:**

1. *No sobre-ingenieres.* Crear la carpeta `molecules/` con un archivo que usas una sola vez es burocracia inútil. Si solo lo usa la pantalla de carrito, ponlo en `features/carrito/components/`. Atomic Design es una guía, no la policía.
2. *Dependencias hacia abajo.* Un `Button` que hace `import SearchBar` es un absurdo: el botón básico dependería de la búsqueda. Así nadie podrá reutilizarlo. Regla sencilla: **si importas "hacia arriba" en la tabla, has hecho algo mal.**
3. *Nombre por negocio.* "CartLine" le dice a tu compañero qué es. "AtomOrganismRow" no le dice nada. Cuando el nombre atómico se sienta forzado, usa el del dominio.

## Errores comunes

**Error 1: Átomos con props infinitas (terminas con un `Button` de 30 flags).**

```jsx
// ❌ Mal: nadie recuerda qué combinación usar
<Button
  small primary rounded uppercase bold iconLeft="save"
  loading disabled danger fullWidth ghost
/>
```

```jsx
// ✅ Bien: variantes explícitas y pocos ajustes
<Button variant="primary" size="sm">Guardar</Button>
```

**Solución:** si un atom tiene más de ~6 props opcionales, parte en variantes (`variant`, `size`) o crea dos componentes (`Button`, `IconButton`). El átomo debe ser fácil de usar sin leer su código fuente.

**Error 2: Copiar nivel de carpetas sin extraer componentes reales.**

```text
src/components/atoms/     ← vacío o con copias de botones
src/components/molecules/ ← 1 archivo que nadie usa
```

**Solución:** no crees carpetas "por si acaso". Mueve un componente real cuando ya lo hayas escrito dos veces. Empieza con `components/` plano y separa en atoms/molecules cuando veas la repetición con tus propios ojos.

**Error 3: Los atoms importan datos o hooks de negocio.**

```jsx
// ❌ Mal: el botón sabe del carrito
function Button() {
  const { total } = useCarrito()
  return <button>Pagar {total}</button>
}
```

```jsx
// ✅ Bien: el padre le pasa los datos
<Button onClick={pagar}>{`Pagar ${total}`}</Button>
```

**Solución:** el atom recibe todo por props. Quien decide *qué* mostrar es el organism o la page, no el botón.

## Conceptos clave

- **Atomic Design:** método de Brad Frost para diseñar UI como un sistema de lo pequeño a lo grande.
- **Atom:** primitiva sin lógica de negocio (`Button`, `Badge`, `Input`).
- **Molecule:** combinación de atoms con un rol concreto (`SearchBar`).
- **Organism:** bloque completo de la interfaz (`Navbar`, tabla de listado).
- **Template / Page:** layout con slots y página con datos reales.
- **Dependencias hacia abajo:** un nivel solo importa a niveles inferiores.
- **Over-engineering:** crear estructura que no necesitas todavía.
- **Design tokens:** colores y espaciados centralizados, no dispersos.

## Autoevaluación

**1. Estás creando un `ProductCard` con imagen, título, precio y botón "Añadir". ¿En qué nivel va?**

<details>
<summary>Respuesta</summary>

En **molecule**: combina varios atoms (imagen, texto, `Button`) con un rol claro (mostrar un producto). Si además tuviera la lista completa de productos del catálogo, la lista sería un organism.

</details>

**2. ¿Puede un atom importar una molecule?**

<details>
<summary>Respuesta</summary>

No. Las dependencias apuntan hacia abajo: atoms → nada, molecules → atoms, organisms → molecules/atoms. Si `Button` importa `SearchBar`, el botón deja de ser reutilizable y se crea un ciclo conceptual de niveles.

</details>

**3. Tienes un `Badge` que solo aparece en la pantalla de ofertas. ¿Lo creas en `atoms/`?**

<details>
<summary>Respuesta</summary>

No necesariamente. Si solo existe en un sitio, puede vivir en `features/ofertas/components/`. Regla 1: no sobre-ingenieres. Cuando lo necesites en otro sitio, lo subes a `atoms/`.

</details>

**4. ¿Por qué es un problema un `Button` con 30 props booleanas?**

<details>
<summary>Respuesta</summary>

Porque es imposible de recordar, de testear y de documentar, y cada compañero usará una combinación distinta (la famosa "props infinitas"). Solución: reducir a `variant` + `size` y crear componentes separados cuando el caso lo merezca.

</details>
