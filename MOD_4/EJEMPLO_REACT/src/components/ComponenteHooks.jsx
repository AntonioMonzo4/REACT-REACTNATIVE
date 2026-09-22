import { useState, useEffect } from "react"

// useState es un hook que nos permite agregar estado a un componente funcional.
// Puede haber en el mismo componente funcional varios useState, cada uno con su
// propio estado. Cada vez que se actualiza el estado, el componente se vuelve a
// renderizar.
//
// useEffect es un hook que nos permite realizar efectos secundarios en un
// componente funcional.
//
// useContext es un hook que nos permite acceder al contexto de un componente
// funcional (ver Módulo 6: React Avanzado).

export default function ComponenteHooks() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const [items, setItems] = useState([])
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    console.log("useEffect se ejecuta cada vez que count cambia")
  }, [count])

  useEffect(() => {
    console.log("useEffect se ejecuta solo una vez cuando el componente se monta")
  }, [])

  useEffect(() => {
    console.log("useEffect se ejecuta cuando auth cambia")
  }, [auth])

  useEffect(() => {
    console.log("useEffect se ejecuta cuando items cambia")
  }, [items])

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`])
  }

  return (
    <div>
      <h1>Componente Hooks</h1>

      <button onClick={() => setCount(count + 1)}>Incrementar</button>
      <p>Count: {count}</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Escribe tu nombre"
      />
      <p>Hola, {name || "desconocido"}</p>

      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Ocultar" : "Mostrar"} mensaje
      </button>
      {isVisible && <p>¡Puedo mostrar y ocultarme!</p>}

      <button onClick={addItem}>Añadir item</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button onClick={() => setAuth(!auth)}>
        {auth ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
      <p>auth: {auth ? "true" : "false"}</p>
    </div>
  )
}
