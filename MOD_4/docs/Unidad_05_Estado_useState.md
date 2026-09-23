# Unidad 05 — Estado con useState

Hasta ahora tus componentes React solo recibían **props**: datos que llegan de fuera y que el propio componente no puede cambiar. Eso está bien para información fija (un título, un texto, un color), pero casi ninguna aplicación real es estática: hay contadores que suben, formularios que se escriben, menús que se abren y se cierran, listas a las que se les añaden elementos.

Para que un componente "recuerde" datos que **cambian con el tiempo** y se vuelva a pintar solo cuando esos datos cambian, React usa el **estado** (*state*). La forma más básica de trabajar con el estado en componentes funcionales es el hook `useState`.

## Objetivos

- Entender qué es el estado y cómo se diferencia de las props (props inmutables vs estado que cambian y provoca re-renderizado).
- Conocer la firma de `useState`: desestructuración en array, valor inicial, función `setValor` y updater funcional `(prev) => prev + 1`.
- Saber por qué conviene usar el updater basado en el valor anterior cuando el nuevo valor depende del anterior.
- Declarar varios `useState` independientes en un mismo componente y usarlos juntos (contador, texto, visibilidad, lista, sesión).
- Dominar los tres patrones fundamentales: input controlado (`value` + `onChange`), renderizado condicional (`&&` y ternario) y listas inmutables (`[...items, nuevo]`).
- Evitar los errores típicos de principiantes: mutar el estado directamente, olvidar `onChange`, usar `push` sobre el array de estado.

## Requisitos

- **U02 — Componentes**: saber crear y usar componentes funcionales (`function MiComponente() { ... }` o `const MiComponente = () => { ... }`).
- **U03 — Props**: saber pasar datos de un componente a otro (`<Saludo nombre="Ana" />`) y recibirlos por parámetro (`props.nombre`). En esta unidad vamos un paso más allá: el componente deja de solo *recibir* datos y empieza a *tener* datos propios que puede modificar.

## ¿Qué es el estado?

Imagina una ficha de papel pegada en la puerta de tu casa. Si alguien la lee, siempre dice lo mismo: eso sería una **prop**. Ahora imagina un marcador de visitas con una pizarra y un rotulador: el número cambia cada vez que pasa alguien, y cada vez que cambia vuelves a mirar la puerta y ves el número nuevo. Eso es el **estado**: un dato **vivo** dentro del componente.

Formalmente:

- El estado es un **dato que el componente posee y puede cambiar** durante su vida.
- Cada vez que el estado cambia, React **vuelve a ejecutar (re-renderizar)** el componente para que la interfaz refleje el nuevo valor.
- Las **props** son el camino de entrada de datos *desde fuera*: el componente las recibe pero **no las modifica** (son inmutables).
- El **estado** es el camino de datos *de dentro*: solo el propio componente lo lee y lo actualiza mediante su función `set...`.

Por qué importa: sin estado, React no sabría cuándo repintar. React compara el estado anterior con el nuevo; si son distintos, re-renderiza; si son iguales, no hace nada. Eso es lo que hace eficiente a React: repinta **solo cuando hace falta**.

> Regla de oro para empezar: **las props no se tocan, el estado solo se cambia con su setter.** Nunca hagas `count = 5` a mano sobre una variable de estado.

## La firma de `useState`

`useState` es un **hook**: una función especial de React que se llama **dentro** de un componente funcional (siempre al nivel superior, nunca dentro de `if`, bucles o funciones anidadas). Se importa desde `"react"`.

```jsx
import { useState } from "react"

const [valor, setValor] = useState(valorInicial)

setValor(nuevoValor)          // actualiza y re-renderiza
setValor((prev) => prev + 1)  // updater basado en el anterior
```

Vamos parte por parte:

1. **`useState(valorInicial)`**: le pasas el valor con el que arranca el estado. Puede ser un número (`0`), un string (`""`), un booleano (`false`, `true`) o un array (`[]`). Este valor inicial **solo se usa en el primer render**; después React lo ignora (por eso no sirve de nada cambiar la línea `useState(0)` en cada render esperando que el contador "se resetee").
2. **Desestructuración en array**: `useState` devuelve un **array de dos posiciones**: `[valorActual, funcionDeActualizacion]`. El corchete `[valor, setValor]` es *array destructuring*: extraemos esas dos posiciones en dos variables con el nombre que queramos. La convención de nombres es `valor` / `setValor` (por ejemplo `count`/`setCount`, `name`/`setName`, `items`/`setItems`).
3. **`setValor(nuevoValor)`**: al llamarla, React guarda el nuevo valor **y** lanza un re-render del componente. La interfaz se vuelve a calcular con el estado ya actualizado.
4. **Updater funcional `setValor((prev) => prev + 1)`**: en lugar de pasar un valor fijo, pasas una **función** que recibe el valor anterior (`prev`) y devuelve el siguiente.

