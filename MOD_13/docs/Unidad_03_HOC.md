# Unidad 03 — Higher Order Components (HOC)

## Objetivos

- Definir un HOC: función que **recibe un componente y devuelve otro** con props/capacidades extra.
- Implementar `withTheme` y una variante **configurable** `withLogging('UserCard')`.
- Conocer el *static hoisting* y por qué se usa `hoist-non-react-statics`.
- Ponderar pros/contras en una tabla y decidir entre HOC, render props y hooks.
- Evitar errores de `...rest`, `key` y renombres de props opacos.

## Requisitos

- M4–M12: componentes, props, spread (`{...props}`), hooks básicos (`useTheme` aquí se da por hecho como custom hook).
- Haber leído la Unidad 02 (Render Props) ayuda a entender la comparación final.
- TypeScript no es obligatorio: los ejemplos son `.jsx`.

## La idea en palabras simples

Un **Higher Order Component (HOC)** es una **función de orden superior**: recibe un componente y devuelve **otro componente** envuelto, que inyecta props o capacidades extra.

**Analogía:** es el **decorador de regalo**: el regalo (tu componente) sigue siendo el mismo por dentro, pero llega envuelto con lazo (tema, logs, permisos, tracking). Quien abre el paquete no tiene que comprar el lazo aparte.

```jsx
function withTheme(Component) {
  return function Wrapped(props) {
    const { theme, toggle } = useTheme()
    return <Component {...props} theme={theme} toggleTheme={toggle} />
  }
}

const BotonConTema = withTheme(Boton)
// <BotonConTema theme="dark" ... /> — HOC inyecta theme
```

**Qué significa:** `Boton` no sabe nada de temas; `withTheme(Boton)` crea un wrapper que lee el tema con `useTheme()` y se lo pasa como props. `BotonConTema` se usa como cualquier componente.

**Por qué importa:** reutilizas lógica **sin copiarla** en cada componente y sin obligar al componente envuelto a conocer esa lógica. Es el mismo objetivo que los hooks y las render props, con otra mecánica.

## Firmas habituales

### 1. HOC simple (recibe componente, devuelve componente)

```jsx
const BotonConTema = withTheme(Boton)
```

### 2. HOC configurable (firma curried / doble función)

La forma **configurada** recibe primero los **parámetros del HOC** y después el componente. Es la que verás mucho en librerías antiguas (`connect()`, `withStyles()`…):

```jsx
// Configurada
const withLogging = (nombre) => (Component) => (props) => {
  console.log(nombre, props)
  return <Component {...props} />
}

export default withLogging('UserCard')(UserCard)
```

Léelo así: `withLogging('UserCard')` devuelve "un HOC que sabe que se llama UserCard", y ese HOC aplicado a `UserCard` devuelve el componente envuelto que imprime sus props.

**Por qué importa:** el parámetro `nombre` deja configurar el HOC (aquí, el etiquetado del log) sin tener que tocar el componente envuelto.

## Pros / contras

| + | − |
|---|---|
| Reutiliza lógica sin copiar | **Static hoisting** fácil de olvidar (`hoist-non-react-statics`) |
| Envuelve 3rd party components | Refs/wrappers: `forwardRef` a menudo |
| | Prop drilling del HOC; nombres de props ambiguos (`onSuccess`×N) |
| | Depurar doble capa en DevTools |

Explicación de cada punto:

- **Static hoisting**: los métodos estáticos de `Component` (p. ej. `Boton.parse`) **no** pasan solos al wrapper; hay que copiarlos con `hoist-non-react-statics` o a mano.
- **Refs**: el `ref` apunta al wrapper, no al DOM; si el hijo necesita el ref real, el HOC debe usar `forwardRef`.
- **Prop drilling / nombres ambiguos**: si dos HOC inyectan ambos `onSuccess`, chocan; conviene prefijar (`onLoginSuccess`) o documentar.
- **DevTools**: verás `withTheme(withLogging(Boton))` — capas dobles que ralentizan la depuración.

## HOC vs render props vs hooks

Guía de decisión:

- **Hooks** para estado/efectos en **tus** componentes → es el default moderno.
- **HOC** si necesitas envolver un componente que **no controlas** (librería externa, código legacy) o migrar gradualmente.
- **Render props** si la UI del consumidor debe variar **en cada render**.

