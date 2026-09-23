# Unidad 03 — Props, children y listas con `map`

## Objetivos

- Entender qué son las **props** y compararlas con los argumentos de una función y con los atributos de HTML.
- Aprender la sintaxis de las props: objeto `props`, desestructuración en los parámetros (recomendada) y desestructuración en el cuerpo.
- Dominar las 3 variantes de acceso a las props del curso (`props.title`, `({ title, description })`, `const { title } = props`).
- Comprender la **inmutabilidad** de las props: el componente padre decide los valores, el hijo solo los lee.
- Usar la prop especial **`children`** para enviar contenido entre etiquetas (ejemplo con `Card`).
- Generar **listas con `map`** y entender por qué cada elemento necesita una `key` única (ejemplo con guitarras).

## Requisitos

- **U01 — Qué es React:** haber entendido qué es un componente y cómo se renderiza JSX.
- **U02 — Componentes:** saber crear y usar componentes propios (por ejemplo `Header`) y pasarles datos desde un componente padre como `App.jsx`.

Si aún no has creado tu primer componente, vuelve a la Unidad 02 antes de continuar: en esta unidad todo gira alrededor de **enviar datos de un componente a otro**.

## ¿Qué son las props?

Imagina una función normal de JavaScript:

```javascript
function saludar(nombre, edad) {
  console.log(`Hola ${nombre}, tienes ${edad} años`)
}

saludar("Ana", 25)
```

Aquí `nombre` y `edad` son **argumentos**: la función no decide sus valores, se los da quien la llama. Las **props** (propiedades) funcionan exactamente igual en React: son la manera que tiene un componente de **recibir datos de quien lo usa**.

Otra analogía útil son los **atributos de HTML**. En HTML puro escribirías:

```html
<img src="guitarra.jpg" alt="Guitarra" width="300" />
```

En React, al usar un componente propio, las "etiquetas" que escribes son en realidad **llamadas a una función**, así que sus atributos se escriben como props:

```jsx
<Header titulo="Mi tienda" destacado={true} />
```

**Por qué importa:** sin props, todos los componentes serían islas que solo pueden mostrar datos fijos escritos dentro de ellos. Con las props, un mismo componente (`Card`, `Header`, `Boton`...) puede reutilizarse con informaciones distintas en distintas partes de la pantalla. El componente **describe cómo se ve**; el padre decide **qué muestra** en cada ocasión.

## Sintaxis de props

En la función debemos indicar el objeto parámetro `props`. Cada prop que pongas en la etiqueta llega como una **propiedad** de ese objeto:

```jsx
function Header({ nombreDelProp, price }) {
  // ...
}
```

```jsx
<Header
  nombreDelProp={datos}      // datos, state o funciones
  price={99.9}
/>
```

Fíjate en un detalle importante: dentro de `nombreDelProp={...}` usamos **llaves de JavaScript**, no comillas. Las comillas (`"..."`) son para texto literal (`<Header titulo="Hola" />`), y las llaves (`{...}`) permiten enviar variables, números, booleanos, objetos, arrays e incluso funciones.

### Variantes de acceso (ejemplo del curso)

Hay tres maneras de leer las props dentro de un componente. Todas son válidas, pero conviene conocerlas porque las verás en los tres estilos:

1. `props.title` — acceso por punto sobre el objeto completo.
2. **Desestructuración en los parámetros**: `({ title, description })` — **recomendada**: es la más limpia y la que usaremos en el curso.
3. Desestructuración en el cuerpo: `const { title, description } = props`.

Veámoslas con el mismo ejemplo:

```jsx
// 1) Acceso por punto: llega "props" entero y se navega con .
function Tarjeta1(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </article>
  )
}

// 2) Desestructuración en los parámetros (RECOMENDADA):
// se extraen las props en la propia firma de la función.
function Tarjeta2({ title, description }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}

// 3) Desestructuración en el cuerpo:
// llega "props" y luego se extraen las variables que interesan.
function Tarjeta3(props) {
  const { title, description } = props
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}
```