### ¿Por qué existe el updater `(prev) => prev + 1`?

Porque React puede **agrupar** varias actualizaciones y ejecutar el re-render una sola vez. Si en el mismo evento haces tres veces `setCount(count + 1)` leyendo siempre la variable `count` de pantalla, las tres usan el **mismo** `count` viejo y solo avanzas de 0 a 1. Con el updater, React le pasa a tu función el valor **más reciente** en cada llamada, así que `prev + 1` se aplica tres veces de verdad: 0 → 1 → 2 → 3.

**Cuándo usar cada forma:**

| Forma | Ejemplo | Úsala cuando... |
|-------|---------|-----------------|
| Valor directo | `setCount(10)` | El nuevo valor **no depende** del anterior (resetear, asignar un texto, un booleano) |
| Updater | `setCount((prev) => prev + 1)` | El nuevo valor **depende** del anterior (sumar, restar, alternar, añadir a una lista) |

Ambas formas son correctas; la diferencia solo importa cuando actualizaciones del mismo tipo se acumulan sin re-render intermedio. Empezar con el updater en operaciones "colgar/restar/alternar" es una buena costumbre.

## Varios `useState` en un mismo componente

Un componente puede tener **tantos `useState` como quieras**, cada uno con su propio par `[valor, setValor]` y su propia porción de estado. No se agrupan en un objeto grande (aunque podrías hacerlo, la convención moderna es uno por dato), de modo que cada dato cambia y re-renderiza de forma independiente.

Así se ve un componente que junta los cinco estados del curso:

```jsx
const [count, setCount] = useState(0)
const [name, setName] = useState("")
const [isVisible, setIsVisible] = useState(true)
const [items, setItems] = useState([])
const [auth, setAuth] = useState(false)

<button onClick={() => setCount(count + 1)}>Incrementar</button>

<input value={name} onChange={(e) => setName(e.target.value)} />

{isVisible && <p>¡Puedo mostrar y ocultarme!</p>}

const addItem = () => {
  setItems([...items, `Item ${items.length + 1}`])
}
```

Qué significa cada uno:

- **`count` (contador)**: arranca en `0`. El botón llama a `setCount(count + 1)` (o mejor, con updater `setCount((prev) => prev + 1)`) y cada clic re-renderiza mostrando el número nuevo.
- **`name` (texto)**: arranca vacío `""`. Es un **input controlado**: el valor del input siempre es `name`, y cada pulsación lo actualiza con `setName`.
- **`isVisible` (booleano de visibilidad)**: arranca en `true`. Cambiarlo con `setIsVisible(!isVisible)` (o `setIsVisible((prev) => !prev)`) muestra u oculta el párrafo mediante renderizado condicional.
- **`items` (lista)**: arranca como array vacío `[]`. Cada elemento nuevo se añade **creando un array nuevo** con spread: `[...items, nuevo]`.
- **`auth` (sesión)**: arranca en `false` (deslogueado). `setAuth(true)` / `setAuth(false)` simulan login/logout y pueden condicionar la UI (`auth ? <Panel/> : <Login/>`).

Por qué importa: cada `useState` es una **fuente de verdad independiente**. Cambiar `name` no toca `count`; cambiar `items` no resetea `isVisible`. React re-renderiza el componente completo cuando cambia *cualquiera* de ellos, pero tú solo modificas el que necesites.

## Patrones fundamentales

### 1. Input controlado: `value` + `onChange`

Un input es **controlado** cuando su valor visible viene del estado y cada cambio pasa por React:

```jsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

- **`value={name}`**: el input muestra exactamente lo que hay en el estado. React es la **fuente de verdad**.
- **`onChange`**: en cada pulsación leemos `e.target.value` (lo que el usuario escribió) y lo guardamos con `setName`.
- Si olvidas `onChange`, el input se queda congelado: escribes y no pasa nada porque React vuelve a pintar el valor viejo del estado.
- Si olvidas `value`, el input funciona "solo", pero React ya no sabe qué contiene y no podrás leerlo ni validararlo desde el estado.

Por qué importa: con esta dualidad, el estado y la pantalla **nunca se desincronizan**. Puedes validar, limitar caracteres o derivar otros datos (por ejemplo mostrar `name.length`) porque el estado siempre está al día.

### 2. Renderizado condicional: `&&` vs ternario

A veces quieres mostrar JSX **solo si se cumple una condición**. Hay dos formas idiomáticas:

```jsx
{isVisible && <p>¡Puedo mostrar y ocultarme!</p>}

