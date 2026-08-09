import { useState, useEffect } from "react" 



export default function ComponenteHooks() {

    // useState es un hook que nos permite agregar estado a un componente funcional. Puede existir vRIOA EN EL MISMO COMPONENTE FUNCIONAL VARIOS useState, cada uno con su propio estado. Cada vez que se actualiza el estado, el componente se vuelve a renderizar.
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

//Ejmplo hookk UseMemo: useMemo es un hook que nos permite memorizar un valor calculado para 
// evitar cálculos innecesarios en cada renderizado.
//  Se utiliza para optimizar el rendimiento de un componente, evitando que se recalculen valores que no han cambiado.

import { useMemo, useState } from "react";

export default function ComponenteUseMemo() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState("");
    
    const expensiveValue = useMemo(() => {
        console.log("Calculando valor costoso...");
        return count * 2;
    }, [count]);

    return (
        <div>
            <h1>Componente UseMemo</h1>
            <button onClick={() => setCount(count + 1)}>Incrementar</button>
            <p>Count: {count}</p>
            <p>Valor costoso: {expensiveValue}</p>
        </div>
    )
}