Y así se usaría cualquiera de las tres desde el padre:

```jsx
<Tarjeta2
  title="Guitarra acústica"
  description="Ideal para empezar"
/>
```

**Por qué se recomienda la opción 2:** de un vistazo ves en la primera línea qué datos necesita el componente, sin tener que desplazarte hasta el `return` ni preguntarte qué contiene `props`.

## Inmutabilidad de props: el padre decide

Las props son **inmutables** desde el punto de vista del hijo: no se modifican dentro del componente que las recibe. Piénsalo como una **carta que llega ya escrita**: el hijo puede leerla, mostrarla, combinarla con otras cosas... pero no reescribir el original. Si el contenido necesita cambiar, **quien decide es el padre**, que volverá a enviar una prop nueva (normalmente moviendo un `state` hacia arriba y pasándolo como prop).

Esto evita efectos secundarios sorprendentes: si cualquier hijo pudiera alterar los datos que le llegaron, dos componentes podrían "pelearse" por el mismo valor sin que nadie supiera quién lo cambió. La regla mental es sencilla:

> **Los datos bajan (props hacia abajo), los eventos suben (callbacks hacia arriba).**

## `children`: contenido entre etiquetas

Hay una prop especial llamada `children`. No la escribes tú en la etiqueta: React la rellena con **todo lo que coloques entre la etiqueta de apertura y la de cierre** del componente.

```jsx
<Card>
  <p>Texto embebido</p>
</Card>
// en Card: {children}
```

Dentro de `Card` bastaría con renderizarla donde quieras el contenido:

```jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  )
}
```

Así `Card` se convierte en un **contenedor genérico**: alguien puede meterle un párrafo, una imagen, un formulario o medio árbol de componentes, y `Card` solo se preocupa del marco (borde, padding, fondo...). Es la misma idea que un `<div>` de HTML: no le importa qué lleve dentro.

**Por qué importa:** `children` te permite componer interfaces sin tener que predefinir todas las combinaciones posibles de contenido en las props.

## `key` en listas

`key` es una prop **especial** de React: la extrae del objeto props y el componente hijo **no** la recibe. Es decir, aunque escribas `key={guitar.id}`, dentro de `GuitarraItem` no podrás hacer destructuring de `key` porque React la "consume" antes de que el hijo la vea.

¿Para qué sirve? Cuando React repinta una lista, necesita **identificar qué elemento es cuál** entre el render anterior y el nuevo. Sin una `key`, React compara por **posición**: si insertas un elemento al principio, React puede acabar recreando todos los nodos (y perdiendo estados locales) en lugar de mover uno. Con una `key` estable compara por **identidad**: "el elemento con id=3 sigue siendo el id=3, solo ha cambiado de sitio".

Por eso cada `key` debe ser **única dentro de su lista** (normalmente el `id` del recurso que viene de la API o del estado). Si usas el índice del array como `key` y luego reordenas o borras elementos, React vuelve a tener problemas de identidad: es un antipatrón que solo "funciona" si la lista nunca cambia de orden ni se le insertan cosas en medio.

| `key` usada | ¿Funciona? | Cuándo usarla |
|-------------|------------|----------------|
| `id` del recurso | ✅ Sí | Lista normal (la mayoría de casos) |
| Índice del array (`index`) | ⚠️ Solo si la lista es estática | Último recurso, nunca si reordenas/borras |
| Ninguna | ❌ React avisa en consola | Nunca |

## Iterar con `map`

Para iterar vamos a usar `map`. Esto se incluye en el **elemento padre**: recorre el array, y por cada elemento devuelve una pieza de JSX. React recibe un array de elementos y los pinta en orden.

```jsx
<ul>
  {data.map((guitar) => (
    <li key={guitar.id}>
      {guitar.name} - {guitar.price}
    </li>
  ))}
</ul>
```

