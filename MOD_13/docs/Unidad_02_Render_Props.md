# Unidad 02 — Render Props

## Objetivos

- Entender el patrón **render prop**: un componente que no dibuja UI fija, sino que te **entrega datos** y te deja dibujar.
- Escribir un `MousePosition` con `children` como función.
- Distinguir *function as child* de *function as prop*.
- Comparar render props vs HOC vs custom hooks y elegir el patrón adecuado.
- Evitar las trampas clásicas: componente nuevo en cada render y "pirámide de callbacks".

## Requisitos

- M4–M12: componentes, `children`, `useState`, `useEffect` (suscripción y limpieza).
- Haber visto el Módulo 13 Unidad 01 (Compound Components) ayuda, porque ambos patrones resuelven "compartir lógica con UI", pero no es obligatorio.
- No se requiere TypeScript en esta unidad.

## La idea en palabras simples

Normalmente un componente **dibuja** su UI. En el patrón **render prop** el componente hace lo contrario: **guarda la lógica** (posición del ratón, tamaño de ventana, permisos…) y te pasa los datos a través de una **función**, para que seas tú quien decida qué pintar.

**Analogía:** es como un camarero que no elige tu plato: te trae la mesa puesta (los ingredientes/`{x, y}`) y tú combinas. El componente "cocina" los datos; tú "emplatas" la UI.

```jsx
<MousePosition>
  {({ x, y }) => <p>El ratón está en {x}, {y}</p>}
</MousePosition>
```

**Qué significa:** `MousePosition` no sabe ni le importa si mostrás un párrafo, un gráfico o un crosshair. Solo cumple su contrato: "mientras estés montado, te doy la posición actual del puntero en tiempo real".

**Por qué importa:** reutilizas la **lógica** (eventos, estado, efectos) sin atarla a una UI concreta. El mismo `MousePosition` puede servir para un mapa, un juego o un debugger de layout sin duplicar el `useEffect` de `pointermove`.

## Implementación mínima

El componente que suscribe al evento y **llama a children como función** (`children(pos)`, no `children` como elemento):

```jsx
function MousePosition({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const fn = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', fn)
    return () => window.removeEventListener('pointermove', fn)
  }, [])
  return children(pos)
}
```

Detalles que importan:

- `children` aquí **no es JSX**: es una función. React no la llama; **la llama el componente** con los datos (`children(pos)`).
- El `useEffect` limpia el listener al desmontar; si lo olvidas, acumulas listeners y la app se pone lenta.
- El array de deps `[]` indica "suscríbete una sola vez"; el estado `pos` se actualiza por cada movimiento.

Uso:

```jsx
<MousePosition>
  {({ x, y }) => <p>El ratón está en {x}, {y}</p>}
</MousePosition>
```

## Variantes

Hay dos formas de entregar la función; el contenido es el mismo, cambia la sintaxis:

- **Function as child** (la de arriba): la función va como `children`.
- **Function as prop**: `<MousePosition render={({x}) => ...} />` — más **explícito**: en el DevTools se ve claramente que hay una prop `render`, y evita la confusión de que `children` deje de ser JSX.

```jsx
// Variante render prop nombrada
<MousePosition
  render={({ x, y }) => <Coords x={x} y={y} />}
/>
```

**Por qué importa:** en equipos grandes, la prop `render` se autodocumenta; con `children` como función, alguien puede intentar meter JSX normal y romper el componente.

## Render props vs HOC vs custom hooks

Esta es la tabla que te sirve para **elegir patrón** en proyectos reales:

| Patrón | Mejor para |
|--------|------------|
| Custom hook | **lógica** sin UI (default moderno) |
| Render prop / children fn | lógica **+** UI configurable en runtime |
| HOC | inyectar props en componentes de terceros / legacy |

Lectura de la tabla:

- Si la lógica es tuya y la UI también → **custom hook** (`useMouse()` + tu componente). Es lo más común hoy.
- Si el consumidor debe decidir **en cada render** qué hacer con los datos (porque la UI varía dinámicamente) → **render prop**.
- Si necesitas envolver un componente que **no controlas** (librería de terceros, código legacy) → **HOC** (Unidad 03).

Dato importante: **muchos render props de hoy son hooks**: `useMouse()` + componente propio. El hook separa la lógica; el componente la consume. El patrón no desapareció: se mudó dentro de los hooks.

```jsx
// La misma capacidad, hoy, como hook:
function Coords() {
  const { x, y } = useMouse()
  return <p>El ratón está en {x}, {y}</p>
}
```

