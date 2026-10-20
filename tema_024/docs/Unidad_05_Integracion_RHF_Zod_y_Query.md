# Unidad 05 — Integración: RHF + Zod + TanStack Query
> 🧭 **Navegación:** [← Anterior: Unidad 04 — Zod: validación con esquemas](Unidad_04_Zod_validacion.md) · [Índice del tema](../README.md) · [🏁 Fin del curso →](../../README.md)

## Objetivos

Al terminar esta unidad podrás:

- Conectar un esquema Zod a React Hook Form con `zodResolver`.
- Enviar el formulario validado con `useMutation` de TanStack Query.
- Combinar los estados de envío (`isSubmitting`, `mut.isPending`) sin duplicarlos.
- Invalidar la lista de datos tras un create/update/delete.
- Reconocer el patrón completo "lectura con Query + escritura con RHF/Zod/Query" en el ejemplo del módulo.

## Requisitos

- [Unidad 01](Unidad_01_TanStack_Query_fundamentos.md), [02](Unidad_02_TanStack_Query_mutaciones.md),
  [03](Unidad_03_React_Hook_Form.md) y [04](Unidad_04_Zod_validacion.md).
- Ejemplo del módulo abierto: `EJEMPLO_QUERY_FORMS/`.

## La pieza que une RHF y Zod: zodResolver

`@hookform/resolvers` trae el adaptador oficial:

```bash
pnpm add @hookform/resolvers
```

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { esquemaPost, type DatosPost } from '../schemas/post'

const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
} = useForm<DatosPost>({
  resolver: zodResolver(esquemaPost),
  defaultValues: { title: '', body: '' },
})
```

Con esto, RHF delega la validación en el esquema Zod: los `errors.*.message`
salen de los `message` del esquema, y `handleSubmit` solo invoca tu callback si
el parseo pasó. **El formulario no tiene reglas duplicadas.**

## El flujo completo

```
submit → RHF valida (Zod) → si OK: tus datos tipados
       → mutation.mutate(datos) → API
       → onSuccess: invalidateQueries(lista) + reset()
       → onError: pintar mensaje (el form conserva lo escrito)
```

En el ejemplo del módulo (`src/components/FormularioPost.tsx`):

```tsx
const crear = useCrearPost()   // useMutation + invalidate ['posts']

const alEnviar = handleSubmit((datos) => {
  crear.mutate(datos, {
    onSuccess: () => reset(),
  })
})

<form onSubmit={alEnviar} noValidate>
  {/* register + errors + aria-invalid según el patrón de la Unidad 03 */}
  <button type="submit" disabled={isSubmitting || crear.isPending}>
    {crear.isPending ? 'Enviando…' : 'Crear post'}
  </button>
</form>
```

Puntos que unen las tres librerías:

1. **Tipos:** `DatosPost = z.infer<typeof esquemaPost>` alimenta `useForm<DatosPost>`
   y `crear.mutate(datos)` — un solo tipo en toda la cadena.
2. **Estados:** el botón considera `isSubmitting` (RHF) **y** `crear.isPending` (Query).
3. **Caché:** `useCrearPost` invalida `['posts']` en `onSuccess`; `ListaPosts`
   (useQuery de esa clave) se refresca sola.
4. **UX de error:** si la API falla, el formulario **no** se resetea (solo en
   `onSuccess`); el usuario corrige y reintenta con lo que ya escribió.

## Lista + detalle: Query del lado lectura

`ListaPosts` del ejemplo usa `usePosts()` (`useQuery(['posts'])`) con los
early-returns de la Unidad 01 y `useBorrarPost()` para el DELETE. Es el mismo
patrón que aplicarías a un CRUD real: una query por recurso, mutaciones que
invalidan sus claves.

## El patrón en una frase

> **Lee con `useQuery`, escribe con `useMutation`, valida con Zod dentro de RHF,
> y deja que `invalidateQueries` cierre el círculo.**

Cuando veas un CRUD moderno en una empresa (o en el proyecto final del roadmap),
probablemente sea este stack o un clon mental del mismo.

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| `resolver` y `rules` a la vez | Mezclaste validación nativa y Zod | Elige una: con `zodResolver`, las reglas van en el esquema |
| `datos` tipado pero sin campos extra del form | El tipo del form no coincide con el esquema | Deriva SIEMPRE el tipo del esquema (`z.infer`) |
| La lista no refresca tras crear | Falta invalidate en la mutación o clave mal escrita | Revisa `queryKey` idéntica entre query y invalidate |
| El form se limpia aunque la API falle | `reset()` en el hook global sin comprobar éxito | `reset()` solo en `onSuccess` de la llamada (o del hook) |
| `mutate` vs `mutateAsync` | `mutate` no devuelve promesa; `mutateAsync` sí | Usa `mutate` + callbacks; `mutateAsync` si necesitas `await` dentro de `handleSubmit` |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **`zodResolver`** | Adaptador que conecta un esquema Zod al motor de RHF |
| **Flujo híbrido** | Validación declarativa (Zod) + ciclo de vida de formulario (RHF) + caché remota (Query) |
| **Invalidación post-mutación** | `invalidateQueries` tras escritura para re-sincronizar listas |
| **Una fuente de verdad (tipos)** | `z.infer` alimenta formulario, mutación y, si quieres, la API |

## Autoevaluación

**1. ¿Dónde viven las reglas de validación del formulario con este stack?**

<details>
<summary>Respuesta</summary>

En el esquema Zod (`esquemaPost`). RHF solo orquesta; el resolver le pasa los
errores. No hay `rules={...}` en `register` ni validaciones ad-hoc en el
handler.

</details>

**2. La API devuelve 500 al crear. ¿Qué ve el usuario y qué pasa con el form?**

<details>
<summary>Respuesta</summary>

El estado `crear.isError` se activa (en el ejemplo, un `role="alert"` con el
mensaje). El formulario **conserva** los datos (el `reset()` solo corre en
`onSuccess`), para que pueda corregir o reintentar sin volver a escribir todo.

</details>

**3. ¿Por qué el botón combina `isSubmitting` y `mut.isPending`?**

<details>
<summary>Respuesta</summary>

Porque son fases distintas: `isSubmitting` cubre la validación y el handler de
RHF; `mut.isPending` cubre la petición de red de Query. Entre medias puede
haber un instante en que una esté en false y la otra aún no; el OR evita el
doble click en cualquier punto del flujo.

</details>

**4. En tres palabras, ¿cuál es el patrón del módulo?**

<details>
<summary>Respuesta</summary>

**Query lee, RHF+Zod escriben, invalidación sincroniza.** (Equivalente en
largo: `useQuery` para lectura, `useForm`+`zodResolver`+`useMutation` para
escritura, `invalidateQueries` para reconciliar el caché.)

</details>

**5. ¿Este patrón sirve en React Native?**

<details>
<summary>Respuesta</summary>

Sí: TanStack Query, RHF y Zod funcionan igual en Expo/React Native (la Unidad 04
del M16 habla de estado; aquí aplica la misma lógica de datos remotos). Solo
cambia la UI de los inputs (no hay `<form>` HTML nativo, pero RHF funciona con
componentes custom vía `Controller`).

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 04 — Zod: validación con esquemas](Unidad_04_Zod_validacion.md) · [Índice del tema](../README.md) · [🏁 Fin del curso →](../../README.md)
