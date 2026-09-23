# Unidad 01 — Componentes tipados (props y state)

## Props

```tsx
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

Alternativa `interface` — mismo efecto; el equipo elige una y la mantiene.

## State con `useState`

```tsx
const [contador, setContador] = useState(0)          // number inferido
const [nombre, setNombre] = useState('')             // string
const [user, setUser] = useState<Usuario | null>(null) // null inicial explícito
```

Regla: si el estado arranca en `null`/`undefined` y luego es otro tipo, **declara la unión** (`T | null`) o us `useState<T>(...)`.

## Props.children y optional

```tsx
type LayoutProps = { children: React.ReactNode }
type BadgeProps = { tone?: 'blue' | 'green' }   // union literal de UI
```

## Errores comunes

- `type Props = {}` vacío y luego `{...rest}` sin `HTMLAttributes`.
- Inferring `any` desde JS migrado → `noImplicitAny`.
- Mutar props (`props.x = 1`) — solo lectura.

## En el ejemplo

`src/components/UsuarioCard.tsx`, `src/components/Layout.tsx`.
