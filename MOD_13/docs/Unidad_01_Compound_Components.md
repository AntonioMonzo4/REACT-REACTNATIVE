# Unidad 01 — Compound Components

## Idea

Componentes que comparten **estado implícito** vía contexto y se componen como un “todo” legible:

```jsx
<Tabs>
  <Tabs.List>
    <Tabs.Tab id="a">Perfil</Tabs.Tab>
    <Tabs.Tab id="b">Ajustes</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="a">…</Tabs.Panel>
  <Tabs.Panel id="b">…</Tabs.Panel>
</Tabs>
```

El padre (`Tabs`) guarda el tab activo; los hijos se registran/leen sin props manuales en cada hijo.

## Implementación mínima

```jsx
const TabsCtx = createContext(null)

export function Tabs({ children }) {
  const [activo, setActivo] = useState(null)
  return (
    <TabsCtx.Provider value={{ activo, setActivo }}>{children}</TabsCtx.Provider>
  )
}

export function Tab({ id, children }) {
  const { activo, setActivo } = useContext(TabsCtx)
  return (
    <button
      type="button"
      aria-selected={activo === id}
      onClick={() => setActivo(id)}
    >
      {children}
    </button>
  )
}
```

## Cuándo

- Select, Accordion, Menu, Stepper… APIs “de familia”.
- Quieres **flexibilidad de composición** con **API corta** en el 90 % de casos.

## Errores comunes

- Romper naming (`Tab` vs `Tabs.Tab`) en la exportación.
- No proveer contexto por defecto → errores confusos fuera del padre.

## En el ejemplo

`src/patterns/compound/Tabs.jsx` — Tabs / Tab / TabPanel.