## En el ejemplo

`src/patterns/RenderPropsMouse.jsx` + hook `src/hooks/useMouse.js` comparados lado a lado.

## Errores comunes

**1. El callback crea un componente nuevo cada render → pierde estado.**

```jsx
// ❌ Mal: una función anónima inline como componente = tipo nuevo en cada render
return children && children({ x, y })   // ok si es solo llamada…

// ❌ Peor: pasar un componente definido dentro del render
const Grafico = () => <Punto x={x} y={y} />
return <Grafico />   // ¡se remonta en cada render!

// ✅ Solución: define el componente fuera o memoriza con useMemo
const contenido = useMemo(() => children({ x, y }), [x, y, children])
```

Solución: define el subcomponente fuera del padre, o memoriza el resultado/función con `useMemo`/`useCallback`.

**2. Anidar 5 render props → pirámide de callbacks (callback hell).**

```jsx
// ❌ ilegible
<MousePosition>
  {({ x }) => (
    <WindowSize>
      {({ w }) => (
        <MediaQuery query="(min-width: 800px)">
          {(ok) => ( ... )}   // cada nivel más indentado
        </MediaQuery>
      )}
    </WindowSize>
  )}
</MousePosition>
```

Solución: extrae hooks (`useMouse()`, `useWindowSize()`, `useMediaQuery()`) y combínalos en **un** componente. Si ya ves tres niveles de anidación, casi siempre toca hook.

**3. Olvidar que `children` ya no es JSX.**

```jsx
// ❌ error: children es función, no elemento
<MousePosition><p>Hola</p></MousePosition>
// dentro: children(pos) fallaría ("children is not a function")
```

Solución: documenta el contrato del componente (o usa la prop `render` para hacerlo obvio).

## Conceptos clave

- **Render prop**: componente con lógica que entrega datos mediante una **función**; la UI la decide el consumidor.
- **`children(pos)`**: el padre **llama** a la función con el estado/`data` actual.
- **Function as child** vs **function as prop (`render`)**: mismo patrón, distinta sintaxis; `render` es más explícito.
- **Comparación**: hooks = lógica (default), render props = lógica + UI variable, HOC = envolver terceros/legacy.
- **Trampas**: subcomponente nuevo en cada render (pierde estado) y pirámide de callbacks (sustituye por hooks).
- **Evolución moderna**: muchos render props se reimplementan como custom hooks.

## Autoevaluación

**1. ¿Por qué `MousePosition` es reutilizable en un mapa y en un debugger de layout sin cambiar su código?**

<details>
<summary>Respuesta</summary>

Porque `MousePosition` no conoce la UI: solo suscribe `pointermove`, guarda `{x, y}` en estado y se lo pasa a `children(pos)`. Quien usa el componente decide si muestra un párrafo, un mapa o un crosshair, sin tocar la lógica de eventos.

</details>

**2. En una frase: ¿qué diferencia hay entre *function as child* y *function as prop*?**

<details>
<summary>Respuesta</summary>

Cambia la forma de entrega: en *function as child* va dentro de las etiquetas (`{({x,y}) => …}`), en *function as prop* va en una prop llamada `render` (`render={({x,y}) => …}`). La lógica interna es idéntica; solo cambia la sintaxis y `render` es más visible y explícito en el DevTools.

</details>

**3. Tu compañero escribe 4 niveles de render props anidados y el JSX es inmantenible. ¿Qué le aconsejas y por qué?**

<details>
<summary>Respuesta</summary>

Que extraiga la lógica de cada nivel a custom hooks (`useMouse`, `useWindowSize`, `useMediaQuery`…) y los combine en un solo componente. Los hooks eliminan la pirámide de callbacks y dejan la UI plana; se guarda el render prop solo si la UI debe variar en runtime.

</details>

**4. Ves: "el estado del panel de coordenadas se resetea en cada render". ¿Causa más probable y cómo lo arreglas? (Menciona el ejemplo relacionado.)**

<details>
<summary>Respuesta</summary>

Causa probable: el callback define un componente nuevo cada render (`const Grafico = () => …` dentro del padre), React ve un tipo distinto y remonta el árbol perdiendo estado. Solución: definirlo fuera del render o memorizar con `useMemo`/`useCallback`. Para ver la misma lógica bien resuelta, compara `src/patterns/RenderPropsMouse.jsx` con el hook `src/hooks/useMouse.js`.

</details>
