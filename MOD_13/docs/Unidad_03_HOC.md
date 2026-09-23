# Unidad 03 — Higher Order Components (HOC)

## Idea

Función que **recibe un componente y devuelve otro** con props/capacidades extra:

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

## Firmas habituales

```jsx
// Configurada
const withLogging = (nombre) => (Component) => (props) => {
  console.log(nombre, props)
  return <Component {...props} />
}

export default withLogging('UserCard')(UserCard)
```

## Pros / contras

| + | − |
|---|---|
| Reutiliza lógica sin copiar | **Static hoisting** fácil de olvidar (`hoist-non-react-statics`) |
| Envuelve 3rd party components | Refs/wrappers: `forwardRef` a menudo |
| | Prop drilling del HOC; nombres de props ambiguos (`onSuccess`×N) |
| | Depurar doble capa en DevTools |

## HOC vs render props vs hooks

- **Hooks** para estado/efectos en tus componentes.
- **HOC** si necesitas envolver un componente que **no controlas** o migrar legacy.
- **Render props** si la UI del consumidor debe variar en render.

## Errores comunes

- No propagar `...rest` / `key`.
- Renombrar props de forma opaca (`data` → `injectedData` sin documentar).

## En el ejemplo

`withTrace.jsx` — log de props al montar/unmount.
