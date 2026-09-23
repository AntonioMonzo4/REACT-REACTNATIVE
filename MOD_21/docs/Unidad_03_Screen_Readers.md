# Unidad 03 — Screen Readers y ARIA

## Objetivos

- Aplicar la **regla de oro del ARIA**: HTML nativo primero, `aria-*` solo para rellenar huecos.
- Elegir el atributo ARIA adecuado según el caso (etiquetas invisibles, live regions, nav activa…).
- Escribir `alt` de imágenes con criterio (informativa, decorativa, icono redundante).
- Marcar **errores de formulario** con `aria-invalid`, `aria-describedby` y `role="alert"` de forma que el lector de pantalla los anuncie.
- Probar manualmente con teclado, DevTools (árbol de accesibilidad) y un screen reader; opcionalmente con `eslint-plugin-jsx-a11y`.

## Requisitos

- Haber completado las **Unidades 01 y 02** (POUR, checklist y navegación por teclado).
- React M4–M15: formularios controlados (`label`, `id`, `onChange`), JSX condicional.
- Chrome con DevTools (pestaña Accessibility) y, si puedes, **VoiceOver** (macOS) o **NVDA** (Windows) instalado.
- Opcional: un ejemplo con formulario real para aplicar la sección de formularios.

## Regla de oro del ARIA

> Si existe un elemento HTML nativo que hace el trabajo, **úsalo**.
> `aria-*` solo rellena huecos.

ARIA (*Accessible Rich Internet Applications*) no inventa comportamiento: solo **describe** semántica extra para las tecnologías de asistencia cuando el HTML nativo no basta. El orden de decisión siempre es:

1. ¿Existe un elemento nativo que hace esto (`<button>`, `<a>`, `<label>`, `<nav>`, `<input>`…)? → **Úsalo**.
2. Si no, ¿puedo describirlo con un `role`/atributo ARIA mínimo? → Úsalo con cuidado.
3. ARIA mal usada es peor que nada: un `<div role="button">` sin teclado promete algo que no cumple.

## Tabla de atributos

| Atributo | Cuándo |
|----------|--------|
| `aria-label` | texto accesible invisible (icon-button) |
| `aria-labelledby` / `aria-describedby` | referencias a ids |
| `aria-live="polite"` | cambios asíncronos (toast, total) |
| `aria-live="assertive"` + `role="alert"` | errores urgentes |
| `aria-current="page"` | nav activa |
| `role="status"` | loading informativo |

```jsx
<button aria-label="Buscar">
  <IconLupa />
</button>

<p role="status" aria-live="polite">
  {cargando ? 'Cargando…' : `${n} resultados`}
</p>
```

Lectura de la tabla y de los ejemplos:

- **`aria-label`**: da un **nombre accesible invisible**. Clásico: un botón cuyo único contenido es un icono de lupa; sin `aria-label`, el lector de pantalla anuncia “botón” y nada más. Con `aria-label="Buscar"` anuncia “Buscar, botón”. Si el botón **ya tiene texto visible**, no repitas su versión en `aria-label` (pisaría/confundiría).
- **`aria-labelledby` / `aria-describedby`**: en vez de escribir el texto, **referencian `id`s** existentes. `labelledby` construye el nombre del elemento (útil para títulos de diálogos: `aria-labelledby="dlg-t"`); `describedby` añade una descripción secundaria (p. ej. ayuda de un campo).
- **`aria-live="polite"`**: el lector de pantalla espera a que haya silencio y **entonces anuncia** el cambio. Perfecto para resultados asíncronos, toasts informativos o un total que se actualiza: no interrumpe lo que se esté leyendo.
- **`aria-live="assertive"` + `role="alert"`**: **interrumpe** de inmediato. Reservado a errores urgentes (fallo de envío, campo inválido). `role="alert"` es en esencia un atajo para una live region assertiva.
- **`aria-current="page"`**: marca el enlace de la navegación que corresponde a la página actual (el lector lo anuncia como “página actual” en lugar de tener que adivinarlo por el estilo visual).
- **`role="status"`**: región viva educada para estados informativos; en el ejemplo anuncia el cambio entre “Cargando…” y “N resultados” sin ser agresivo.

