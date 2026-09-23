# Unidad 02 — Eventos tipados

## React.SyntheticEvent

```tsx
function Formulario() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.dataset.id)
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={onChange} />
      <button type="button" onClick={onClick}>OK</button>
    </form>
  )
}
```

## Handlers custom (no DOM)

```tsx
type Item = { id: string }

function Lista({ onBorrar }: { onBorrar: (item: Item) => void }) {
  // ...
  return <button onClick={() => onBorrar({ id: '1' })}>x</button>
}
```

## Genéricos de eventos

```tsx
function campo<T>(fn: (v: T) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => fn(e.target.value as unknown as T)
}
```

(Preferible helpers concretos a casts repetidos.)

## Errores comunes

- `onChange={(e) => ...}` con `e` implícito en props tipadas mal → tipa el handler en el **tipo de prop**, no solo en la función anónima.
- `e.target.value` en `HTMLDivElement` — usa `HTMLInputElement` en el tipo del evento.
- `FormEvent` sin genérico → `currentTarget` demasiado ancho.

## En el ejemplo

`src/components/Formulario.tsx`.
