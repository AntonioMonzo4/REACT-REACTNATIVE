# Unidad 04 — Eventos

## Objetivos

- Entender qué son los **eventos** en React y que se pasan como **props a los elementos JSX** (`onClick`, `onChange`...).
- Diferenciar el nombre de evento en **camelCase** de su equivalente en HTML (`onclick` → `onClick`).
- Implementar `onClick`, `onChange` y ` onSubmit` con el ejemplo completo del curso (`handleClick`, `handleChange`, formulario con `preventDefault`).
- Conocer el **objeto evento `e`** y sus miembros más usados: `e.target.value` y `e.preventDefault()`.
- Elegir entre **manejadores inline** y **manejadores nombrados** según la situación.
- Explorar el catálogo de otros eventos frecuentes (`onMouseEnter`, `onKeyDown`, `onFocus`...) y saber dónde verlos comentados.

## Requisitos

- **U02 — Componentes:** saber crear componentes funcionales y componer JSX.
- **U03 — Props, children y map:** entender que **todo lo que pongas en una etiqueta JSX es una prop**, porque los eventos en React no son más que props cuyo valor es una función.

Si no te suena "las props se pasan con llaves", repasa la Unidad 03 antes de continuar: aquí vas a pasar funciones como props todo el rato.

## ¿Qué son los eventos en React?

Los eventos en React son una forma de manejar las interacciones del usuario con la interfaz (clic, teclado, envío de formulario...). Se pasan como **props** a los elementos JSX (`onClick`, `onChange`…).

En HTML clásico attaching handlers se hacía con atributos minúsculos:

```html
<button onclick="alert('hola')">Haz clic</button>
```

En React no se usa `onclick` (y de hecho React te avisaría). En su lugar, el evento es **una prop más del elemento JSX**, y su valor es **una función** de JavaScript:

```jsx
<button onClick={handleClick}>Haz clic</button>
```

Dos reglas que conviene memorizar desde el principio:

1. **camelCase:** `onClick`, `onChange`, `onSubmit`, `onMouseEnter`... (con mayúscula en la "C" de "Click", etc.).
2. **El valor es una función**, no una llamada: `onClick={handleClick}` (sin paréntesis) ejecuta la función **cuando ocurre el clic**; `onClick={handleClick()}` la ejecutaría **al pintar**, lo cual casi nunca quieres.

**Por qué importa:** todo lo que el usuario hace en la página es un evento. Sin eventos, React solo sirve para pintar pantallas estáticas; con ellos, la interfaz se vuelve interactiva: botones que reaccionan, inputs que actualizan estado, formularios que validan y envían.

## onClick, onChange, onSubmit

Estos son los tres eventos que usarás el 90 % del tiempo. Vamos con el ejemplo completo del curso:

```jsx
const Eventos = () => {
  const handleClick = () => {
    alert("Has hecho clic en el botón")
  }

  const handleChange = (e) => {
    console.log("Valor del input:", e.target.value)
  }

  return (
    <div>
      <button onClick={handleClick}>Haz clic aquí</button>
      <input type="text" onChange={handleChange} placeholder="Escribe algo..." />
    </div>
  )
}
```

Veamos línea a línea qué significa:

- `const Eventos = () => { ... }` es un componente funcional (en forma de arrow function).
- `handleClick` es una **función manejadora** (handler): no recibe parámetros porque para este clic no necesitamos información extra; solo queremos mostrar una alerta.
- `handleChange` recibe `e`, el **objeto evento**, del que leemos `e.target.value`: el elemento que disparó el evento (aquí el `<input>`) y su valor actual.
- `onClick={handleClick}` y `onChange={handleChange}`: pasamos la **referencia** a la función (sin ejecutarla). React la llamará en el momento adecuado.
- `onChange` en inputs de React se dispara **en cada cambio** de valor (cada tecla), por eso se usa para mantener un `state` siempre sincronizado con lo que escribe el usuario.

| Evento | Cuándo |
|--------|--------|
| `onClick` | Clic en un elemento |
| `onChange` | Cambia el valor de un input |
| `onSubmit` | Se envía un formulario (`e.preventDefault()` habitual) |