Desglosemos esa línea, porque es el patrón que usarás decenas de veces:

- `data` es el array que queremos iterar (objetos, respuesta de una API, `state`...).
- `.map((guitar) => (...))` recorre cada guitarra y **devuelve JSX** por cada una. Dentro de la flecha, `guitar` es el objeto actual (`{ id, name, price, ... }`).
- Si especificamos un elemento JSX (`li`, `article`...), este se actualizará en función de los datos con los **props**: `{guitar.name}` y `{guitar.price}` son datos del objeto actual renderizados dentro del hijo.
- **Importante:** cada elemento de la lista necesita una prop `key` única (normalmente el `id` del recurso) para que React identifique los cambios.

`map` no pinta nada por sí solo: **transforma** un array de datos en un array de JSX. Ese array es lo que va entre `{ }` de la `<ul>`, y React lo convierte en nodos reales del DOM.

¿De dónde sale `data`? En el curso verás dos orígenes principales:

1. **Estado local** (`useState`): por ejemplo `const [guitarras, setGuitarras] = useState([])` y luego `guitarras.map(...)`.
2. **Respuesta de una API**: haces un `fetch`, guardas el JSON en el estado y lo iteras con `map`.

En ambos casos el flujo es el mismo: **datos → `map` → array de JSX con `key` → pintado en pantalla**.

## En el ejemplo

- [`Props.jsx`](../EJEMPLO_REACT/src/components/Props.jsx) — 3 variantes + nota de `key`.
- [`App.jsx`](../EJEMPLO_REACT/src/App.jsx) — `<Props title="..." description="..." />`.

Ábrelos y observa cómo `App.jsx` actúa como **padre**: decide qué `title` y qué `description` le llegan al componente `Props`, y cómo dentro de `Props.jsx` esas mismas props se leen de las tres maneras explicadas arriba.

## Errores comunes

**1. Escribir el nombre de la prop con comillas en lugar de llaves**

```jsx
// ❌ Mal: llega el texto literal "{datos}", no la variable
<Header titulo="{datos}" />

// ✅ Bien: llaves de JS para evaluar la expresión
<Header titulo={datos} />
```

Solución: usa comillas solo para strings fijos (`"Hola"`) y llaves `{}` para todo lo demás (variables, números, booleanos, expresiones).

**2. Intentar modificar una prop dentro del hijo**

```jsx
// ❌ Mal: las props son inmutables
function Header({ titulo }) {
  titulo = "Otro título" // no hagas esto
  return <h1>{titulo}</h1>
}

// ✅ Bien: el padre cambia el dato y vuelve a enviarlo
// (en el padre: const [titulo, setTitulo] = useState("..."))
<Header titulo={titulo} />
```

Solución: si el valor debe cambiar, eleva el estado al padre y pásalo como prop; si el hijo necesita avisar, pásale una función (`onClick={...}`) como prop.

**3. Olvidar la `key` al mapear una lista**

```jsx
// ❌ Mal: React avisa "Each child in a list should have a unique key"
{guitarras.map((g) => <li>{g.name}</li>)}

// ✅ Bien: key única, normalmente el id
{guitarras.map((g) => <li key={g.id}>{g.name}</li>)}
```

Solución: añade `key={elemento.id}` a cada hijo devuelto por `map`. Nunca uses `Math.random()` ni valores que cambien en cada render como `key`.

**4. Desestructurar una prop que no existe**

```jsx
// ❌ Mal: la prop se llama "title", no "titulo"
function Nota({ title }) {
  return <h2>{title}</h2> // undefined si envías titulo=...
}

// ✅ Bien: nombres coincidentes entre quien envía y quien recibe
<Nota title="Hola" />
```

Solución: revisa que los nombres en la etiqueta del padre coincidan exactamente (respetando mayúsculas) con los del desestructurado del hijo.

**5. Poner `key` en el componente que recibe `children` esperando usarla dentro**

