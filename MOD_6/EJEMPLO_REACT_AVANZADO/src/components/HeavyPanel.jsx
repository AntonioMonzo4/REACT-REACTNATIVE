export default function HeavyPanel() {
  // Simula un componente pesado (chunk separado por React.lazy)
  const rows = Array.from({ length: 20 }, (_, i) => `Fila #${i + 1} — datos del dashboard`)

  return (
    <div>
      <p className="badge">HeavyPanel cargado con import() dinámico</p>
      <ul className="list">
        {rows.map((row) => (
          <li key={row}>{row}</li>
        ))}
      </ul>
    </div>
  )
}