Más detalles de cada uno:

- **`onClick`**: botones, enlaces, tarjetas clicables... Cualquier elemento JSX puede llevarlo, no solo `<button>`.
- **`onChange`**: dispara la función con el evento; leemos `e.target.value` para saber qué hay ahora en el input y normalmente guardamos eso en un `setState`.
- **`onSubmit`**: va en el `<form>`, se dispara al pulsar el botón `type="submit"` o al pulsar Intro en un campo. Casi siempre lo primero que haces es `e.preventDefault()`.

### Formulario típico con `e.preventDefault()`

Formulario típico:

```jsx
<form onSubmit={(e) => { e.preventDefault(); /* ... */ }}>
  <input onChange={(e) => setNombre(e.target.value)} />
  <button type="submit">Enviar</button>
</form>
```

**¿Por qué `e.preventDefault()`?** En los formularios HTML "de toda la vida", enviar un formulario provoca un **envío nativo al servidor**, lo que en una app de una sola página (SPA) equivale a **recargar la página entera**: perderías el `state`, el scroll, todo. Al llamar a `e.preventDefault()` cancelas ese comportamiento por defecto y dejas que tu función continúe con la lógica que tú quieras (validar, guardar en un array, hacer un `fetch`...).

El patrón completo de un formulario controlado queda así:

1. El `<input>` tiene `value={...}` ligado al estado y `onChange` que actualiza ese estado.
2. El `<form>` tiene `onSubmit` que hace `e.preventDefault()` y luego procesa los datos.
3. El botón es `type="submit"` para poder enviar con Intro.

## Patrón de manejadores: inline vs nombrados

Tienes dos estilos para asignar la función del evento. Ambos son correctos y los verás en el código del curso.

**Manejador nombrado** (declarado antes del `return`):

```jsx
const handleClick = () => {
  alert("Has hecho clic en el botón")
}

return <button onClick={handleClick}>Haz clic aquí</button>
```

**Ventaja:** legibilidad, reutilización (el mismo handler puede usarse en varios botones) y depuración más cómoda (pones un `debugger` o `console.log` en un sitio fijo).

**Manejador inline** (la función se escribe directamente en la prop):

```jsx
<form onSubmit={(e) => { e.preventDefault(); /* ... */ }}>
  ...
</form>
```

**Ventaja:** ideal para lógica de una sola línea, especialmente en formularios y cuando necesitas pasarle un argumento concreto en ese momento, por ejemplo:

```jsx
<button onClick={() => borrarGuitar(guitar.id)}>X</button>
```

Ojo con ese último ejemplo: si escribieras `onClick={borrarGuitar(guitar.id)}` (con paréntesis), llamarías a la función **al pintar** el botón. La flecha `() => ...` pospone la llamada hasta el clic.

| Estilo | Cuándo usarlo |
|--------|----------------|
| Nombrado (`onClick={handleClick}`) | Lógica media/larga, varios usos, quieras nombrarla |
| Inline (`onClick={() => ...}`) | Una línea, necesidad de pasar argumentos, `preventDefault` en formularios |

## El objeto evento `e`

Cuando React invoca tu manejador, en muchos eventos te entrega un **objeto evento** (el parámetro `e`, a veces llamado `event`). Es el mismo concepto que en el DOM nativo, con la ventaja de que React hace un **parcheo cross-browser** (normaliza diferencias entre navegadores por ti).

Los dos miembros que más usarás al principio:

- **`e.target`**: el elemento DOM que disparó el evento (el `<input>`, el `<button>`...).
- **`e.target.value`**: el valor actual de ese elemento. Clásico de los inputs: `handleChange` del ejemplo lo usa para imprimir lo que escribes.
- **`e.preventDefault()`**: cancela el comportamiento por defecto del navegador (envío de formulario, navegación de un enlace...). Imprescindible en `onSubmit`.

Otros miembros verás según avances: `e.currentTarget`, `e.preventDefault()`, `e.stopPropagation()`, `e.key` (teclado), `e.type`... pero con `target.value` y `preventDefault` cubres el inicio del curso.

