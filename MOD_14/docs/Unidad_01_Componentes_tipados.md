# Unidad 01 — Componentes tipados (props y state)

## Objetivos

- Declarar las **props** de un componente con `type` o `interface` y usar opcionales.
- Inferir y anotar el estado de `useState` (incluida la unión `T | null`).
- Entender `React.ReactNode` para `children` y las unions literales de UI (`tone?: 'blue' | 'green'`).
- Reconocer los errores típicos: props vacías, `any` implícito al migrar JS y mutar props.
- Aplicar lo aprendido en los componentes del ejemplo (`UsuarioCard`, `Layout`).

## Requisitos

- **TypeScript básico del M3**: tipos primitivos, `type`/`interface`, opcionales (`?`), unions, funciones como tipo.
- M4–M12 de React: componentes funcionales, props, `useState`.
- Un editor con TypeScript (VS Code) para ver autocompletado y tachado de errores en tiempo real.

## Las props: el contrato de entrada de tu componente

Las **props** (propiedades) son los datos que un componente recibe de quien lo usa. En JS podrías pasar cualquier cosa y descubrir el error en ejecución; en TS las props son un **contrato**: si falta una, si es del tipo equivocado o si escribís una prop que no existe, el editor lo marca **antes** de ejecutar.

```typescript
type UsuarioCardProps = {
  nombre: string
  edad?: number
  onSaludar: (id: string) => void
}

export function UsuarioCard({ nombre, edad, onSaludar }: UsuarioCardProps) {
  return (
    <button type="button" onClick={() => onSaludar(nombre)}>
      {nombre}{edad != null ? ` (${edad})` : ''}
    </button>
  )
}
```

**Qué significa cada línea:**

- `nombre: string` — **obligatoria**: sin ella, error.
- `edad?: number` — **opcional** (`?`): puede no venir; al destructurar puede ser `number | undefined`, por eso se chequea con `edad != null` antes de usarla en el template.
- `onSaludar: (id: string) => void` — una **función callback** tipada: recibe un `string` y no devuelve nada útil (`void`).
- `: UsuarioCardProps` tras el destructuring — es donde **conectas** el contrato con la firma del componente.

**Por qué importa:** el tipo es documentación viva. Otro programador ve `UsuarioCardProps` y sabe exactamente qué puede pasar, y el compilador hace cumplir el contrato.

**`type` vs `interface`:** la alternativa con `interface` tiene el mismo efecto:

```typescript
interface UsuarioCardProps {
  nombre: string
  edad?: number
  onSaludar: (id: string) => void
}
```

Elige una y mantén la coherencia en el equipo; para props de componentes, `type` es muy común en el ecosistema React.

### Resumen visual de las props del ejemplo

| Prop | Tipo | Obligatoria | Significado |
|------|------|-------------|-------------|
| `nombre` | `string` | Sí | Texto a pintar y a pasar a `onSaludar` |
| `edad` | `number` | No (`?`) | Puede faltar; se comprueba con `!= null` |
| `onSaludar` | `(id: string) => void` | Sí | Callback tipado; recibe un `string`, no devuelve nada |

## State con `useState`

`useState` puede **inferir** el tipo a partir del valor inicial, pero hay casos donde debes anotar:

```typescript
const [contador, setContador] = useState(0)          // number inferido
const [nombre, setNombre] = useState('')             // string
const [user, setUser] = useState<Usuario | null>(null) // null inicial explícito
```

**Regla:** si el estado arranca en `null`/`undefined` y luego es otro tipo, **declara la unión** (`T | null`) o usa `useState<T>(...)`.

```typescript
// ❌ Mal: TS infiere solo null; setUser(usuario) da error
const [user, setUser] = useState(null)

// ✅ Bien: unión explícita desde el principio
const [user, setUser] = useState<Usuario | null>(null)

// ✅ También bien: anotar la forma del objeto
const [user, setUser] = useState<Usuario | null>(null)
setUser({ nombre: 'Ana', edad: 30 })
```

**Por qué importa:** el caso de "todavía no hay datos" (`null`) es el 90 % de los estados de red. Si no declarás la unión, TS no te deja guardar nada distinto de `null`… o peor, te obliga a usar `any` y pierdes toda protección.

## Props.children y optional

Dos patrones de props muy habituales:

```typescript
type LayoutProps = { children: React.ReactNode }
type BadgeProps = { tone?: 'blue' | 'green' }   // union literal de UI
```

- **`children: React.ReactNode`**: acepta *cualquier cosa renderizable* — elementos JSX, strings, números, arrays, `null`, fragmentos. Es el tipo correcto para componentes contenedores (`Layout`, `Card`, `Modal`).
- **`tone?: 'blue' | 'green'`** — **union literal de UI**: solo esos dos valores pasan. Tipar variantes visuales así evita `<Badge tone="blu" />`, que compila en JS pero se ve roto en pantalla.