| Necesidad | Patrón recomendado |
|-----------|--------------------|
| Lógica propia + UI propia | Custom hook |
| UI que decide el consumidor en runtime | Render prop |
| Envolver tercero / migrar legacy / inyectar props | HOC |

**Por qué importa:** elegir HOC por costumbre en código nuevo introduce las capas y los problemas de refs sin aportar nada que un hook no resuelva más simple.

## En el ejemplo

`withTrace.jsx` — log de props al montar/unmount (firma `withTrace(Component, nombre)` con `displayName`).

## Errores comunes

**1. No propagar `...rest` / `key`.**

```jsx
// ❌ Mal: descartas el resto de props y además pisas el key equivocado
function Wrapped({ children }) {
  return <Component>{children}</Component>
}

// ✅ Bien: repartes las props que inyectas y dejas pasar el resto
function Wrapped(props) {
  const { theme, toggleTheme, ...rest } = props
  return <Component {...rest} theme={theme} toggleTheme={toggle} />
}
```

Solución: destructura solo las props que **inyecta** el HOC y propaga el resto con `...rest`. `key` y `ref` no se pasan como props normales (React los trata aparte); si necesitas `ref` hacia el hijo, envuelve con `forwardRef`.

**2. Renombrar props de forma opaca (`data` → `injectedData` sin documentar).**

```jsx
// ❌ opaco: quien lee el hijo no sabe de dónde sale injectedData
return <Component {...props} injectedData={datos} />

// ✅ contrato claro: nombre predecible o documentado en la firma
return <Component {...props} data={datos} />   // y anotar en el README del HOC
```

Solución: acuerda un naming (`theme`, `logger`, `onFetchSuccess`) y **documenta** las props que el HOC garantiza; si renombras, hazlo explícito.

**3. Olvidar el static hoisting.**

```jsx
BotonConTema.parse  // undefined, aunque Boton.parse existía
```

Solución: copia estáticos con `hoist-non-react-statics` (o defínelos donde no haga falta copiarlos).

## Conceptos clave

- **HOC**: `Component → Component` con props/capacidades extra; patrón de **orden superior** (función que fabrica componentes).
- **Wrapper**: el componente devuelto lee contexto/hooks y hace `{...props}` hacia el hijo.
- **Firma configurable**: `(params) => (Component) => (props) => JSX` — típica de librerías legacy.
- **Static hoisting**: los estáticos no se propagan solos; usa `hoist-non-react-statics`.
- **Refs**: a menudo hace falta `forwardRef` para que el ref llegue al DOM real.
- **Elección**: hooks por defecto; HOC para terceros/legacy; render props si la UI varía en runtime.
- **Riesgos**: props ambiguas, prop drilling del wrapper y depuración por capas en DevTools.

## Autoevaluación

**1. En tus palabras: ¿qué hace exactamente `withTheme(Component)`?**

<details>
<summary>Respuesta</summary>

Es una función que acepta un componente (`Component`) y devuelve **otro componente** (el wrapper `Wrapped`) que renderiza al primero añadiendo props (`theme`, `toggleTheme`) que el original no calcula por sí mismo.

</details>

**2. ¿Por qué `BotonConTema.algoEstatico` puede ser `undefined` si `Boton.algoEstatico` existía?**

<details>
<summary>Respuesta</summary>

Porque no se propagan los estáticos: React **no** copia las propiedades estáticas del componente original al wrapper. Hay que trasladarlas a mano o con `hoist-non-react-statics` (el *static hoisting* de la tabla de contras).

</details>

**3. Explica la línea `export default withLogging('UserCard')(UserCard)`.**

<details>
<summary>Respuesta</summary>

Se lee de izquierda a derecha: `withLogging('UserCard')` devuelve un HOC "configurado" con ese nombre; aplicarlo a `UserCard` devuelve el envuelto que hace `console.log` de las props antes de renderizar. Es la firma curried clásica de HOCs configurables.

</details>

**4. Menciona dos desventajas prácticas de un HOC frente a un custom hook.**

<details>
<summary>Respuesta</summary>

Cualquier par de: capas de componentes extra que dificultan la depuración en DevTools; problemas de `ref` (hace falta `forwardRef`); estáticos que no se propagan; renombres de props ambiguos (`onSuccess`×N) y prop drilling del wrapper. Además el wrapper puede re-renderizar de más si no se memoriza. (El ejemplo `src/patterns/withTrace.jsx` muestra un HOC de log al montar/desmontar.)

</details>
