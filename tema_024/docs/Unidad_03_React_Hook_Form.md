# Unidad 03 — React Hook Form
> 🧭 **Navegación:** [← Anterior: Unidad 02 — TanStack Query: mutaciones (useMutation)](Unidad_02_TanStack_Query_mutaciones.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 04 — Zod: validación con esquemas →](Unidad_04_Zod_validacion.md)

## Objetivos

Al terminar esta unidad podrás:

- Explicar por qué re-renderizar por cada tecla (estado controlado puro) es un problema en formularios grandes.
- Montar un formulario con `useForm`, `register`, `handleSubmit` y `watch`.
- Leer y mostrar errores de `formState.errors`.
- Trabajar con campos controlados cuando hace falta (`Controller` o `setValue`).
- Resetear el formulario y manejar envíos asíncronos.

## Requisitos

- Formularios controlados con `useState` vistos en M5.
- TypeScript del camino (M14): el ejemplo usa tipos en los formularios.

## El problema de los formularios "a mano"

Un formulario con 10 campos y `useState` por campo re-renderiza el formulario
completo en **cada pulsación de tecla**. Con validación y componentes pesados
alrededor, se nota. **React Hook Form** (RHF) adopta el patrón *uncontrolled
con referencias*: lee los valores del DOM vía refs, suscribe solo a los campos
que lo necesitan y ejecuta la validación en eventos, no en cada render.

> No reescribas el curso M5: RHF es la evolución de esos patrones para
> formularios medianos/grandes; los conceptos (controlado, validación, errores
> accesibles) son los mismos.

## Instalación y useForm

```bash
pnpm add react-hook-form
```

```tsx
import { useForm } from 'react-hook-form'

type Datos = { title: string; body: string }

export function FormularioPost() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Datos>({
    defaultValues: { title: '', body: '' },
  })

  const alEnviar = handleSubmit((datos) => {
    // `datos` solo existe si la validación pasó (aquí sin resolver aún)
    console.log(datos)
    reset()
  })

  return (
    <form onSubmit={alEnviar} noValidate>
      <input {...register('title')} />
      {errors.title && <span role="alert">{errors.title.message}</span>}
      <button type="submit" disabled={isSubmitting}>Enviar</button>
    </form>
  )
}
```

Piezas clave:

| Pieza | Función |
|-------|---------|
| `useForm<T>()` | Crea la instancia del formulario tipada con `T` |
| `register('campo')` | Devuelve props (`name`, `ref`, `onChange`…) para inputs; se expande con `...` |
| `handleSubmit(fn)` | Envuelve el `onSubmit`: valida y solo llama a `fn` si todo pasa |
| `formState.errors` | Objeto de errores por campo (`errors.title?.message`) |
| `formState.isSubmitting` | true mientras el handler es async (evitar doble submit) |
| `reset()` | Vuelve a `defaultValues` y limpia errores |
| `watch('campo')` | Suscribirse al valor de un campo (re-render selectivo) |

## Validación nativa de RHF

RHF valida con reglas en `register` (patrón HTML):

```tsx
register('title', {
  required: 'El título es obligatorio',
  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
  maxLength: 80,
})
```

Esto está bien para reglas simples. En producción, para esquemas complejos se
usa un validador externo como **Zod** (siguiente unidad y [Unidad 05](Unidad_05_Integracion_RHF_Zod_y_Query.md)).

## Errores accesibles (sí, otra vez aria)

Como en M5/M21, un error de campo debe ser legible por screen readers:

```tsx
<input
  id="title"
  aria-invalid={errors.title ? 'true' : 'false'}
  aria-describedby={errors.title ? 'title-error' : undefined}
  {...register('title')}
/>
{errors.title && (
  <span id="title-error" className="error-campo">
    {errors.title.message}
  </span>
)}
```

`aria-invalid` permite estilos rojos; `aria-describedby` enlaza el texto del
error al campo. El ejemplo del módulo lo implementa así.

## Campos controlados: Controller

Algunos inputs (select de librerías, date pickers, sliders, editor rico) no
admiten `register` directo. Usa `Controller`:

