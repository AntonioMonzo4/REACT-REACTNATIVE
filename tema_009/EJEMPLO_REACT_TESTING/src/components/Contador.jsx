import { useState } from 'react'

export default function Contador({ inicial = 0 }) {
  const [valor, setValor] = useState(inicial)

  return (
    <div>
      <p>Valor: {valor}</p>
      <button type="button" onClick={() => setValor((v) => v + 1)}>
        Incrementar
      </button>
      <button type="button" onClick={() => setValor(inicial)}>
        Reiniciar
      </button>
    </div>
  )
}
