# Unidad 05 — Error Boundaries

## Objetivos

- Entender qué es un Error Boundary y por qué, sin él, un error de render deja la app en blanco.
- Escribir un ErrorBoundary completo con `constructor`, `static getDerivedStateFromError`, `componentDidCatch` y `render` con fallback y botón "Reintentar".
- Saber dónde colocar los boundaries en el árbol (rutas/secciones, Suspense + lazy, widgets arriesgados).
- Distinguir, con una tabla clara, qué errores captura un boundary y qué errores debes resolver con `try/catch` o `.catch`.
- Implementar el reset del boundary (cambiar `key` o limpiar `error` del estado).
- Localizar la implementación del curso: `../EJEMPLO_REACT_AVANZADO/src/components/ErrorBoundary.jsx` y `DemoErrorBoundary.jsx`.

## Requisitos

- **Clases ES6 de JavaScript**: `constructor`, `super`, `static`, propiedades de instancia (`this.state`) y `this.setState`. Si todavía no dominas `class` de ES6, repasa JS antes de esta unidad, porque un Error Boundary **no** se puede escribir con un componente de función.
- **Componentes de M4**: sabes qué es el ciclo de vida de un componente de clase (`componentDidMount`, `render`, etc.) y qué es el "subtree" (el árbol de hijos, nietos, etc. que cuelgan de un componente).
- Conviene haber visto en M4 cómo se propaga un error de render en React (si nadie lo captura, React desmonta todo el árbol).

## Qué son los Error Boundaries

Un Error Boundary es un **componente de clase** que **captura errores de render** que ocurreen dentro de su subtree (hijos, nietos, bisnietos...) y, en lugar de dejar la pantalla en blanco, muestra una **UI de respaldo** (el *fallback*).

**Analogía:** piensa en un **fusible eléctrico** de tu casa. Si un aparato (una bombilla, un horno) falla con una sobrecarga, el fusible salta y se queda la luz del resto de la casa encendida; solo se apaga el circuito protegido. Sin fusible, la sobrecaja puede quemar toda la instalación. El Error Boundary es ese fusible: el "corto circuito" es un error de render, el circuito protegido es el subtree, y el fallback es el interruptor que puedes volver a subir.

**Qué significa en la práctica:** cuando un componente falla durante `render`, React no tiene dónde seguir dibujando ese nodo del árbol. Si no existe ningún boundary por encima, React desmonta **toda** la aplicación y el usuario ve una página blanca (en producción, el famoso blanco sin explicación). El boundary intercepta el error, guarda algo de información en su estado y decide renderizar otra cosa: un mensaje de error, un botón de reintento, un SVG triste... lo que quieras.

**Por qué importa:** en una app real siempre habrá fallos imprevisibles: una API que responde con `null`, un campo `undefined` en un objeto de terceros, un chunk de código que no se descarga. Sin boundary, el usuario pierde **toda** la sesión con una pantalla vacía. Con boundary, pierde solo una sección y puede reintentar.

### ¿Por qué solo con clases? (nota importante)

React **no ofrece error boundaries con hooks todavía**: la API oficial está compuesta por los dos métodos de ciclo de vida `static getDerivedStateFromError(error)` y `componentDidCatch(error, info)`, que solo existen en componentes de clase. No existe un `useErrorBoundary()` en la API core de React; por eso, aunque en el resto del curso uses casi exclusivamente funciones y hooks, aquí debes escribir una `class`. Es una de las últimas razones para las que sigue vivo el conocimiento de clases ES6 en React moderno.

## Ejemplo completo, línea a línea

Este es el boundary completo tal como vive en el proyecto (`src/components/ErrorBoundary.jsx`):

```jsx
import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary', error, info.componentStack)
    // aquí podrías enviar a un servicio de monitoring
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div role="alert">
            <h2>Algo salió mal</h2>
            <p>{String(this.state.error.message)}</p>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
            >
              Reintentar
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
```

Veamos cada pieza:

### `constructor(props)` — el estado inicial

```jsx
constructor(props) {
  super(props)
  this.state = { error: null }
}
```

- `super(props)` es obligatorio en cualquier constructor de clase que extienda de `Component`: llama al constructor de React y te permite usar `this.props` dentro del constructor.
- `this.state = { error: null }` crea el estado **una sola vez**, al montar. `error: null` significa "todo va bien, no he capturado nada todavía". Este único campo es todo lo que el boundary necesita recordar: **si hay un error guardado, muestro el fallback; si no, muestro a mis hijos normales**.

### `static getDerivedStateFromError(error)` — "atrapo y guardo"

```jsx
static getDerivedStateFromError(error) {
  return { error }
}
```

