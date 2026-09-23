# Unidad 01 — Introducción a React

## Objetivos

- Entender qué es React: una librería de Meta para construir interfaces de usuario.
- Comprender los tres pilares de React: UI declarativa, componentes y estado.
- Conocer la historia de React: de `React.createClass` a las clases ES6 y a los hooks (React 16.8+).
- Explicar qué es el Virtual DOM y sus tres pasos: render en memoria, diff y reconciliación.
- Escribir JSX válido y saber cómo Babel o SWC lo convierten en `React.createElement(...)`.
- Entender por qué las listas necesitan `key` únicas y qué papel juega `React.StrictMode`.

## Requisitos

- JavaScript básico: variables, funciones, arrays y objetos, y módulos (`import`/`export`). Son los contenidos vistos en los módulos **M2** y **M3** de este curso.
- Conviene tener a mano el ejemplo del módulo, en especial [`../EJEMPLO_REACT/src/main.jsx`](../EJEMPLO_REACT/src/main.jsx), que veremos al final de esta unidad.
- No hace falta saber React previamente: esta unidad parte de cero.

---

## ¿Qué es React?

**Qué significa.** React es una **librería de JavaScript** creada por **Meta** (antes Facebook) y publicada como proyecto de código abierto en 2013. Una librería es un conjunto de herramientas que tú utilizas desde tu código; no es un framework completo que decida por ti la estructura de la aplicación entera (eso sería más bien el caso de Angular). Con React decides tú la arquitectura, y React se encarga de una cosa muy concreta: **construir y actualizar la interfaz de usuario**.

**Por qué importa.** Las interfaces modernas son muy dinámicas: botones que cambian de texto, listas que se filtran, formularios que validan en vivo... Sin ayuda, actualizar el navegador a mano sería un trabajo tedioso y propenso a errores. React automatiza ese trabajo: tú describes cómo debe verse la pantalla en cada situación, y React se encarga de pintar solo lo que cambió.

### UI declarativa

**Qué significa.** En programación hay dos formas de describir una tarea:

- **Imperativa:** describes el *cómo*, paso a paso. "Abre el cajón, coge la taza, llena la taza, cierra el grifo..."
- **Declarativa:** describes el *qué*, el resultado deseado. "Quiero una taza llena de café".

React sigue el estilo **declarativo**: tú describes qué debe mostrarse en pantalla según los datos actuales, y React calcula los pasos concretos para conseguirlo.

**Por qué importa.** Al pensar en "qué debe verse" en lugar de "cómo cambiar el DOM paso a paso", tu código es más corto, más legible y menos propenso a errores. Ejemplo imperativo frente a declarativo:

```javascript
// Imperativo: tú dices el cómo (DOM real, paso a paso)
const el = document.getElementById("titulo")
el.textContent = "Hola"          // borra el texto anterior
el.className = "titulo activo"   // y además cambia la clase

// Declarativo: dices el qué (React se encarga del resto)
// <h1 className="titulo activo">Hola</h1>
```

### Componentes

**Qué significa.** Un **componente** es una función (o clase, en código antiguo) que devuelve JSX: es decir, devuelve "qué se pinta" en pantalla. Piensa en ellos como piezas de LEGO: cada pieza es pequeña, con un nombre claro y una responsabilidad única (`Navbar`, `BotonContador`, `ListaTareas`...). Combinando piezas pequeñas construyes pantallas grandes.

**Por qué importa.** Si la lógica de la barra de navegación vive en un componente `Navbar`, puedes reutilizarla en varias páginas, probarla por separado y modificarla sin tocar el resto de la aplicación.

### Estado (state)

**Qué significa.** El **estado** es un conjunto de datos que pertenecen a un componente y **pueden cambiar** con el tiempo: por ejemplo, si un contador guarda `0` y el usuario hace clic, el estado pasa a `1`.

**Por qué importa.** Aquí está la magia de React: **cuando cambia el estado, React vuelve a pintar (re-renderizar) el componente**. Tú actualizas los datos; React actualiza la interfaz. De ahí la idea resumida en esta tabla:

| Concepto | Qué significa | Por qué importa |
|---|---|---|
| UI declarativa | Describes qué debe verse, no cómo cambiarlo | Menos pasos manuales, menos errores |
| Componentes | Piezas reutilizables que devuelven JSX | Código modular, mantenible y reutilizable |
| Estado | Datos internos que cambian con el tiempo | Al cambiar, React actualiza la interfaz solo |

