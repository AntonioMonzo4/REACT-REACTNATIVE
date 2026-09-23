# Unidad 03 — Children, refs y forwardRef

## Objetivos

- Tipar `children` correctamente con `React.ReactNode`.
- Crear **refs tipados** con `useRef<HTMLInputElement>(null)` y usar el optional chaining en `.current`.
- Aplicar `forwardRef` (React 18) y el nuevo patrón de `ref` como prop (React 19).
- **Extender** props de DOM (`InputHTMLAttributes`) en vez de redeclararlas.
- Evitar los errores clásicos: `useRef` sin `null`, orden erróneo de `{...rest}` y refs hacia componentes que no las aceptan.

## Requisitos

- **TS básico del M3**: intersection types (`&`), optional (`?`), generics de función.
- M4–M12: componentes contenedores con `children`, `useRef` básico para foco/mediciones, noción de `ref` en el DOM.
- Unidad 01: ya tipaste props con `type`.

## children

Los componentes "contenedor" (`Card`, `Layout`, `Modal`) reciben JSX dentro de sus etiquetas. Eso que va dentro es `children`, y el tipo correcto es **`React.ReactNode`**:

```typescript
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

Uso:

```typescript
<Card title="Hola">
  <p>Texto</p>
  {'string'}
  {[1, 2, 3]}
</Card>
```

**Qué significa:** `React.ReactNode` cubre **elementos, strings, arrays, `null`**, números, fragmentos… todo lo que React sabe renderizar. Por eso funciona tanto `<Card><p/></Card>` como `<Card>{cond && <p/>}</Card>`.

**Por qué importa:** tipos como `children: JSX.Element` o `children: React.ReactElement` son **demasiado estrechos**: rechazan strings, arrays y `null`, que son perfectamente válidos en JSX. `ReactNode` es el tipo "acepta cualquier renderizable" por defecto.

**Cuándo ser más estricto:** si tu componente solo acepta **un** elemento y necesita inspeccionarlo (`cloneElement`, leer `props`), tipá con `React.ReactElement<P>` a propósito — pero eso es la excepción, no la regla.

## ref tipado

Un `ref` es un "puente" al nodo DOM real (input, div, canvas…). El tipo del ref debe coincidir con el elemento:

```typescript
const inputRef = useRef<HTMLInputElement>(null)

<input ref={inputRef} />
// inputRef.current?.focus()
```

**Qué significa cada pieza:**

- `useRef<HTMLInputElement>(null)` — el ref apunta (cuando existe) a un `HTMLInputElement`. El `null` inicial es **obligatorio** en esta forma: al montar, `.current` es `null` hasta que React asigne el nodo.
- `<input ref={inputRef} />` — React escribe el nodo real en `inputRef.current`.
- `inputRef.current?.focus()` — el **optional chaining** (`?.`) es clave: antes del montaje (o si el nodo se desmontó) `.current` es `null`; sin `?.` TS exige un chequeo y en runtime podrías crashear.

**Por qué importa:** con el genérico correcto, `inputRef.current.value` compila; si el genérico es `HTMLDivElement`, TS te bloquea `.value` — exactamente lo que quieres: que el ref del elemento equivocado sea error de compilación.

## forwardRef (React 19: `ref` como prop)

Para que un **componente custom** transmita el `ref` al nodo DOM interno, en React ≤18 se usa `forwardRef`; en **React 19** el `ref` es una prop normal en function components.

```typescript
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

**Qué significa:**

- **Clásico:** `forwardRef<TipoElemento, TipoProps>(render)` recibe `(props, ref)` como dos parámetros; el `ref` llega **aparte** de las props. Los genéricos afirman: "el ref apunta a un `HTMLButtonElement` y las props son las de un botón".
- **React 19:** `ref` se deestructura como una prop más (`{ ref, ...props }`); se anota `ref?: React.Ref<HTMLButtonElement>` porque React ya no lo añade automáticamente a las firmas legacy.

**Por qué importa:** un `<input>` con foco programático (`inputRef.current.focus()`), un canvas o un elemento scrolleable **necesitan** que el padre pueda agarrar el nodo real; sin `forwardRef` (o `ref` como prop en 19), el `ref` del padre queda apuntando al wrapper y no al DOM.

## Props de DOM

Cuando tu componente envuelve un elemento nativo y quiere reenviar atributos (`className`, `placeholder`, `disabled`…), **extiende en vez de redeclarar**:

```typescript
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}
```

**Qué significa:** `React.InputHTMLAttributes<HTMLInputElement>` ya contiene **toda** la lista oficial de atributos de `<input>` (tipados): `value`, `onChange`, `placeholder`, `disabled`, `className`… La intersección `& { label: string }` **añade** tu prop propia (`label`) encima.

```typescript
export function CampoTexto({ label, ...rest }: InputProps) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  )
}
```

**Por qué importa:** redeclarar atributos a mano se desincroniza siempre (olvidás `autoComplete`, `min`, `maxLength`…) y los tipás mal. Heredar de `*HTMLAttributes` te da compatibilidad total con el DOM y foco en tus props únicas.

### Extiende vs redeclara