## Catálogo de otros eventos

Además de los tres grandes, React expone casi todos los eventos del DOM con notación camelCase. Los más frecuentes:

`onMouseEnter`, `onMouseLeave`, `onKeyDown`, `onKeyUp`, `onFocus`, `onBlur`, `onDoubleClick`, `onContextMenu`, `onDrag`, `onDrop`, `onScroll`, `onLoad`, `onError`, `onInput`, `onSelect`, `onReset`.

Cómo leerlos de un vistazo:

| Evento | Cuándo se dispara |
|--------|-------------------|
| `onMouseEnter` / `onMouseLeave` | El puntero entra o sale del elemento (ideal para tooltips/menús) |
| `onDoubleClick` | Doble clic |
| `onContextMenu` | Clic derecho |
| `onKeyDown` / `onKeyUp` | Se presiona o se suelta una tecla |
| `onFocus` / `onBlur` | El input recibe o pierde el foco |
| `onInput` | Cada cambio de valor del input (similar a `onChange` en la práctica) |
| `onSelect` | Selección de texto o de una opción |
| `onReset` | Se pulsa un botón `type="reset"` de formulario |
| `onScroll` | Se hace scroll en el elemento |
| `onLoad` / `onError` | Termina de cargar (imagen, script...) o falla |
| `onDrag` / `onDrop` | Interacción de arrastrar y soltar |

**Patrón:** **camelCase** + función manejadora (inline o nombrada). El evento (`e`) expone `e.target.value`, `e.preventDefault()`, etc.

No hace falta memorizarlos todos de golpe: sabes que existen, los miras en la tabla cuando los necesitas, y los practicas abriendo el archivo del ejemplo.

## En el ejemplo

[`Eventos.jsx`](../EJEMPLO_REACT/src/components/Eventos.jsx) — catálogo completo en comentarios.

Ábrelo: encontrarás los manejadores `handleClick` y `handleChange` del ejemplo de esta unidad, el formulario con `preventDefault` y comentarios con el resto de eventos (ratón, teclado, foco...) listos para probar modificando el archivo.

## Errores comunes

**1. Ejecutar la función en lugar de pasar su referencia**

```jsx
// ❌ Mal: llama a handleClick al PINTAR el botón (y no en cada clic)
<button onClick={handleClick()}>X</button>

// ✅ Bien: pasa la referencia; React la llama cuando ocurre el clic
<button onClick={handleClick}>X</button>

// ✅ También bien: arrow inline para pasarle argumentos
<button onClick={() => handleDelete(id)}>X</button>
```

Solución: quita los paréntesis al asignar el handler. Si necesitas argumentos, envuélvelo en una arrow function `() => fn(args)`.

**2. Olvidar `e.preventDefault()` en el submit del formulario**

```jsx
// ❌ Mal: el navegador envía el formulario y RECARGA la página
<form onSubmit={(e) => { guardarDatos() }}>
  ...
</form>

// ✅ Bien: cancelas el envío nativo y continúas tú
<form onSubmit={(e) => { e.preventDefault(); guardarDatos() }}>
  ...
</form>
```

Solución: la primera línea de casi todo `onSubmit` debe ser `e.preventDefault()` si no quieres recargar.

**3. Usar nombres de evento en minúsculas (estilo HTML clásico)**

```jsx
// ❌ Mal: React no reconoce onclick/onchange como props de evento
<button onclick={handleClick}>X</button>

// ✅ Bien: camelCase
<button onClick={handleClick}>X</button>
```

Solución: todos los eventos React van en camelCase: `onClick`, `onChange`, `onSubmit`, `onMouseEnter`...

**4. Acceder a `e.target.value` sin recibir `e`**

```jsx
// ❌ Mal: e no está definida en handleChange
const handleChange = () => {
  console.log(e.target.value)
}

// ✅ Bien: declara el parámetro e en la firma
const handleChange = (e) => {
  console.log(e.target.value)
}
```