---

## Historia (resumen)

**Qué significa.** React nació en 2013 en Facebook (hoy Meta), se publicó en GitHub como open source y fue adoptado por multitud de empresas. A lo largo de los años cambió la forma de escribir componentes:

| Época | Cómo se escribían los componentes | Estado actual |
|---|---|---|
| 2013 | `React.createClass({ ... })` | Obsoleto, no se usa |
| ~2015 | Clases ES6 con `this.state` y `this.setState` | Solo en código antiguo |
| 2018 (React 16.8+) | **Function components + hooks** (`useState`, `useEffect`...) | Forma recomendada hoy |

- Creado en 2013 para Facebook; open source en GitHub.
- Evolución: `React.createClass` → ES6 classes → **function components + hooks** (React 16.8+).

**Por qué importa.** Si buscas documentación o ejemplos antiguos, verás componentes escritos con `class MiComponente extends React.Component`. No te confundas: hoy se escribe con **funciones y hooks**, que verás en las siguientes unidades. Las clases siguen existiendo y funcionan, pero ya no son el estilo recomendado.

---

## Virtual DOM

**Qué significa.** El **DOM** (Document Object Model) es la representación de la página que maneja el navegador. El problema es que **modificar el DOM es caro**: el navegador debe recalcular estilos, reorganizar elementos y volver a dibujar. Si en cada cambio de una letra repintaras toda la pantalla, la interfaz se pondría lenta.

React resuelve esto con el **Virtual DOM**: una copia ligera del DOM, guardada **en memoria** (es decir, dentro de JavaScript, no en la página). React compara esa copia con la anterior y solo toca el navegador donde algo ha cambiado de verdad.

**Los tres pasos.** React no pinta el DOM real en cada cambio:

1. Renderiza un **árbol de elementos** en memoria (React elements): una representación nueva de cómo debería verse la interfaz.
2. Calcula el **diff** (diferencias) comparando ese árbol nuevo con el anterior / con el DOM actual.
3. Aplica solo los cambios mínimos al DOM real: a eso se le llama **reconciliación**.

| Paso | Qué hace | Ejemplo: el contador pasa de 3 a 4 |
|---|---|---|
| 1. Render en memoria | Crea el árbol nuevo de React elements | `<span>4</span>` en vez de `<span>3</span>` |
| 2. Diff | Compara con el árbol anterior | Detecta que solo cambió el texto del `span` |
| 3. Reconciliación | Aplica el cambio mínimo al DOM | Actualiza un nodo, no la página entera |

**Por qué es más rápido.** El resultado son menos operaciones costosas sobre el DOM del navegador: en vez de recrear bloques completos, React toca únicamente los nodos afectados. Además, las operaciones se hacen primero en memoria (muy rápida) y solo se toca el navegador al final, y únicamente lo necesario.

**Analogía.** Imagina que rehaces la fachada de una casa: en lugar de demolerla entera cada vez que cambia un color, miras primero el plano, comparas con el estado actual y pintas solo la pared que cambió. El "plano comparado" es el Virtual DOM.

---

## JSX

**Qué significa.** JSX es una **sintaxis parecida a HTML dentro de JavaScript/TypeScript**. Permite describir la interfaz de forma natural, mezclando etiquetas con la lógica del lenguaje. No es HTML: es azúcar sintáctico que luego se convierte en llamadas a funciones de React.

```jsx
const element = <h1 className="titulo">Hola</h1>
// ≈ React.createElement("h1", { className: "titulo" }, "Hola")
```

Fíjate en la traducción: la etiqueta `<h1>` se convierte en una llamada a `React.createElement` con tres argumentos: el tipo de elemento (`"h1"`), sus atributos (un objeto con `className`) y sus hijos (el texto `"Hola"`). Eso es lo que acaba devolviendo tu componente.

**Reglas de JSX** (imprescindibles para que compile):

- **Una raíz**: debe haber un único elemento contenedor, o usar `<>...</>` / `<Fragment>` para agrupar.
- **`className` en lugar de `class`**: `class` es palabra reservada de JavaScript, así que React usa `className` para el atributo de clases CSS.
- **Expresiones entre llaves `{...}`**: para meter variables, llamadas a funciones o cualquier expresión de JS.