```jsx
// ❌ Mal: React extrae key, el hijo no la ve
function Card({ children, key }) {
  console.log(key) // undefined
}

// ✅ Bien: si el hijo necesita ese identificador, pásalo como prop normal
<Card cardId={guitar.id}>{contenido}</Card>
```

Solución: `key` es solo para React. Para comunicar el id al hijo, usa otro nombre de prop (`id`, `cardId`...).

## Conceptos clave

- **Props**: datos que un componente recibe de quien lo usa; equivalentes a los argumentos de una función y a los atributos de HTML.
- **Sintaxis en la etiqueta**: `prop={valor}` con llaves para JS, comillas solo para texto literal.
- **3 variantes de acceso**: `props.title`, desestructuración en parámetros `({ title, description })` (**recomendada**) y desestructuración en cuerpo `const { title } = props`.
- **Inmutabilidad**: el hijo no modifica las props; **el padre decide** los valores.
- **`children`**: prop especial con el contenido entre las etiquetas de apertura y cierre; permite componentes contenedor genéricos (ej. `Card`).
- **`key`**: prop especial que React extrae del objeto props; **el hijo no la recibe**; debe ser única por lista para que React identifique cambios.
- **`map`**: transforma un array de datos en un array de JSX; se escribe en el componente padre dentro de `{ }`.
- **Flujo de datos unidireccional**: los datos bajan como props, los callbacks suben hacia el padre.
- Ejemplos del curso: [`Props.jsx`](../EJEMPLO_REACT/src/components/Props.jsx) y [`App.jsx`](../EJEMPLO_REACT/src/App.jsx).

## Autoevaluación

**1. Si escribo `<Header nombreDelProp={datos} price={99.9} />`, ¿cómo llegan `datos` y `99.9` al componente `Header`?**

<details>
<summary>Respuesta</summary>

Llegan como propiedades del objeto `props` que React crea y pasa como primer argumento a la función `Header`. Puedes leerlas con `props.nombreDelProp` y `props.price`, o desestructurarlas en los parámetros: `function Header({ nombreDelProp, price })`. El valor `datos` puede ser cualquier cosa válida en JS (variable, state, función...) porque está entre llaves; `99.9` es un número literal.

</details>

**2. ¿Puede un componente cambiar el valor de una prop que ha recibido? ¿Y qué hace falta para que ese valor cambie?**

<details>
<summary>Respuesta</summary>

No. Las props son inmutables desde el hijo: solo se leen. Para que el valor cambie, el **componente padre** debe ser quien actualice el dato (por ejemplo con `setTitulo(...)` si vive en un `useState` del padre) y volver a renderizar pasando la prop nueva al hijo. Si el hijo necesita notificar algo al padre, se le pasa una función como prop y se invoca desde el hijo.

</details>

**3. ¿Qué es `children` y qué ventaja aporta usarlo en `Card`?**

<details>
<summary>Respuesta</summary>

`children` es la prop especial donde React coloca todo lo que escribimos entre `<Card>` y `</Card>`. Permite que `Card` sea un contenedor genérico: quien la usa decide si lleva un `<p>`, una imagen, un formulario u otros componentes, mientras `Card` solo se encarga del marco (estilos, estructura). Es la misma idea que un `<div>` de HTML.

</details>

**4. Al hacer `data.map((guitar) => <li key={guitar.id}>...</li>)`, ¿por qué hace falta `key` y qué pasa si la quito?**

<details>
<summary>Respuesta</summary>

`key` es una prop especial que React usa para identificar de forma única cada nodo de la lista entre renders (insertar, borrar o reordenar sin recrear todo). React la extrae del objeto props, así que el hijo no la recibe. Sin ella, React avisa en consola ("Each child in a list should have a unique key") y compara por posición, lo que puede provocar pérdidas de estado y renders innecesarios. Debe ser un valor estable y único, normalmente `guitar.id`, nunca `Math.random()`.

</details>