- Es **`static`**: pertenece a la clase, no a la instancia. React la llama **antes** de que React vuelva a renderizar los hijos tras un fallo, y lo hace **en el momento del error**, es decir, durante la fase de render. Por eso aquí **no puedes** hacer `this.setState(...)` con efectos secundarios: la convención es devolver un **nuevo estado parcial** que React fusiona.
- Recibe el objeto `error` que se lanzó y devuelve `{ error }`, o sea: "guarda este error en `state.error`".
- ¿Qué significa? Es el paso de **decisión**: a partir de ahí, `this.state.error` ya no es `null` y el siguiente `render()` mostrará el fallback. Es el equivalente declarativo a un `catch { }`: el `catch` de React durante el render.

### `componentDidCatch(error, info)` — "cuento lo que pasó"

```jsx
componentDidCatch(error, info) {
  console.error('ErrorBoundary', error, info.componentStack)
  // aquí podrías enviar a un servicio de monitoring
}
```

- Se ejecuta **después** de que el error ya fue capturado (tras el commit), cuando el fallback ya se está montando. Aquí sí es seguro usar `this.setState`, `console.*` o llamar a servicios.
- Su segundo argumento `info` contiene **`info.componentStack`**: una traza con los nombres de los componentes donde ocurrió el fallo (qué componente de qué componente de qué...). Es invaluable para depurar: te dice **dónde** en el subtree se rompió la cosa.
- **Por qué importa:** en producción no miras la consola del navegador; envías el error y su `componentStack` a un servicio de **monitoring** (Sentry, Bugsnag, tu backend...). La línea comentada del ejemplo es exactamente ese gancho: `// aquí podrías enviar a un servicio de monitoring`. `getDerivedStateFromError` decide **qué ve el usuario**; `componentDidCatch` decide **qué te enteras tú como desarrollador**.

### `render()` — el fallback y el botón "Reintentar"

```jsx
render() {
  if (this.state.error) {
    return (
      this.props.fallback ?? (
        <div role="alert">
          <h2>Algo salió mal</h2>
          <p>{String(this.state.error.message)}</p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
          >
            Reintentar
          </button>
        </div>
      )
    )
  }
  return this.props.children
}
```

- Si `this.state.error` existe (truthy), **no** renderizamos `this.props.children` (los hijos que fallaron), sino la UI de error. Si no hay error, renderizamos `this.props.children` tal cual: el boundary es invisible cuando todo va bien, es un simple contenedor.
- **`this.props.fallback ?? (...)`** usa el operador **`??` (nullish coalescing)**: si quien usa el boundary le pasa un `fallback` propio (un JSX dedicado), se usa ese; si es `undefined` o `null`, cae al fallback genérico de ejemplo. Así el componente es **reutilizable**: cada pantalla puede diseñar su propio mensaje.
- `role="alert"` es **accesibilidad**: avisa a los lectores de pantalla de que hay un mensaje importante/urgente.
- `String(this.state.error.message)` convierte el mensaje a string con seguridad: si el error no tiene `.message` (o no es un `Error` de verdad), en vez de romper otra vez mostramos `"undefined"` en texto.
- El botón **"Reintentar"** hace `this.setState({ error: null })`: limpia el error y, en el siguiente render, React vuelve a montar `this.props.children`. Si el fallo era transitorio (un dato malo de red que ya se refrescó), la sección se recupera sin recargar la página.

## Dónde colocarlos

La pregunta no es "¿uso un boundary?" sino "**¿a qué altitud del árbol lo pongo?**". Regla general: lo suficientemente alto como para que un fallo no tumbe la app entera, lo suficientemente bajo como para que solo se recupere la sección afectada.

1. **Alrededor de rutas o secciones** (no hace falta envolver toda la app si no quieres). Analogía: es mejor un fusible por habitación que un único fusible maestro. Si envuelves solo `<Routes>`, un fallo en una pantalla te deja el header y la navegación vivos; si envuelves cada ruta importante, el usuario puede incluso cambiar de pantalla tras el error.
2. **Alrededor de `Suspense` + `lazy`.** Cuando cargas componentes con `React.lazy`, puede fallar la **descarga del chunk** (un 404, un fallo de red, un despliegue con archivos viejos). Ese error aparece durante el render del lazy y, sin boundary alrededor del `Suspense`, se lleva por delante la app. Coloca el boundary **envolviendo** el `Suspense` (o cada lazy individual) para mostrar "No se pudo cargar esta sección — Reintentar".
3. **Cerca de widgets arriesgados** (integraciones de terceros). Un mapa, un widget de pago, un editor rico, un gráfico externo: código que no controlas y que puede recibir props inesperadas. Aísralo: si el widget de terceros explota, tu app core sigue funcionando.

## Qué capturan / qué no