## Imágenes

```jsx
<img alt="Gráfico de ventas 2024" />       // informativa
<img alt="" />                              // decorativa
// icon decorativo dentro de botón con texto: alt="" y no duplicar
```

Tres casos cubiertos:

1. **Imagen informativa** → `alt` describe el contenido o función: `alt="Gráfico de ventas 2024"`. Quien no vea la imagen recibe la misma información.
2. **Imagen decorativa** → `alt=""` (vacío, no se omite el atributo): el lector de pantalla la **ignora**. Un `alt="imagen123"` o `alt="decoración"` solo añade ruido.
3. **Icono decorativo dentro de un botón que ya tiene texto**: `alt=""` **y** no duplicar la información; el nombre accesible del botón ya lo da su texto. Si en cambio el botón **solo** tiene icono, ahí va `aria-label` (o `alt` si fuese `<img>` con el nombre del botón).

## Formularios

```jsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  required
  aria-invalid={!!error}
  aria-describedby={error ? 'email-err' : undefined}
/>
{error && <p id="email-err" role="alert">{error}</p>}
```

Cómo funciona cada pieza al navegar con un screen reader:

- `<label htmlFor="email">` + `id="email"`: **asocian** etiqueta y campo de verdad; al enfocar el input se anuncia “Email, campo de correo, obligatorio”. También hace que pinchar en el texto enfocar el campo (bonito para ratón y teclado).
- `aria-invalid={!!error}`: dice que el valor **actualmente no es válido**; los lectores lo anuncian al llegar al campo (y DevTools lo muestra).
- `aria-describedby={error ? 'email-err' : undefined}`: cuando hay error, **apunta al id** del párrafo de error para que se lea **junto** al campo, no suelto en otro sitio. Sin error, `undefined` elimina el atributo.
- `<p id="email-err" role="alert">` : al montarse con el error, `role="alert"` hace que se **anuncie de inmediato** (interrumpiendo), sin que la persona tenga que volver a recorrer el formulario.

## Prueba manual

1. Navegar **solo con teclado** una pantalla.
2. Chrome + **VoiceOver/NVDA** (o Accessibility Tree en DevTools).
3. ESLint: `eslint-plugin-jsx-a11y` (opcional pero recomendado).

Rutina sugerida:

1. **Teclado**: apaga (o ignora) el ratón y recorre la pantalla con Tab/Shift+Tab, Enter, Espacio, flechas y Escape. ¿Todo es alcanzable? ¿El foco siempre se ve? ¿Los modales no dejan escapar el foco?
2. **Screen reader**: en macOS activa VoiceOver (`Cmd` + `F5`), en Windows instala NVDA (gratuito) y recorre la pantalla escuchando: ¿los botones anuncian nombre y tipo? ¿los errores se anuncian solos? Si no quieres instalar nada, abre Chrome → DevTools → pestaña **Accessibility**: el **árbol de accesibilidad** (Accessibility Tree) muestra la semántica que verá el lector; busca nodos sin nombre o con rol equivocado.
3. **ESLint**: añade `eslint-plugin-jsx-a11y` y limpia los warnings en CI: te avisa de patrones como `onClick` en `div`, `alt` ausente o labels desvinculadas, **antes** de que llegue alguien a probarlo a mano.

## Errores comunes

- `aria-hidden="true"` en contenedor con botones enfocables.
- `aria-label` pisa el texto visible (confunde).
- Live region montada y desmontada → anuncios perdidos (mantener nodo).

Y por qué ocurren:

