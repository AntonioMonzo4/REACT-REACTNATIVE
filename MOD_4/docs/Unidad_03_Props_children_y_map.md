# Unidad 03 — Props, children y listas con `map`

## Sintaxis de props

En la función debemos indicar el objeto parámetro `props`.
Puedes acceder a los demás mediante `props.price`, o desestructurarlos:

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

### Variantes de acceso (ejemplo del curso)

1. `props.title` — acceso por punto.
2. **Desestructuración en los parámetros**: `({ title, description })` — recomendada.
3. Desestructuración en el cuerpo: `const { title, description } = props`.

**Los props son inmutables**: no se modifican desde el hijo; el padre decide los valores.

## `children`

Contenido entre las etiquetas de apertura y cierre:

```jsx
<Card>
  <p>Texto embebido</p>
</Card>
// en Card: {children}
```

## `key` en listas

`key` es una prop **especial** de React: la extrae del objeto props y el componente hijo **no** la recibe.

## Iterar con `map`

Para iterar vamos a usar `map`. Esto se incluye en el **elemento padre**:

```jsx
<ul>
  {data.map((guitar) => (
    <li key={guitar.id}>
      {guitar.name} - {guitar.price}
    </li>
  ))}
</ul>
```

- Aquí irá la información que queremos iterar (objetos, respuesta de una API...).
- Si especificamos un elemento JSX (`li`, `article`...), este se actualizará en
  función de los datos con los **props**.
- **Importante:** cada elemento de la lista necesita una prop `key` única
  (normalmente el `id` del recurso) para que React identifique los cambios.

## En el ejemplo

- [`Props.jsx`](../EJEMPLO_REACT/src/components/Props.jsx) — 3 variantes + nota de `key`.
- [`App.jsx`](../EJEMPLO_REACT/src/App.jsx) — `<Props title="..." description="..." />`.