| Capturan | No capturan |
|----------|-------------|
| Errores en render | Event handlers (`onClick`) |
| Errores en lifecycle de clase | Async fuera de React (promesas sueltas) |
| Errores de constructores de hijos | Errores en el propio ErrorBoundary |
| Errores en `useEffect` del hijo (parcialmente, según React y qué error) | `JSON.parse` en un callback si no se propaga a render |

Cómo leer esta tabla:

- **Errores en render**: sí, es su trabajo principal. También los de `constructor` de los hijos y los métodos del ciclo de vida de clase (`componentDidMount`, etc.), porque React los ejecuta dentro de su fase de render/commit.
- **`useEffect` del hijo**: solo *parcialmente*. Un error que React puede atribuir al subtree se captura, pero un error dentro de un callback asíncrono de efecto puede escapar (React ha ido cambiando el comportamiento entre versiones, así que no lo asumas como garantía absoluta).
- **Event handlers (`onClick`)**: **no**. El handler se ejecuta fuera del ciclo de render de React, en un evento del navegador; el boundary no está "escuchando". → **Solución: `try/catch`** dentro del propio handler.
- **Async fuera de React (promesas sueltas)**: **no**. Un `fetch(...).then(...)` con un fallo dentro no pasa por el render. → **Solución: `.catch(...)`** en la promesa (o `try/catch` con `await`).
- **Errores en el propio ErrorBoundary**: **no**. Un boundary no se puede proteger a sí mismo: si falla su `render`, su `getDerivedStateFromError` o su `componentDidCatch`, React sube al siguiente boundary (si existe) o, si no hay ninguno, se cae la app. Por eso en `componentDidCatch` debes escribir código que **no** pueda fallar (y envolver, por ejemplo, el envío a monitoring en su propio `try/catch`).
- **`JSON.parse` en un callback si no se propaga a render**: no captura nada que no termine rompiendo el render; si el `JSON.parse` está en un `onClick` o en un `setTimeout` y no lanzas de nuevo el error hacia el render, el boundary jamás se entera.

## Reset del boundary

Un boundary que captura un error y se queda "pegado" para siempre no sirve para reintentar. Hay dos formas de resetearlo:

- **Cambiar el `key` del boundary para forzar remount.** Cuando el `key` cambia, React desmonta la instancia vieja y crea una nueva: el estado (`error: null`) vuelve a su valor inicial y los hijos se montan de cero. Es la forma más "brutal" y fiable de garantizar un arranque limpio:

```jsx
<ErrorBoundary key={revision} fallback={<p>Fallo de la sección</p>}>
  <SeccionRiesgosa />
</ErrorBoundary>
```

```jsx
// en el padre: al pulsar "Reintentar todo"
setRevision((r) => r + 1)
```

- **Botón que limpia `error` en el estado** (como en el ejemplo de arriba): `this.setState({ error: null })`. Es más suave: mantiene la instancia y vuelve a renderizar `children`. Útil para reintentos rápidos dentro del propio fallback.

## En el ejemplo del curso

- Implementación: `../EJEMPLO_REACT_AVANZADO/src/components/ErrorBoundary.jsx`.
- Demo interactiva (dispara un error a propósito y prueba el "Reintentar"): `../EJEMPLO_REACT_AVANZADO/src/components/DemoErrorBoundary.jsx`.

## Errores comunes

**1. Esperar que el boundary capture un error de un event handler.**

```jsx
// ERROR: el boundary no ve este fallo; la app puede crashear igual
function Boton() {
  return (
    <button
      onClick={() => {
        const data = JSON.parse('{mal}') // lanza aquí, fuera del render
      }}
    >
      Probar
    </button>
  )
)
```

```jsx
// SOLUCIÓN: try/catch dentro del handler
<button
  onClick={() => {
    try {
      const data = JSON.parse('{mal}')
    } catch (err) {
      console.error('fallo en el handler', err)
    }
  }}
>
  Probar
</button>
```

**2. Olvidar `static` en `getDerivedStateFromError` (o escribirla en minúsculas).**

```jsx
// ERROR: React no la reconoce → no se guarda el error → pantalla en blanco
getDerivedStateFromError(error) {
  return { error }
}
```

```jsx
// SOLUCIÓN: debe ser estática y con ese nombre exacto
static getDerivedStateFromError(error) {
  return { error }
}
```

**3. Colocar el boundary *dentro* del componente que falla (o al mismo nivel en vez de por encima).**

```jsx
// ERROR: si Compartir falla en su propio render, su boundary interior nunca llega a montarse
function Compartir() {
  return (
    <ErrorBoundary>
      <DatosQueFalla /> {/* este está bien, pero si falla Compartir mismo, nadie lo protege */}
    </ErrorBoundary>
  )
}
```

