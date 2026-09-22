# Unidad 06 — Comunicación entre componentes

## 1. Padre → Hijo (props)

Flujo normal: el padre pasa datos y callbacks.

```jsx
function Padre() {
  const [count, setCount] = useState(0)
  return <Hijo count={count} onAdd={() => setCount((c) => c + 1)} />
}
```

## 2. Hijo → Padre (callback)

El hijo **no** muta props; **llama** a la función que el padre le dio.

```jsx
function Hijo({ count, onAdd }) {
  return <button onClick={onAdd}>Soy hijo: {count}</button>
}
```

## 3. Hermanos (subir al padre)

Los hermanos **no** se pasan estado directamente. El estado vive en el **menor ancestro común**:

```
      Padre (estado: selected)
       /              \
   HermanoA         HermanoB
  (dispara)        (lee selected)
```

```jsx
function Padre() {
  const [selected, setSelected] = useState(null)
  return (
    <>
      <Lista onSelect={setSelected} />
      <Detalle item={selected} />
    </>
  )
}
```

## 4. “Prop drilling” y cuándo subir de nivel

- 2–3 niveles de props: **normal**, no hace falta Context todavía.
- El mismo estado/callback atraviesa **muchos** niveles sin usarlo en los intermedios → candidato a **Context** (Módulo 6) o estado global.

## 5. Patrones útiles

| Patrón | Cuándo |
|--------|--------|
| Estado en el padre | hermanos deben sincronizarse |
| Callback + estado en hijo | hijo controlado por el padre |
| Render props / children function | el padre decide qué renderiza el hijo |
| Componente controlado (`isOpen`, `onClose`) | modals, drawers, tabs |

## Checklist de diseño

1. ¿Quién **necesita** el dato para pintarlo? → ahí suele vivir el estado.
2. ¿Quién **provoca** el cambio? → recibe el callback.
3. ¿Se repite el drilling sin sentido? → extraer contexto o mover estado hacia arriba.
4. ¿Dos hermanos comparten datos? → estado en el padre (o store en M9).

## En el ejemplo del proyecto

Ver `src/components/Comunicacion.jsx`: padre con contador, hijo que notifica y dos hermanos (lista + resumen) sincronizados.
