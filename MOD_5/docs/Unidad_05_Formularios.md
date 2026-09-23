# Unidad 05 — Formularios controlados y validaciones

## Objetivos

- Entender qué significa que el estado de React sea **la única fuente de verdad** en un formulario.
- Saber construir un **formulario controlado** con `value` + `onChange` y explicar sus ventajas y desventajas.
- Saber construir un **formulario no controlado** con `ref` y `FormData`, y decidir cuándo conviene usarlo.
- Dominar el **patrón de validación con objetos de error** (`values` / `errors` / `touched`) y las funciones `handleChange`, `handleBlur` y `handleSubmit`.
- Aplicar buenas prácticas de UX y accesibilidad: `touched`, `aria-invalid`, `aria-describedby`.
- Revisar el ejemplo real del proyecto: `../EJEMPLO_REACT_INTERMEDIO/src/components/FormularioValidado.jsx`.

## Requisitos

- Módulo 4 superado: debes dominar `useState`, manejo de eventos (`onChange`, `onSubmit`, `onBlur`) y renderizado de listas.
- Conviene haber visto `useRef` (se usa en el formulario no controlado).
- Si aún no controlas la diferencia entre "el DOM guarda el valor" y "React guarda el valor", repasa M4 antes de continuar: esta unidad gira entero sobre esa distinción.

---

## Formulario controlado: React como única fuente de verdad

### Qué significa

Piensa en un formulario clásico de HTML: el navegador guarda dentro de cada `<input>` su propio valor. Ese valor vive en el DOM, fuera de React. Cuando tú escribes, cambia el DOM, pero tu componente React **no se entera** hasta que algo lo pregunte.

En un **formulario controlado** invertimos las cosas: el valor de cada input **vive en el estado de React**, y el DOM solo lo refleja. React manda; el input es un espejo. Cada input recibe dos piezas:

- `value={...}`: el estado de React le dice qué debe mostrar.
- `onChange={...}`: cada vez que el usuario escribe, React actualiza el estado.

Así se cierra el ciclo: el usuario escribe → `onChange` actualiza el estado → React re-renderiza → el input muestra el nuevo valor.

### Qué significa en código

Cada input tiene `value` + `onChange`:

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

Fíjate en el flujo completo: `useState('')` crea la variable `email`; `value={email}` la pinta en el input; `onChange` la actualiza con lo que el usuario teclea; y en `handleSubmit` lees `email` directamente del estado, sin tocar el DOM. `e.preventDefault()` evita que el navegador recargue la página (comportamiento por defecto de `<form>`).

### Por qué importa

Cuando el valor está en React, puedes hacer cosas imposibles (o muy incómodas) con el DOM puro: validarlo en tiempo real, mostrar un contador de caracteres, habilitar el botón solo si todo es válido, limpiar varios campos de golpe después de enviar, o derivar un campo a partir de otro (por ejemplo, generar un "slug" mientras el usuario escribe el título). Todo eso es trivial si el estado ya está ahí.

### Ventajas y desventajas del enfoque original

**Ventajas:**

- **Validación en tiempo real**: como React conoce el valor en cada tecla, puede recalcular errores inmediatamente.
- **Campos dependientes**: si el valor de un input deriva de otro (confirma-email, precio con descuento...), simplemente computes el derivado en el render.
- **Reset fácil**: `setEmail('')` (o un solo `setValues(initial)`) limpia todo; no hay que recorrer el DOM.
- **JS/TS tipado**: tu estado tiene forma conocida (`{ email: string, password: string }`), así que el compilador te ayuda.

**Desventaja:**

- Cada tecla provoca un re-render del componente. En formularios normales **no es un problema** —React es rápido—; solo notas el coste en listas gigantes o inputs con renders pesados (allí veremos la alternativa de validar en `blur`).

---

## Formulario no controlado: el DOM como estado

### Qué significa

En el enfoque no controlado, React **no guarda** el valor: lo guarda el propio input, como en HTML clásico. React solo lo consulta cuando lo necesita, usando un `ref` (una referencia al nodo del DOM) o la API `FormData` del navegador.

Un detalle importante: en HTML usamos `defaultValue` (no `value`) para el valor inicial, porque `value` sin `onChange` convertiría el input en controlado y React te avisaría.

### Qué significa en código

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

Al enviar, `new FormData(formRef.current)` recoge **todos** los campos que tengan `name`, y `Object.fromEntries(data)` los convierte en un objeto plano (`{ user: '...' }`). Nunca hubo un `useState`: el estado era el DOM.

