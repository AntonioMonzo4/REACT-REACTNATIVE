# Unidad 05 — Formularios controlados y validaciones

## Formulario controlado

El estado de React es **la única fuente de verdad**. Cada input tiene `value` + `onChange`:

```jsx
function EmailForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

**Ventajas:** validación en tiempo real, campos dependientes, reset fácil, JS/TS tipado.  
**Desventaja:** cada tecla → re-render (en formularios normales no es un problema).

## Formulario no controlado

Usa el DOM como estado (`ref` o `FormData`):

```jsx
function NoControlado() {
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(formRef.current)
    console.log(Object.fromEntries(data))
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="user" defaultValue="" />
      <button>Enviar</button>
    </form>
  )
}
```

Útil para formularios simples o integraciones ajenas; validaciones complejas suelen ser más cómodas controladas.

## Patrón de validación (objetos de error)

```jsx
const [values, setValues] = useState({ email: '', password: '' })
const [errors, setErrors] = useState({})
const [touched, setTouched] = useState({})

function validate(values) {
  const errs = {}
  if (!values.email) errs.email = 'Email obligatorio'
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = 'Email inválido'
  if (values.password.length < 6) errs.password = 'Mínimo 6 caracteres'
  return errs
}

const handleChange = (e) => {
  const { name, value } = e.target
  const next = { ...values, [name]: value }
  setValues(next)
  if (touched[name]) setErrors(validate(next))
}

const handleBlur = (e) => {
  const { name } = e.target
  setTouched({ ...touched, [name]: true })
  setErrors(validate(values))
}

const handleSubmit = (e) => {
  e.preventDefault()
  const errs = validate(values)
  setErrors(errs)
  setTouched({ email: true, password: true })
  if (Object.keys(errs).length === 0) {
    // enviar
  }
}
```

### ideas clave

1. **`touched`**: no enseñar errores antes de que el usuario toque el campo (mejor UX).
2. **Validar en submit** siempre; al `blur`/`change` solo si ya está touched.
3. **Reset**: `setValues(initial)`, `setErrors({})`, `setTouched({})`.
4. Errores con `aria-invalid` y `aria-describedby` para accesibilidad.

## getElement vs estado

- Controlado: re-render por tecla → bien para UI reactiva.
- Para inputs “pesados” puedes validar en `blur` y solo guardar en estado al salir del campo.

## En el ejemplo del proyecto

Ver `src/components/FormularioValidado.jsx`: email + password, touched, errores en línea y envío simulado.
