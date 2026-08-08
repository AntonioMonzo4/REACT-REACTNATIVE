import { useState, useEffect } from "react" 



export default function ComponenteHooks() {

    // useState es un hook que nos permite agregar estado a un componente funcional.
    // useEffect es un hook que nos permite realizar efectos secundarios en un componente funcional.
    // useContext es un hook que nos permite acceder al contexto de un componente funcional.

    const [count, setCount ] = useState(0)
    const [name, setName ] = useState("")
    const [isVisible, setIsVisible ] = useState(true)
    const [items, setItems ] = useState([])
    const [auth, setAuth ] = useState(false)

    useEffect(() => {
        console.log("useEffect se ejecuta cada vez que el componente se renderiza")
    }, [count])

    useEffect(() => {
        console.log("useEffect se ejecuta solo una vez cuando el componente se monta")
    }, [])

    useEffect(() => {
        console.log("useEffect se ejecuta cada vez que el componente se renderiza y el estado de auth cambia")
    }, [auth])

    useEffect(() => {
        console.log("useEffect se ejecuta cada vez que el componente se renderiza y el estado de items cambia")
    }, [items])
    
    return (


        <div>
            <h1>Componente Hooks</h1>
            <button onClick={() => setCount(count + 1)}>Incrementar</button>
            <p>Count: {count}</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />    
            
        </div>
    )
}