{auth ? <PanelUsuario /> : <FormularioLogin />}
```

- **`condición && <jsx />`** (AND lógico): si la condición es `true`, se muestra el JSX; si es `false`, React **no pinta nada**. Ideal para elementos que aparecen o desaparecen (alertas, menús, "solo si hay resultados").
- **Ternario `cond ? a : b`**: si es `true` muestra `a`, si es `false` muestra `b`. Ideal cuando hay **dos alternativas** (logueado/no logueado).

Truco mental: `false && <p>hola</p>` evalúa a `false`, y React no sabe pintar booleanos, así que simplemente no aparece nada en pantalla. Cuidado con condiciones numéricas: `{count && <p>x</p>}` con `count = 0` pintaría el `0` (porque `0` sí es un valor renderizable); mejor `{count > 0 && <p>x</p>}`.

### 3. Listas inmutables: `[...items, nuevo]` nunca `items.push(...)`

Los arrays (y objetos) de estado deben tratarse como **inmutables**: en lugar de modificarlos, creas uno **nuevo** y se lo pasas al setter:

```jsx
const addItem = () => {
  setItems([...items, `Item ${items.length + 1}`])
}
```

¿Por qué `push` no funciona? Porque `items.push(x)` **muta el mismo array**: cambia su contenido pero **conserva la misma referencia** (el mismo objeto en memoria). React decide si re-renderiza comparando referencias: si le pasas el mismo array otra vez, "piensa" que **no cambió nada** y **no repinta**, aunque por dentro tenga un elemento más. El estado, la UI y tu variable `items` quedan en contradicción.

Con `[...items, nuevo]` creas un array **nuevo** (referencia distinta) que contiene los elementos viejos más el nuevo. React ve que cambió la referencia → re-renderiza → la lista aparece en pantalla.

La misma regla aplica a objetos: en vez de `setUser(user.edad = 30)` o `user.edad = 30; setUser(user)`, haz `setUser({ ...user, edad: 30 })`.

| Operación | ¿Inmutable? | ¿React re-renderiza? |
|-----------|-------------|----------------------|
| `[...items, nuevo]` | Sí (array nuevo) | Sí |
| `items.push(nuevo)` | No (misma referencia) | No |
| `{ ...obj, clave: v }` | Sí (objeto nuevo) | Sí |
| `obj.clave = v; setObj(obj)` | No (misma referencia) | No |

## Ejemplo completo del componente

Todo lo anterior junto en un patrón de uso real (simplificado a lo esencial):

```jsx
import { useState } from "react"

export default function EjemploEstado() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const [items, setItems] = useState([])
  const [auth, setAuth] = useState(false)

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`])
  }

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Incrementar: {count}
      </button>

      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hola, {name || "anónimo"}</p>

      <button onClick={() => setIsVisible((prev) => !prev)}>
        Alternar visibilidad
      </button>
      {isVisible && <p>¡Puedo mostrar y ocultarme!</p>}

      <button onClick={addItem}>Añadir item</button>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <button onClick={() => setAuth((prev) => !prev)}>
        {auth ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
      {auth && <p>¡Bienvenido!</p>}
    </div>
  )
}
```

Nota sobre `key` en el `map`: React necesita una **clave estable** por cada elemento de la lista para identificarlo entre renders. Es un tema de U05/U07 según tu curso, pero si olvidas `key` React mostrará una advertencia en consola.

## En el ejemplo

Revisa el componente completo del repositorio, donde verás `useState` aplicado en contexto real:

[`ComponenteHooks.jsx`](../EJEMPLO_REACT/src/components/ComponenteHooks.jsx)

## Errores comunes

**1. Mutar el estado directamente (la clásica)**

Error: contar con `count++` o `setCount` sobre el mismo array con `push`.

```jsx
// MAL: muta la variable; React no detecta el cambio
count++
items.push("nuevo")

// BIEN: setter con valor nuevo o updater
setCount((prev) => prev + 1)
setItems((prev) => [...prev, "nuevo"])
```