### Por qué importa y cuándo usarlo

- **Formularios simples** (una búsqueda, un login de dos campos) donde no necesitas reaccionar a cada tecla.
- **Integraciones con librerías ajenas** que manejan sus propios inputs y no quieres pelearte con ellas.
- **Inputs muy pesados** donde el re-render por tecla sí molesta.

Regla práctica: si vas a validar con varios errores en línea, sincronizar campos entre sí o mostrar estado visual en cada tecla, **controlado gana**. Si solo necesitas leer los datos al enviar, no controlado es más liviano.

---

## Patrón de validación (objetos de error)

Este es el patrón central de la unidad. En vez de un booleano "es válido", mantenemos tres objetos en estado:

- `values`: los datos del formulario (la fuente de verdad).
- `errors`: un objeto donde cada clave es el nombre de un campo y cada valor es su mensaje de error (o no existe la clave si no hay error).
- `touched`: qué campos ya fueron "tocados" por el usuario (visitados y abandonados con `blur`).

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

### El flujo, paso a paso

**1. Apertura del formulario.** `errors` y `touched` empiezan vacíos `{}`. El usuario ve el formulario limpio, sin un montón de mensajes rojos. Esto es exactamente lo que consigue `touched`: **evita errores al abrir**. Si solo miraras `errors`, un `validate` inicial pintaría "Email obligatorio" antes de que nadie escribiera nada, y eso frustra al usuario.

**2. El usuario escribe (`handleChange`).** Se actualiza `values` con el campo correspondiente (usa la notación computada `{ ...values, [name]: value }` para no perder los demás campos). Luego, **solo si ese campo ya está en `touched`**, se re-valida: si el usuario ya se equivocó una vez y está corrigiendo, el mensaje de error debe desaparecer o cambiar en vivo. Si nunca tocó el campo, no moleamos.

**3. El usuario sale del campo (`handleBlur`).** Marca ese campo como tocado y valida **todo** el objeto `values`. Ahora sí aparece el error en línea: el campo fue visitado, ya es justo mostrarle al usuario si dejó algo mal.

**4. Envío (`handleSubmit`).** Siempre se valida, sin importar el estado de `touched`: **validar en submit siempre** es tu red de seguridad. Se marca todos los campos como tocados (`setTouched({ email: true, password: true })`) para que cualquier error pendiente se muestre de inmediato. Si `Object.keys(errs).length === 0`, no hay errores y puedes enviar. Si los hay, el usuario ve todos los mensajes y corrige.

**5. Reset.** Tras un envío exitoso: `setValues(initial)`, `setErrors({})`, `setTouched({})`. Los tres objetos vuelven a su estado inicial y el formulario queda "como recién abierto".

### Ideas clave (ampliadas)

1. **`touched` mejora la UX**: no enseñar errores antes de que el usuario toque el campo. Nadie quiere ver rojos al abrir el formulario; sí quiere verlos en cuanto deja un campo mal.
2. **Validar en submit** siempre; al `blur`/`change` solo si ya está touched. El submit es la última línea de defensa, el `blur` la experiencia en vivo, el `change` la corrección reactiva.
3. **Reset**: `setValues(initial)`, `setErrors({})`, `setTouched({})`. Los tres, juntos: si olvidas uno, el formulario "recuerda" el intento anterior.
4. **Accesibilidad**: asocia cada error al input con `aria-invalid={!!errors.email}` y `aria-describedby="email-error"`, y renderiza el mensaje en un elemento `id="email-error"`. Los lectores de pantalla anuncian el campo como inválido y leen el motivo, en lugar de solo pintar texto rojo que el usuario no escucha.

```jsx
<input
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && <p id="email-error">{errors.email}</p>}
```

---

## getElement vs estado

- **Controlado** (estado): re-render por tecla → perfecto para UI reactiva: mostrar errores al vuelo, habilitar/deshabilitar botones, previsualizar lo que se escribe.
- **`getElementById` / leer el DOM en el evento**: sin re-renders, pero el componente no "sabe" el valor; es un enfoque imperativo, difícil de sincronizar con la UI.
- Para **inputs "pesados"** (texto largo, edición rica...) puedes validar en `blur` y solo guardar en estado al salir del campo: el usuario teclea sin costo de re-render y React se entera cuando termina.

---

## En el ejemplo del proyecto