| Regla | Incorrecto | Correcto |
|---|---|---|
| Una sola raíz | `<h1>Título</h1><p>Sub</p>` | `<>` (o un `div`) que envuelva ambos |
| Atributo de clase | `<h1 class="titulo">` | `<h1 className="titulo">` |
| Insertar una variable | `<h1>nombre</h1>` | `<h1>{nombre}</h1>` |
| Evaluar una expresión | `<h1>3 + 4</h1>` | `<h1>{3 + 4}</h1>` |

Ejemplo completo de expresiones entre llaves:

```jsx
const usuario = "Ana"
const edad = 25

function App() {
  return (
    <>
      <h1>Hola {usuario}</h1>
      <p>Edad: {edad + 1} el próximo año</p>
      <p>{edad >= 18 ? "Mayor de edad" : "Menor de edad"}</p>
    </>
  )
}
```

---

## Babel / compilador

**Qué significa.** Los navegadores no entienden JSX por sí mismos: solo JavaScript estándar. Por eso hace falta un **transpilador** (o compilador) que traduzca JSX —y también TypeScript— a JavaScript que el navegador pueda ejecutar.

- **Babel** es el transpilador clásico del ecosistema React: hace el papel de convertir JSX/TS → JS.
- **SWC** es una alternativa moderna, escrita en Rust, que hace **exactamente el mismo papel**, pero mucho más rápido.

**Por qué importa.** En proyectos modernos con **Vite**, el transformador de JSX es **SWC** (a menudo en la plantilla `react-swc`), no Babel. No cambia nada de lo que escribes: sigues escribiendo JSX igual; solo cambia quién lo traduce por debajo. Si en un proyecto antiguo ves Babel (`babel.config.js`), funciona con el mismo concepto.

---

## `key` y reconciliación

**Qué significa.** Cuando pintas una lista con `.map()`, React crea varios elementos hermanos. Para gestionarlos eficientemente necesita identificar cada uno de forma única: para eso sirve el atributo **`key`**. Cada hijo necesita una `key` **única** (normalmente el `id` del recurso). React la usa para emparejar elementos entre renders y evitar re-renderizar todo.

```jsx
function Lista({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}
```

**Qué pasa si no lleva `key`.** Sin una identidad estable, React no puede saber qué elemento de la lista anterior corresponde a cuál de la nueva. Entonces:

- Muestra un aviso en consola: *"Each child in a list should have a unique 'key' prop"*.
- En el mejor de los casos, React re-renderiza la lista completa de forma innecesaria; en el peor (al reordenar o insertar), puede actualizar elementos equivocados.

| Situación | Con `key` | Sin `key` |
|---|---|---|
| React identifica cada nodo | Sí, por la clave única | No, solo por posición |
| Cambia un elemento de la lista | Re-renderiza solo lo afectado | Posible re-render completo / emparejamientos erróneos |
| Consola | Sin avisos | Advertencia de key ausente |

**Por qué importa.** Elegir bien las claves (un `id` real del servidor, no el índice si la lista se reordena) es la diferencia entre una interfaz fluida y una que parpadea o va lenta.

---

## React Strict Mode

**Qué significa.** `StrictMode` es un **modo estricto** que envuelve tu aplicación en desarrollo para detectar problemas. Se usa así:

```jsx
<StrictMode>
  <App />
</StrictMode>
```

**Por qué importa.** Activa avisos en desarrollo sobre:

- Dobles renderizados (React renderiza dos veces a propósito para exponer efectos no idempotentes).
- Efectos montados/desmontados dos veces (detecta limpieza olvidada).
- APIs obsoletas o usos incorrectos.

Lo importante: **no afecta al build de producción**. Es un profesor que solo te corrige cuando estás escribiendo el código; cuando la app se compila para usuarios finales, `StrictMode` no añade coste.

---

## En el ejemplo

[`../EJEMPLO_REACT/src/main.jsx`](../EJEMPLO_REACT/src/main.jsx) — `StrictMode` + montaje de `App`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`main.jsx` es el **punto de entrada**: selecciona el nodo `#root` del HTML, envuelve `<App />` en `StrictMode` y monta la aplicación dentro de él.

---

## Errores comunes

**1. Usar `class` en JSX en lugar de `className`.**