- **`aria-hidden="true"` en contenedor con botones enfocables**: oculta el subtree del árbol de accesibilidad, pero si dentro hay elementos **enfocables**, el foco del teclado puede entrar en algo que el lector “no ve”: la persona oye silencio mientras manipula un botón invisible para ella. Nunca combines `aria-hidden` con foco dentro (tampoco con `tabIndex ≥ 0`).
- **`aria-label` pisa el texto visible**: el nombre accesible lo define `aria-label` por encima del contenido; si el botón dice “Guardar cambios” en pantalla pero `aria-label="Guardar"`, el lector anuncia “Guardar” y eso **no coincide** con lo que ven los demás. Regla: `aria-label` solo cuando **no** hay texto visible adecuado.
- **Live region montada y desmontada → anuncios perdidos**: muchos lectores solo anuncian cambios **dentro de una región viva que ya existía** en el árbol; si creas el nodo con el mensaje en el mismo render y luego lo borras, el anuncio puede perderse. Mantén el nodo (con `role="alert"`/`aria-live`) montado y cambia **su contenido**.

## Conceptos clave

- **Regla de oro ARIA**: HTML nativo primero; `aria-*` solo rellena huecos.
- **`aria-label`**: nombre accesible invisible (icon-buttons); no pisar texto visible.
- **`aria-labelledby` / `aria-describedby`**: nombre/descripción por referencia a `id`s.
- **Live regions**: `aria-live="polite"` (espera turno) vs `"assertive"` + `role="alert"` (interrumpe, errores).
- **`aria-current="page"`**: enlace activo de la navegación.
- **`role="status"`**: estado informativo (loading, resultados).
- **`alt` informativo vs `alt=""` decorativo**: describir el contenido o ignorar la imagen; iconos redundantes con texto → `alt=""` sin duplicar.
- **Formularios accesibles**: `label htmlFor` + `id`, `aria-invalid`, `aria-describedby`, error con `role="alert"`.
- **Accessibility Tree (DevTools)**: la semántica que realmente ve un screen reader; útil para auditar sin instalar NVDA/VoiceOver.
- **`eslint-plugin-jsx-a11y`**: linter de accesibilidad para cazar errores comunes automáticamente.

## Autoevaluación

1. Tienes un botón con solo un icono de lupa. ¿Qué atributo le pones y qué pasa si el botón además ya tiene el texto “Buscar” visible?

<details><summary>Respuesta</summary>

Si **solo** tiene icono: `aria-label="Buscar"` para que el lector anuncie el nombre (si no, anuncia “botón” sin más). Si **ya tiene** el texto visible “Buscar”: no pongas `aria-label` (ni `alt` redundante); el texto visible ya es el nombre accesible y un `aria-label` distinto lo pisaría y confundiría.

</details>

2. Quieres anunciar “3 resultados” cuando termina una búsqueda, sin interrumpir a quien esté leyendo. ¿Qué usas?

<details><summary>Respuesta</summary>

Una región viva educada: `aria-live="polite"` (o `role="status"`) en un nodo que **permanezca montado** y cuyo contenido cambie a “3 resultados”. `polite` espera a que haya silencio para anunciar; usarías `assertive`/`role="alert"` solo para errores urgentes.

</details>

3. El error de tu formulario aparece y desaparece con cada render y “a veces el lector no lo dice”. ¿Qué dos errores clásicos puedes estar cometiendo?

<details><summary>Respuesta</summary>

(1) **Montar y desmontar la live region**: el mensaje va en un nodo que aparece/desaparece (`{error && ...}` crea/borra el `role="alert"`); conviene mantener el nodo y cambiar su contenido. (2) No conectar el error al campo: falta `aria-describedby` hacia el `id` del error (y `aria-invalid` en el input), así el lector no asocia el fallo con el campo concreto.

</details>

4. Un `div` decorativo envuelve botones y le has puesto `aria-hidden="true"`, pero Tab sigue entrando dentro. ¿Por qué es un problema y cómo se evita?

<details><summary>Respuesta</summary>

`aria-hidden="true"` oculta el subtree del árbol de accesibilidad, pero los botones siguen siendo **enfocables**: el foco entra en elementos que el lector de pantalla anuncia como inexistentes → silencio y desorientación. Evítalo: no pongas `aria-hidden` en contenedores con foco dentro; si necesitas ocultarlo visualmente/semanticamente, saca también esos elementos del orden de Tab o no uses `aria-hidden`.

</details>
