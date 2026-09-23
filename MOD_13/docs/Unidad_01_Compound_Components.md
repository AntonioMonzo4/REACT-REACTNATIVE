# Unidad 01 — Compound Components

## Objetivos

- Entender qué es un **Compound Component** y por qué comparte estado de forma implícita.
- Diferenciar una API "de familia" (`Tabs`, `Tabs.Tab`) de un componente con veinte props.
- Implementar un conjunto `Tabs / Tab / TabPanel` mínimo usando `Context` + `useState`.
- Saber cuándo conviene este patrón y cuándo es exagerado.
- Detectar los errores típicos de exportación y de contexto ausente.

## Requisitos

- Haber completado los módulos de fundamentos de React (M4–M12): componentes, props, estado (`useState`) y contexto (`createContext`).
- Saber leer JSX compuesto (`<A><B/></A>`) y entender qué son los `children`.
- No hace falta conocer TypeScript: esta unidad usa JavaScript (`.jsx`) para no distraer del patrón.

## La idea en palabras simples

Un **Compound Component** (componente compuesto) es un conjunto de componentes que **parecen hermanos sueltos en el JSX pero en realidad cooperan**: el padre guarda el estado y los hijos lo leen sin que tú tengas que cablearle props a cada uno.

La analogía clásica es un **estéreo o una cadena de montaje**: el amplificador (padre) decide el canal activo y los altavoces (hijos) simplemente suenan; nadie le pasa el canal a cada altavoz con un cable. El estado vive arriba, fluye abajo por contexto, y el JSX de quien usa la librería se lee como una frase:

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

**Qué significa cada línea:**

- `<Tabs>` es el **dueño del estado**: sabe qué pestaña está activa (`activo`).
- `<Tabs.Tab id="a">` solo necesita su `id`; al hacer clic, avisa al padre "soy la `a`".
- `<Tabs.Panel id="a">` compara su `id` con el estado para decidir si se muestra.

**Por qué importa:** el padre (`Tabs`) guarda el tab activo; los hijos se registran y leen sin props manuales en cada hijo. Sin este patrón, el consumidor tendría que hacer algo horrible como `<Tabs activo={x} onChange={setX}><Tab id="a" activo={x} onClick={...}/>` — es decir, repetir el cableado en cada uso.

## Implementación mínima

Vamos paso a paso. Primero creamos el contexto; el valor por defecto `null` significa "si alguien usa `Tab` fuera de `Tabs`, algo va mal" (lo verás en *Errores comunes*):

```jsx
const TabsCtx = createContext(null)
```

Luego el componente padre: guarda el estado y se lo reparte por contexto. Fíjate que `Tabs` **no dibuja nada por sí mismo**: solo envuelve (`Provider`) y deja que sus hijos compongan la UI:

```jsx
export function Tabs({ children }) {
  const [activo, setActivo] = useState(null)
  return (
    <TabsCtx.Provider value={{ activo, setActivo }}>{children}</TabsCtx.Provider>
  )
}
```

Y un hijo que consume ese contexto — aquí está la magia: `Tab` **no recibe** `activo` ni `setActivo` por props; los lee del contexto:

```jsx
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

**Qué significa `aria-selected`:** es un atributo de accesibilidad; React lo convierte a `aria-selected="true|false"` y los lectores de pantalla anuncian qué pestaña está seleccionada. Un Compound Component bien hecho también cuida esto.

`TabPanel` sigue la misma lógica: lee `activo` y solo renderiza si `activo === id`:

```jsx
export function TabPanel({ id, children }) {
  const { activo } = useContext(TabsCtx)
  if (activo !== id) return null
  return <div role="tabpanel">{children}</div>
}
```

Por último, la exportación que da la API "de familia": asignamos propiedades al componente padre para que el JSX se lea como `<Tabs.Tab>`:

```jsx
Tabs.List = TabsList
Tabs.Tab = Tab
Tabs.Panel = TabPanel
export default Tabs
```

> **Nota sobre el ejemplo del módulo:** `src/patterns/compound/Tabs.jsx` exporta los tres componentes **con nombre** (`export function Tabs/Tab/TabPanel`) y `App.jsx` los importa así (`import { Tabs, Tab, TabPanel } from './patterns/compound/Tabs.jsx'`), componiéndolos como `<Tab>`/`<TabPanel>` sueltos dentro de `<Tabs>`. Ambas formas son válidas: la API de familia (`Tabs.Tab`) agrupa el naming; los exports con nombre son más cortos. Lo esencial del patrón —estado en el padre, contexto hacia los hijos— es idéntico.

### Cómo se arma el conjunto completo

```jsx
export default function PerfilPage() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab id="a">Perfil</Tabs.Tab>
        <Tabs.Tab id="b">Ajustes</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="a">Datos del usuario…</Tabs.Panel>
      <Tabs.Panel id="b">Preferencias…</Tabs.Panel>
    </Tabs>
  )
}
```

## Cuándo usarlo (y cuándo no)

| Situación | ¿Compound Components? |
|-----------|------------------------|
| Select, Accordion, Menu, Stepper, Tabs… APIs "de familia" | Sí, encaja perfecto |
| Quieres **flexibilidad de composición** con **API corta** en el 90 % de casos | Sí |
| Un botón suelto con `onClick` | No; es un componente normal |
| El estado no lo comparten los hijos (solo lo consume el padre) | No hace falta contexto; props bastan |
| Solo un hijo necesita el estado | Mejor pásalo por props: es más explícito |

**Por qué importa:** el patrón brilla cuando **varios** hijos necesitan **el mismo** estado. Si solo uno lo necesita, contexto es artillería para matar moscas.

## En el ejemplo

`src/patterns/compound/Tabs.jsx` — Tabs / Tab / TabPanel (exports con nombre, consumidos en `App.jsx`).

## Errores comunes

**1. Romper el naming (`Tab` vs `Tabs.Tab`) en la exportación.**

```jsx
// ❌ Mal: exportas sueltos y el JSX de arriba falla
export { Tabs, Tab, TabPanel }