```jsx
// ❌ Error: React ignora "class" en JSX (y choca con la palabra reservada de JS)
<h1 class="titulo">Hola</h1>

// ✅ Solución: usa className
<h1 className="titulo">Hola</h1>
```

**2. Devolver dos elementos "raíz" sin agrupar.**

```jsx
// ❌ Error: "Adjacent JSX elements must be wrapped in an enclosing tag"
function Saludo() {
  return (
    <h1>Título</h1>
    <p>Subtítulo</p>
  )
}

// ✅ Solución: una raíz con Fragment
function Saludo() {
  return (
    <>
      <h1>Título</h1>
      <p>Subtítulo</p>
    </>
  )
}
```

**3. Olvidar la `key` al mapear una lista.**

```jsx
// ❌ Error en consola: Each child in a list should have a unique "key"
<ul>
  {items.map((item) => (
    <li>{item.name}</li>
  ))}
</ul>

// ✅ Solución: key única (el id del recurso)
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
```

**4. Escribir el nombre de un componente en minúsculas.**

```jsx
// ❌ React lo trata como etiqueta HTML desconocida, no como componente
function Navbar() { return <nav>...</nav> }
return <navbar />

// ✅ Solución: mayúscula inicial en el uso del componente
return <Navbar />
```

---

## Conceptos clave

- **React**: librería de JavaScript de Meta (2013) para construir interfaces de usuario.
- **UI declarativa**: describes qué debe verse; React calcula cómo actualizarlo.
- **Componentes**: piezas reutilizables que devuelven JSX.
- **Estado**: datos que cambian; al cambiar, React re-renderiza el componente.
- **Historia**: `React.createClass` → clases ES6 → function components + hooks (React 16.8+).
- **Virtual DOM**: 1) render del árbol en memoria, 2) diff con el estado anterior, 3) reconciliación aplicando solo los cambios mínimos → menos operaciones costosas en el DOM real.
- **JSX**: sintaxis tipo HTML dentro de JS; se transpila a `React.createElement(...)`.
- **Reglas de JSX**: una sola raíz (o Fragment), `className` en vez de `class`, expresiones entre llaves `{...}`.
- **Babel / SWC**: transpiladores que convierten JSX/TS → JS; Vite usa SWC, con el mismo papel que Babel.
- **`key`**: identidad única de cada hijo en una lista; evita re-renders completos y emparejamientos erróneos.
- **React.StrictMode**: avisos y dobles comprobaciones solo en desarrollo; no afecta a producción.
- **`main.jsx`**: punto de entrada que monta `<App />` dentro de `StrictMode`.

---

## Autoevaluación

**1. ¿Qué es React y quién lo mantiene?**

<details>
<summary>Respuesta</summary>

React es una librería de JavaScript creada por Meta (antes Facebook) y publicada como open source en 2013. No es un framework completo: se ocupa de construir y actualizar la interfaz de usuario (UI declarativa a partir de componentes que se actualizan cuando cambia el estado).

</details>

**2. ¿Cuáles son los tres pasos del Virtual DOM y por qué es más rápido que tocar el DOM directamente?**

<details>
<summary>Respuesta</summary>

1) React renderiza un árbol de elementos (React elements) en memoria. 2) Calcula el diff comparándolo con el estado anterior/DOM actual. 3) Aplica solo los cambios mínimos al DOM real (reconciliación). Es más rápido porque reduce las operaciones costosas sobre el DOM del navegador: solo se modifica lo que realmente cambió.

</details>

**3. ¿Por qué en JSX se escribe `className` y no `class`, y qué debes hacer para insertar una variable?**

<details>
<summary>Respuesta</summary>

`class` es una palabra reservada de JavaScript, así que React usa `className` para el atributo de clases CSS. Para insertar una variable o expresión de JavaScript se usa el sintaxis de llaves: `<h1>{miVariable}</h1>`.

</details>

**4. ¿Qué ocurre si mapeas una lista sin poner `key`? ¿Y para qué sirve `StrictMode`?**

<details>
<summary>Respuesta</summary>

Sin `key` única, React no puede emparejar los elementos entre renders: muestra un aviso en consola y puede re-renderizar la lista completa o emparejar mal los nodos al reordenar. `StrictMode` activa avisos de desarrollo (dobles renderizados, efectos montados/desmontados, APIs obsoletas); no afecta al build de producción.

</details>