| Enfozo | Ejemplo | Consecuencia |
|--------|---------|--------------|
| ❌ Redeclarar | `type P = { className?: string; placeholder?: string }` | Se te olvidan atributos; tipos a mano, propensos a error |
| ✅ Extender | `React.InputHTMLAttributes<HTMLInputElement> & { label: string }` | Todos los atributos de `<input>` tipados + tus props propias |

## En el ejemplo

`src/components/CampoTexto.tsx` con `forwardRef<HTMLInputElement, CampoTextoProps>` y `InputHTMLAttributes` extendidos (el `{...rest}` va al final del `<input>`).

## Errores comunes

**1. `useRef<HTMLInputElement>()` sin `null` → tipado confuso en TS strict.**

```typescript
// ❌ sin inicial: .current es HTMLInputElement (no null) → TS cree que ya existe
const r = useRef<HTMLInputElement>()
r.current.value  // ⚠️ en runtime puede ser null → crash

// ✅ forma correcta con null + optional chaining
const r = useRef<HTMLInputElement>(null)
r.current?.value
```

Solución: inicializá con `null` (`useRef<HTMLInputElement>(null)`) y accedé con `?.`. Si TS te dice que `null` no es asignable, es que estás en la forma "mutable sin inicial" (`useRef<HTMLInputElement | null>(null)`).

**2. Duplicar `className`/`onClick` y hacer overwrite de `...rest` en orden incorrecto.**

```typescript
// ❌ rest al FRENTE: tu className/onClick pisan los del padre sin querer
<input {...rest} className="mi-clase" onClick={miHandler} />

// ✅ orden correcto: tuyos primero, rest al final para que el padre gane
<input className="mi-clase" onClick={miHandler} {...rest} />
// …o merge manual si TÚ debes tener la última palabra:
<input {...rest} className={`mi-clase ${rest.className ?? ''}`} />
```

Solución: el **spread `{...rest}` al final** hace que el consumidor pueda sobreescribir; si en cambio tu componente debe imponer un comportamiento (p. ej. `onClick` interno), mergeá explícitamente en vez de dejar dos declaraciones en competencia.

**3. `forwardRef` con componente que no acepta `ref` en el DOM.**

```typescript
// ❌ ref hacia un componente custom que no usa forwardRef → warning/null
const ref = useRef<HTMLDivElement>(null)
<MiWrapper ref={ref} />

// ✅ MiWrapper debe forwardRef y colgar el ref en un nodo DOM real
```

Solución: el `ref` solo "aterriza" en elementos DOM (o en componentes que implementan `forwardRef`/aceptan `ref`). Un `div`/`span`/`input` interno sí; un componente que no propaga el ref no.

## Conceptos clave

- **`React.ReactNode`**: tipo por defecto de `children`; acepta elementos, strings, arrays, `null`.
- **`useRef<T>(null)`**: ref tipado al nodo DOM; `.current` empieza en `null` → usa `current?.`.
- **`forwardRef<El, Props>`**: transmite el `ref` del padre al nodo DOM dentro del componente (React ≤18).
- **React 19**: `ref` como prop normal; se deestructura y se anota con `React.Ref<T>`.
- **Extender atributos DOM**: `React.InputHTMLAttributes<HTMLInputElement> & { propsPropias }` — nunca redeclarar la lista completa.
- **Orden de spreads**: `{...rest}` al final para que el consumidor pueda sobreescribir; merge manual si tu componente debe imponerse.

## Autoevaluación

**1. ¿Por qué `children: React.ReactElement` suele ser un tipo demasiado estricto?**

<details>
<summary>Respuesta</summary>

Porque `ReactElement` solo acepta un elemento JSX. Los hijos reales incluyen strings (`<Card>hola</Card>`), números, arrays, `null` (renders condicionales) y fragmentos — todo eso es `React.ReactNode`. Con `ReactElement`, casos válidos no compilan.

</details>

**2. Explica por qué se escribe `useRef<HTMLInputElement>(null)` y cómo se usa seguro.**

<details>
<summary>Respuesta</summary>

`<HTMLInputElement>` tipa a qué nodo apunta el ref; `(null)` refleja que antes del montaje no hay nodo (`current = null`). Uso seguro: asignar `ref={inputRef}` al `<input>` y acceder con optional chaining (`inputRef.current?.focus()`), evitando el crash cuando aún no existe.

</details>

**3. Tu `Boton` recibe `ref` del padre pero `.current` es `null` siempre. ¿Qué falta?**

<details>
<summary>Respuesta</summary>

Falta propagar el ref: en React ≤18 envolver el render con `forwardRef<HTMLButtonElement, BtnProps>((props, ref) => …)` y colgarlo en `<button ref={ref}>`; en React 19, aceptar `ref` como prop (`{ ref, ...props }`) y pasarlo al `button`. Sin eso, el ref apunta al componente (o no se asigna) y nunca llega al nodo DOM.

</details>

**4. Dentro de `CampoTexto`, ¿qué pasa si escribís `<input {...rest} className="fijo" />` y el padre pasa `className="grande"`?**

<details>
<summary>Respuesta</summary>

Como `{...rest}` está primero, `className="fijo"` lo pisa: el padre pierde `"grande"` silenciosamente. Solución: spread al final (`<input className="fijo" {...rest} />`) si el padre debe mandar, o merge explícito (`className={`fijo ${rest.className}`} `) si tu componente debe combinar/imponer.

</details>