// ✅ Bien: el consumidor usa la API de familia
Tabs.List = TabsList
Tabs.Tab = Tab
Tabs.Panel = TabPanel
```

Solución: adjunta los subcomponentes como propiedades del padre *antes* de exportarlo, y usa siempre `<Tabs.Tab>` en el JSX.

**2. No proveer contexto por defecto → errores confusos fuera del padre.**

```jsx
// ❌ Si usas <Tab> sin <Tabs>, useContext devuelve null y explota:
const { activo } = useContext(TabsCtx)   // Cannot destructure 'activo' of null

// ✅ Solución: valor por defecto con forma conocida y error claro
const TabsCtx = createContext(null)
// o mejor: createContext con un valor dummy + guard en cada hijo
if (!TabsCtx) throw new Error('Tab debe usarse dentro de <Tabs>')
```

Solución: da un valor por defecto seguro o valida explícitamente y lanza un mensaje tipo "*`Tab` debe usarse dentro de `<Tabs>`*", que se entiende al instante en la consola.

**3. Olvidar reiniciar el estado al cambiar los hijos.**

Si los `id` de las pestañas cambian dinámicamente, `activo` puede quedar apuntando a un `id` que ya no existe (ningún panel visible). Solución: valida que `activo` siga en la lista de ids o resetea el estado cuando cambien.

## Conceptos clave

- **Compound Component**: familia de componentes (`Padre` + `Padre.Hijo`) que comparten estado implícito.
- **Estado implícito**: el hijo no recibe el estado por props; lo lee de `Context`.
- **Padre como Provider**: `Tabs` guarda `activo` y solo envuelve con `TabsCtx.Provider`.
- **API de familia**: `Tabs.List`, `Tabs.Tab`, `Tabs.Panel` — se logra asignando props al componente padre.
- **Cuándo**: componentes "de conjunto" con varios hijos que comparten el mismo estado.
- **Cuidado**: naming roto, contexto sin default y estado desincronizado de los `id`.

## Autoevaluación

**1. ¿Qué papel juega `Tabs` y cómo llega el estado hasta `Tab` sin props manuales?**

<details>
<summary>Respuesta</summary>

El padre `Tabs` hace tres cosas: (1) guarda el estado `activo` con `useState`, (2) lo expone a todos los descendientes mediante `TabsCtx.Provider`, y (3) no dibuja UI propia, solo deja que `children` compongan la vista. El canal es el `Context` (`TabsCtx`): cada hijo lo extrae con `useContext(TabsCtx)`, así que no hay prop drilling.

</details>

**2. ¿Por qué decirías que este patrón da una "API corta en el 90 % de casos"?**

<details>
<summary>Respuesta</summary>

Porque quien consume la librería solo escribe `<Tabs>…</Tabs>` y coloca los hijos donde los necesita: no debe cablear `activo`/`onChange` a mano en cada pestaña ni en cada panel. La complejidad queda escondida dentro del conjunto.

</details>

**3. Ves en consola: `TypeError: Cannot destructure property 'activo' of 'undefined'`. ¿Cuál es la causa más probable y cómo la arreglas?**

<details>
<summary>Respuesta</summary>

Causa: alguien renderiza `<Tab>` (o `<Tabs.Panel>`) fuera de `<Tabs>`, así que `useContext` devuelve el valor por defecto `null`/`undefined`. Solución: poner un default seguro en `createContext` y/o lanzar un error explícito tipo "*Tab debe usarse dentro de `<Tabs>`*" al consumirlo.

</details>

**4. ¿Dónde vive este patrón en la práctica del módulo?**

<details>
<summary>Respuesta</summary>

En `src/patterns/compound/Tabs.jsx`, que implementa `Tabs / Tab / TabPanel` con contexto compartido; ábrelo y compáralo con el código mínimo de esta unidad.

</details>
