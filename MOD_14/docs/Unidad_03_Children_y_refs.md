# Unidad 03 — Children, refs y forwardRef

## children

```tsx
type CardProps = {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
```

`React.ReactNode` cubre elementos, strings, arrays, null.

## ref tipado

```tsx
const inputRef = useRef<HTMLInputElement>(null)

<input ref={inputRef} />
// inputRef.current?.focus()
```

## forwardRef (React 19: `ref` como prop)

```tsx
// Clásico (8.18 y aún válido)
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement>
export const Boton = forwardRef<HTMLButtonElement, BtnProps>(function Boton(props, ref) {
  return <button ref={ref} type="button" {...props} />
})

// React 19: ref es prop normal en function components
export function Boton({ ref, ...props }: BtnProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return <button ref={ref} type="button" {...props} />
}
```

## Props de DOM

Extiende en vez de redeclarar:

```tsx
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}
```

## Errores comunes

- `useRef<HTMLInputElement>()` sin `null` → tipado confuso en TS strict.
- Duplicar `className`/`onClick` y hacer overwrite de `...rest` en orden incorrecto (rest al final o merge manual).
- `forwardRef` con componente que no acepta `ref` en el DOM.

## En el ejemplo

`src/components/CampoTexto.tsx` con `forwardRef`.