```typescript
export function Layout({ children }: LayoutProps) {
  return <div className="layout">{children}</div>
}

export function Badge({ tone = 'blue', children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
```

**Por qué importa:** `ReactNode` evita pelear con el tipo exacto de cada hijo, y las unions literales convierten "valores de UI" en errores de compilación cuando se escriben mal.

## En el ejemplo

`src/components/UsuarioCard.tsx`, `src/components/Layout.tsx`.

## Errores comunes

**1. `type Props = {}` vacío y luego `{...rest}` sin `HTMLAttributes`.**

```typescript
// ❌ Mal: Props vacío; no puedes repasar atributos de botón/input
type Props = {}
function Btn({ className, onClick, ...rest }: Props) { /* error: no existen */ }

// ✅ Bien: extiende los atributos nativos del DOM
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  texto: string
}
```

Solución: si tu componente reenvía atributos al DOM, **extiende** `React.ButtonHTMLAttributes` / `InputHTMLAttributes` / etc. (ver Unidad 03) en vez de declarar `Props = {}`.

**2. Inferring `any` desde JS migrado → `noImplicitAny`.**

```typescript
// ❌ JS migrado sin tipos: parámetro implícito any
function tarjeta(nombre) { return nombre }

// ✅ anótalo
function tarjeta(nombre: string) { return nombre }
```

Solución: activa `noImplicitAny` en `tsconfig` y anota los parámetros; recorrer el código migrado buscando parámetros sin tipo.

**3. Mutar props (`props.x = 1`) — solo lectura.**

```typescript
// ❌ error de TS y mala práctica
function Contador(props: { total: number }) {
  props.total = props.total + 1  // Cannot assign to 'total' — props son de solo lectura
}
```

Solución: las props son **inmutables**; para derivar valores usa variables locales (`const doble = props.total * 2`) o estado con `setTotal`.

## Conceptos clave

- **`Props` tipado**: `type`/`interface` que actúa como contrato de entrada; opcionales con `?`.
- **Callbacks tipados**: `(id: string) => void` documenta qué recibe y qué devuelve el handler.
- **Inferencia vs anotación** en `useState`: `useState(0)` infiere; `useState<Usuario | null>(null)` se anota cuando el inicial es `null`/ambiguo.
- **Unión `T | null`**: patrón para "aún no hay dato" (carga de red, modal cerrado…).
- **`React.ReactNode`**: tipo de `children` — acepta cualquier renderizable.
- **Union literal de UI**: `'blue' | 'green'` para variantes visuales.
- **Anti-patrones**: `Props = {}`, `any` implícito en migración y mutar props.

## Autoevaluación

**1. ¿Por qué `useState(null)` suele ser un problema y cómo lo declaras bien?**

<details>
<summary>Respuesta</summary>

Porque TS infiere que el estado es solo `null`; al intentar `setUser(usuario)` marca error. Se arregla declarando la unión explícita: `useState<Usuario | null>(null)` (o anotando el tipo completo del dato). Así el estado puede ser `null` durante la carga y `Usuario` cuando llegue.

</details>

**2. En `UsuarioCardProps`, ¿qué le pides a TS cada una de `nombre: string`, `edad?: number` y `onSaludar: (id: string) => void`?**

<details>
<summary>Respuesta</summary>

- `nombre: string`: obligatoria y de tipo string; falta o tipo ≠ string → error de compilación.
- `edad?: number`: opcional; puede ausentarse (`undefined`), por eso se chequea antes de usarla.
- `onSaludar: (id: string) => void`: solo se puede pasar una función que reciba un string y no retorne valor útil; el editor valida la llamada interna `onSaludar(nombre)`.

</details>

**3. Tu compañero escribe `type LayoutProps = {}` y dentro hace `<div {...props}>`. ¿Qué falla y cuál es la solución?**

<details>
<summary>Respuesta</summary>

`{}` no contiene nada, así que `className`, `style`, `onClick`… no existen en el tipo y TS marca error al usarlos o reenviarlos. La solución es extender los atributos DOM nativos: `type LayoutProps = React.HTMLAttributes<HTMLDivElement> & { …tus props propias }`, tal como se muestra en *Errores comunes* y en la Unidad 03.

</details>

**4. ¿Qué aporta `tone?: 'blue' | 'green'` frente a `tone?: string`?**

<details>
<summary>Respuesta</summary>

`string` acepta cualquier texto (`"azul"`, `"blu"`, `"BLUE"`), con lo que los errores de UI pasan a runtime. `'blue' | 'green'` restringe a esos literales: `<Badge tone="blu" />` no compila, y el autocompletado solo ofrece los valores válidos. Es una "union literal de UI".

</details>