Solución: el estado **nunca** se modifica a mano; solo se cambia con `set...`, siempre con un valor nuevo (primitivo distinto, array u objeto nuevo).

**2. Input controlado sin `onChange` (o sin `value`)**

Error: el input no deja escribir, o React avisa *"You provided a `value` prop to a form field without an `onChange` handler"*.

```jsx
// MAL: value sin onChange → campo congelado
<input value={name} />

// BIEN: ambos lados de la moneda
<input value={name} onChange={(e) => setName(e.target.value)} />
```

Solución: siempre `value` + `onChange` juntos. Si de verdad quieres un campo de solo lectura, añade `readOnly`.

**3. Leer un estado "viejo" en actualizaciones encadenadas**

Error: tres `setCount(count + 1)` seguidos en el mismo evento muestran `1`, no `3`.

```jsx
// MAL: count es siempre el mismo valor capturado
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)

// BIEN: updater basado en el valor anterior
setCount((prev) => prev + 1)
setCount((prev) => prev + 1)
setCount((prev) => prev + 1)
```

Solución: cuando el nuevo valor depende del anterior, usa `setValor((prev) => ...)`.

**4. Esperar que cambiar `useState(0)` en el código resetee el estado**

Error: cambiar `useState(0)` a `useState(100)` y ver que el contador no pasa a 100.

Solución: el argumento de `useState` solo vale para el **primer render**. Para reiniciar, haz `setCount(0)` en un evento o efecto.

**5. Renderizado condicional con valores falsos "raros"**

Error: `{items.length && <ul>...</ul>}` pinta un `0` cuando la lista está vacía.

Solución: usa una comparación explícita `{items.length > 0 && <ul>...</ul>}`.

## Conceptos clave

- El **estado** son datos propios del componente que **cambian** y provocan **re-renderizado**; las **props** llegan de fuera y son **inmutables**.
- `useState(valorInicial)` devuelve `[valor, setValor]` mediante **desestructuración de array**; el valor inicial solo se usa en el primer render.
- `setValor(nuevo)` actualiza y re-renderiza; `setValor((prev) => ...)` calcula el nuevo valor a partir del anterior (**updater funcional**) y es lo recomendado cuando el nuevo depende del anterior.
- Un componente puede declarar **varios `useState`** independientes (count, name, isVisible, items, auth).
- **Input controlado** = `value` + `onChange` → React es la fuente de verdad del formulario.
- **Renderizado condicional**: `cond && <jsx />` para mostrar/ocultar, `cond ? a : b` para dos alternativas.
- **Inmutabilidad en listas y objetos**: `[...items, nuevo]` / `{ ...obj, clave: v }`; `push` o asignación directa cambian la **misma referencia** y React **no re-renderiza**.
- Los hooks se llaman **siempre al nivel superior** del componente (nunca dentro de `if`, bucles o callbacks).

## Autoevaluación

**1. ¿Cuál es la diferencia principal entre props y estado?**

<details>
<summary>Respuesta</summary>

Las **props** son datos inmutables que el componente recibe desde fuera y no puede modificar. El **estado** es un dato propio del componente que solo cambia mediante su función `set...`, y cada cambio provoca un re-render para actualizar la interfaz.

</details>

**2. ¿Por qué se recomienda `setCount((prev) => prev + 1)` en lugar de `setCount(count + 1)`?**

<details>
<summary>Respuesta</summary>

Porque el updater recibe el valor **más reciente** del estado incluso cuando React agrupa varias actualizaciones antes de repintar. Con `setCount(count + 1)` usas el `count` capturado en el render actual, así que varias llamadas seguidas en el mismo evento producirían el mismo resultado en lugar de sumar varias veces.

</details>

**3. Mi lista no se actualiza en pantalla aunque hago `items.push("nuevo")`. ¿Por qué y cómo lo arreglo?**

<details>
<summary>Respuesta</summary>

`push` **muta el array** y conserva la **misma referencia**. React compara referencias para decidir si repinta, así que no detecta el cambio. Solución: crear un array nuevo, `setItems([...items, "nuevo"])` (o con updater `setItems((prev) => [...prev, "nuevo"])`).

</details>

**4. Escribe un input controlado conectado al estado `name`.**

<details>
<summary>Respuesta</summary>

```jsx
const [name, setName] = useState("")
<input value={name} onChange={(e) => setName(e.target.value)} />
```

`value` muestra el estado en el input y `onChange` guarda lo que escribe el usuario de vuelta en el estado, manteniendo a React como fuente de verdad.

</details>
