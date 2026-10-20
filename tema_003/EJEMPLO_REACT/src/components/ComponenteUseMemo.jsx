import { useMemo, useState } from "react"

// Ejemplo hook useMemo: useMemo nos permite memorizar un valor calculado para
// evitar cálculos innecesarios en cada renderizado.
// Se utiliza para optimizar el rendimiento de un componente, evitando que se
// recalculen valores que no han cambiado.

export default function ComponenteUseMemo() {
  const [count, setCount] = useState(0)

  const expensiveValue = useMemo(() => {
    console.log("Calculando valor costoso...")
    return count * 2
  }, [count])

  return (
    <div>
      <h1>Componente UseMemo</h1>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
      <p>Count: {count}</p>
      <p>Valor costoso: {expensiveValue}</p>
    </div>
  )
}