Ver `../EJEMPLO_REACT_INTERMEDIO/src/components/FormularioValidado.jsx`: email + password, touched, errores en línea y envío simulado. Léelo junto a este texto: es el patrón `values`/`errors`/`touched` con `handleChange`, `handleBlur` y `handleSubmit` aplicado a un caso real.

---

## Errores comunes

| Error | Solución |
|-------|----------|
| Poner `value` sin `onChange` → React avisa "You provided a `value` prop to a form field without an `onChange` handler" | Añade `onChange`, o usa `defaultValue` si quieres un campo no controlado |
| El formulario recarga la página al enviar | `e.preventDefault()` al inicio del `handleSubmit` |
| Se pierden los demás campos al escribir en uno | Copia el estado: `{ ...values, [name]: value }`, no `{ [name]: value }` |
| El error se muestra nada más abrir el formulario | No valides al montar; espera a `blur`/`submit` y usa `touched` |
| Tras enviar, "recuerda" errores del intento anterior | En el reset limpia los tres: `setValues(initial)`, `setErrors({})`, `setTouched({})` |
| El input no se puede escribir | Seguramente lo dejaste "congelado": `value` sin `onChange` lo vuelve de solo lectura implícito |

Ejemplo del fallo típico de `values` perdidos:

```jsx
// MAL: borra todo lo demás
onChange={(e) => setValues({ [e.target.name]: e.target.value })}

// BIEN: preserva el resto del objeto
onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
```

---

## Conceptos clave

- Formulario controlado: el estado de React es la única fuente de verdad; cada input tiene `value` + `onChange`.
- Ventajas del controlado: validación en tiempo real, campos dependientes, reset fácil, tipado; desventaja: re-render por tecla (irrelevante en formularios normales).
- Formulario no controlado: el DOM guarda el valor; se lee con `ref` + `FormData` y el valor inicial es `defaultValue`.
- Cuándo no controlado: formularios simples e integraciones ajenas; validaciones complejas suelen ser más cómodas controladas.
- Patrón de validación: tres objetos — `values`, `errors`, `touched` — y una función pura `validate(values) → errors`.
- `handleChange` actualiza valores y re-valida solo si el campo ya está tocado.
- `handleBlur` marca el campo como tocado y valida, mostrando el error en línea.
- `handleSubmit` valida siempre, marca todos como tocados y solo envía si no hay errores.
- `touched` evita errores al abrir el formulario (mejor UX).
- Accesibilidad: `aria-invalid` y `aria-describedby` conectan el mensaje de error con el input.
- Reset completo: `setValues(initial)`, `setErrors({})`, `setTouched({})`.
- Referencia del proyecto: `../EJEMPLO_REACT_INTERMEDIO/src/components/FormularioValidado.jsx`.

---

## Autoevaluación

**1. ¿Por qué un formulario controlado re-renderiza en cada tecla y por qué normalmente no importa?**

<details>
<summary>Respuesta</summary>

Porque cada `onChange` llama a `setValues`/`setX`, y todo cambio de estado re-renderiza el componente. En formularios normales el coste es despreciable; solo importa en inputs "pesados", donde se puede validar en `blur` y guardar el estado al salir del campo.

</details>

**2. En el patrón `values`/`errors`/`touched`, ¿qué pasaría si quitaras `touched` y validaras en cada `change` desde el inicio?**

<details>
<summary>Respuesta</summary>

Al abrir el formulario aparecerían todos los errores ("Email obligatorio", "Mínimo 6 caracteres") antes de que el usuario escribiera nada: mala UX. `touched` retrasa los errores hasta que el campo es visitado, y aun así `handleSubmit` valida siempre como red de seguridad.

</details>

**3. ¿Cuándo decides enviar el formulario en `handleSubmit`? Menciona los dos pasos exactos.**

<details>
<summary>Respuesta</summary>

Primero `const errs = validate(values)` y `setErrors(errs)`; luego compruebas `Object.keys(errs).length === 0`. Solo si no hay claves de error envías; además marcas todos los campos en `touched` para que los errores pendientes se muestren.

</details>

**4. ¿Qué diferencia hay entre `value` y `defaultValue` en un `<input>`, y en qué tipo de formulario se usa cada uno?**

<details>
<summary>Respuesta</summary>

`value` + `onChange` crea un input controlado (React es la fuente de verdad). `defaultValue` pone un valor inicial en un input no controlado (el DOM guarda el valor); usar `value` sin `onChange` provoca el warning de React y el campo queda "congelado".

</details>