Solución: si dentro del manejador usas `e`, decláralo como parámetro: `const handler = (e) => { ... }`.

**5. Esperar que `onChange` se dispare una sola vez como en el DOM clásico**

```jsx
// En React, onChange se dispara en CADA tecla en inputs
// Si quieres algo al salir del campo, usa onBlur:
<input onChange={handleChange} onBlur={handleBlur} />
```

Solución: recuerda que en inputs controlados `onChange` va tecla a tecla (para mantener el state sincronizado); para validaciones "al terminar de escribir" usa `onBlur` o envía con `onSubmit`.

## Conceptos clave

- **Eventos = props de elementos JSX**: su valor es una función que React invoca cuando ocurre la interacción.
- **camelCase obligatorio**: `onClick`, `onChange`, `onSubmit`, `onMouseEnter`... (no `onclick`).
- **Referencia sin ejecutar**: `onClick={handleClick}` ejecuta en el evento; `onClick={handleClick()}` ejecuta al pintar (error típico).
- **`handleClick` / `handleChange`**: manejadores nombrados; también existen los **inline** (`onClick={() => ...}`) para lógica corta o con argumentos.
- **`onSubmit` + `e.preventDefault()`**: evita la **recarga de página** del envío nativo del formulario.
- **Objeto evento `e`**: `e.target.value` lee el valor del input; `e.preventDefault()` cancela el comportamiento por defecto; React normaliza diferencias entre navegadores.
- **`onChange` en React** se dispara en cada cambio de valor (tecla a tecla) en inputs.
- **Catálogo extra**: `onMouseEnter`, `onMouseLeave`, `onKeyDown`, `onFocus`, `onBlur`, `onDoubleClick`, `onScroll`, `onLoad`... (ver tabla).
- Ejemplo del curso: [`Eventos.jsx`](../EJEMPLO_REACT/src/components/Eventos.jsx).

## Autoevaluación

**1. ¿Por qué en React los eventos escriben en camelCase y qué relación tienen con las props?**

<details>
<summary>Respuesta</summary>

Porque en React `onClick` etc. son **props** de los elementos JSX, y en JavaScript las props/atributos JSX siguen notación camelCase (`onClick` distingue "on" de "Click"). No son atributos HTML minúsculos (`onclick`): React los interpreta como la prop `onClick` cuyo valor debe ser una función. Si escribes `onclick` en JSX, React no lo trata como evento y te mostrará un aviso en consola.

</details>

**2. Explica la diferencia entre `onClick={handleClick}` y `onClick={handleClick()}`. ¿Cuál quieres normalmente?**

<details>
<summary>Respuesta</summary>

`onClick={handleClick}` guarda la **referencia** a la función: React la ejecuta únicamente cuando ocurre el clic. `onClick={handleClick()}` **llama** a la función en ese momento, es decir, al evaluar el JSX durante el render: la alerta saldría al pintar el componente y el clic no haría nada más. Normalmente quieres la primera (referencia). Para pasar argumentos se usa una arrow: `onClick={() => handleClick(id)}`.

</details>

**3. ¿Por qué un formulario necesita `e.preventDefault()` en `onSubmit`?**

<details>
<summary>Respuesta</summary>

Porque el comportamiento por defecto del navegador ante el envío de un `<form>` es hacer una petición al servidor y **recargar la página**, lo que haría perder el `state` de React y el resto de la interfaz. `e.preventDefault()` cancela ese envío nativo y permite que tu manejador continúe con la lógica de la app (validar, guardar en estado, hacer un `fetch`...).

</details>

**4. En `const handleChange = (e) => { console.log("Valor:", e.target.value) }`, ¿qué representa `e`, `e.target` y `e.target.value`?**

<details>
<summary>Respuesta</summary>

`e` es el **objeto evento** que React entrega al manejador (normalizado respecto al DOM nativo). `e.target` es el **elemento que disparó** el evento, en este caso el `<input>`. `e.target.value` es el **valor actual** de ese input, es decir, lo que el usuario ha escrito hasta ese momento; es lo que se guarda típicamente con `setNombre(...)` en un input controlado.

</details>