```tsx
import { Controller, useForm } from 'react-hook-form'

const { control } = useForm<{ categoria: string }>()

<Controller
  name="categoria"
  control={control}
  rules={{ required: 'Elige una categoría' }}
  render={({ field, fieldState }) => (
    <>
      <select {...field}>
        <option value="herramientas">Herramientas</option>
        <option value="accesorios">Accesorios</option>
      </select>
      {fieldState.error && <span role="alert">{fieldState.error.message}</span>}
    </>
  )}
/>
```

`field` trae `value`, `onChange`, `onBlur` y `name`: reconecta el controlado con
el motor de RHF.

## Envío asíncrono y estados

```tsx
const alEnviar = handleSubmit(async (datos) => {
  await crearPost(datos)   // lanzará si falla; RHF no traga el throw
  reset()
})
```

`isSubmitting` se pone true mientras la promesa está en vuello (desactiva el
botón). Para integrarlo con `useMutation` de Query, ver la Unidad 05: ahí el
`mutationFn` es la llamada de red y los estados se combinan.

## setValue y getValues (uso puntual)

```tsx
const { setValue, getValues } = useForm<Datos>()

setValue('title', 'Valor programático')
const actual = getValues('title')
```

Útil para botones "rellenar ejemplo", sincronizar desde fuera o formularios en
varios pasos. No lo uses para管控 cada tecla: eso es `watch`/`Controller`.

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| El formulario recarga la página | Falta `e.preventDefault()` | Usa `handleSubmit` de RHF como `onSubmit`; él se encarga |
| `errors.title` siempre undefined | No pasaste reglas ni resolver | Añade `rules` en `register` o conecta Zod con `zodResolver` |
| El valor se "pierde" al re-render | Mezclaste `value=` manual sin `Controller` | No pongas `value` hardcodeado con `register`; usa `Controller` o deja RHF controlar el DOM |
| Doble envío | Botón no deshabilitado | `disabled={isSubmitting}` |
| Tipos de `data` no cuadran | `useForm()` sin genérico | `useForm<Datos>({ resolver })` |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **React Hook Form** | Librería de formularios enfocada en rendimiento (refs, validación por evento) |
| **`register`** | Conecta un input nativo al motor de RHF |
| **`handleSubmit`** | Valida y ejecuta el handler solo si no hay errores |
| **`formState.errors`** | Errores por campo, listos para pintar |
| **`Controller`** | Puente para componentes controlados por RHF |
| **`isSubmitting`** | Estado de envío en curso (async) |

## Autoevaluación

**1. ¿Por qué RHF es más rápido que 10 `useState` en un formulario grande?**

<details>
<summary>Respuesta</summary>

Porque no re-renderiza el formulario completo en cada tecla: lee valores vía
refs del DOM y solo se suscribe (con `watch`/`Controller`) a lo que el UI
necesita. La validación corre en `submit`/`blur`, no en cada cambio.

</details>

**2. ¿Qué hago si mi componente de UI no admite `register`?**

<details>
<summary>Respuesta</summary>

`Controller`: RHF te pasa `value`/`onChange`/`onBlur` en el render-prop y tú los
conectas al componente controlado, manteniendo errores y validación en el
motor de RHF.

</details>

**3. ¿Dónde pongo el `preventDefault`?**

<details>
<summary>Respuesta</summary>

En ningún sitio si usas `handleSubmit` de RHF como `onSubmit` del `<form>`: él
previene el envío nativo y valida antes de llamar a tu handler.

</details>

**4. ¿Cómo evito el doble clic en "Enviar"?**

<details>
<summary>Respuesta</summary>

`disabled={formState.isSubmitting}` en el botón. `isSubmitting` es true desde
que se invoca `handleSubmit` hasta que la promesa del handler termina.

</details>

**5. ¿RHF hace lo mismo que Zod?**

<details>
<summary>Respuesta</summary>

No del todo. RHF orquesta el formulario (estado, submit, errores por campo);
Zod valida esquemas de datos con un schema declarativo. Se combinan con
`zodResolver` (Unidad 04/05): el schema manda en las reglas, RHF en el ciclo de
vida del formulario.

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 02 — TanStack Query: mutaciones (useMutation)](Unidad_02_TanStack_Query_mutaciones.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 04 — Zod: validación con esquemas →](Unidad_04_Zod_validacion.md)