```jsx
// SOLUCIÓN: el boundary debe ser un ANCESTOR del componente que falla
<ErrorBoundary fallback={<p>No se pudo compartir</p>}>
  <Compartir />
</ErrorBoundary>
```

**4. Esperar que el boundary capture una promesa suelta.**

```jsx
// ERROR: el .then lanza fuera del render; el boundary no se entera
fetch('/api/user').then((r) => r.json()).then((u) => {
  throw new Error('mal')
})
```

```jsx
// SOLUCIÓN: .catch en la promesa
fetch('/api/user')
  .then((r) => r.json())
  .then((u) => {
    /* ... */
  })
  .catch((err) => console.error('fallo async', err))
```

**5. Lanzar otro error dentro de `componentDidCatch` sin protegerlo.**

```jsx
// ERROR: si el servicio de monitoring también falla, se rompe el propio boundary
componentDidCatch(error, info) {
  enviarASentry(error, info.componentStack) // si esto lanza, boundary ilegal
}
```

```jsx
// SOLUCIÓN: blindar la telemetría
componentDidCatch(error, info) {
  try {
    enviarASentry(error, info.componentStack)
  } catch (e) {
    console.error('monitoring caído', e)
  }
}
```

## Conceptos clave

- **Error Boundary**: componente de clase que captura errores de render de su subtree y muestra un **fallback** en vez de dejar la app en blanco.
- **Analogía del fusible**: protege un circuito (subtree) sin tumbar toda la casa (la app).
- **Solo clases**: React aún no ofrece hooks para error boundaries; se usan `getDerivedStateFromError` y `componentDidCatch`.
- **`static getDerivedStateFromError(error)`**: fase de render; devuelve el estado parcial `{ error }` (no usa `setState`).
- **`componentDidCatch(error, info)`**: fase de commit; registra el error y **`info.componentStack`**; lugar ideal para **monitoring**.
- **`render` con `fallback ?? ...`**: si el padre pasa `fallback` se usa ese; si no, fallback genérico con `role="alert"` y botón **"Reintentar"**.
- **Dónde colocarlos**: rutas/secciones, alrededor de `Suspense` + `lazy` (fallos de chunk), widgets arriesgados de terceros.
- **Capturan**: errores de render, lifecycles de clase, constructores de hijos, parcialmente `useEffect`.
- **No capturan**: event handlers (→ `try/catch`), promesas sueltas (→ `.catch`), errores del propio boundary, callbacks que no llegan al render.
- **Reset**: cambiar el `key` del boundary (remount forzado) o limpiar `error` con `setState({ error: null })`.
- **Ejemplo del curso**: `ErrorBoundary.jsx` + `DemoErrorBoundary.jsx`.

## Autoevaluación

**1. ¿Por qué un Error Boundary debe ser una clase y no una función con hooks?**

<details>
<summary>Respuesta</summary>

Porque React solo define esta API mediante los métodos de ciclo de vida `static getDerivedStateFromError` y `componentDidCatch`, que existen únicamente en componentes de clase. React todavía no ofrece un hook equivalente en su API core, así que, para capturar errores de render, no hay alternativa con funciones.

</details>

**2. Un usuario pulsa un botón y un `JSON.parse` del handler lanza un error. Mi `<ErrorBoundary>` envuelve ese botón, pero la app se cae igual. ¿Por qué y cómo lo arreglas?**

<details>
<summary>Respuesta</summary>

Los Error Boundaries **no capturan errores en event handlers**: el handler se ejecuta fuera del ciclo de render. Solución: envolver el código del handler en `try/catch` (o, si es una promesa, añadir `.catch(...)`), y no depender del boundary para esos casos.

</details>

**3. ¿Qué diferencia práctica hay entre `getDerivedStateFromError` y `componentDidCatch`?**

<details>
<summary>Respuesta</summary>

`getDerivedStateFromError` se ejecuta **durante el render**, es `static` y solo debe devolver el estado a fusionar (`{ error }`): decide **qué ve el usuario** (activa el fallback). `componentDidCatch` se ejecuta **después del commit**, con `this` disponible: registra el error en consola y envía `error` + `info.componentStack` a un servicio de **monitoring**; decide **qué te enteras tú**.

</details>

**4. Mi fallback muestra el error para siempre aunque la causa desaparezca. Menciona dos formas de resetear el boundary.**

<details>
<summary>Respuesta</summary>

1) **Cambiar el `key`** del `<ErrorBoundary>` desde el padre (por ejemplo, `key={revision}` con `setRevision(r => r + 1)`): fuerza un remount, el estado vuelve a `error: null` y los hijos se montan de cero. 2) **Limpiar el estado** desde un botón del propio fallback: `this.setState({ error: null })`, lo que vuelve a renderizar `children` manteniendo la instancia.

</details>
