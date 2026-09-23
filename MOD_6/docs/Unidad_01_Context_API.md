# Unidad 01 — Context API

## Objetivos

- Entender **qué es el prop drilling** y por qué se convierte en un problema real a medida que crece la app.
- Comprender **qué resuelve la Context API** y qué tipo de datos conviene guardar en un contexto.
- **Crear un contexto** con `createContext`, envolver la app con un `Provider` y exponer un hook personalizado (`useTheme`).
- Aplicar las **5 reglas de uso** de Context y justificar cada una con el "por qué" técnico (re-renders, acoplamiento, errores fuera del provider).
- **Comparar Context con Redux/Zustand** (M9) para elegir la herramienta adecuada según el caso.
- Integrar el `ThemeProvider` en `App.jsx` siguiendo el ejemplo del curso.

## Requisitos

Antes de empezar esta unidad debes tener dominados los siguientes temas del módulo anterior:

- **M5 U06 — Comunicación entre componentes y prop drilling**: sabes pasar datos de padre a hijo y de hijo a nieto mediante props, y has visto el problema de "taladrar" props por niveles intermedios que no las usan.
- **`useState`**: gestionas estado local dentro de un componente y entiendes que cuando el estado cambia, el componente se vuelve a renderizar.
- **`useEffect`**: sabes qué es un ciclo de vida, cuándo se ejecuta un efecto y para qué sirve la función de *cleanup*.

Si algo de lo anterior te suena difuso, repásalo antes de continuar: Context se apoya directamente en `useState` (para mantener el valor global) y en la idea de "prop drilling" que vas a combatir aquí.

## El problema: prop drilling

Imagina una app con un tema claro/oscuro. El dato del tema vive en el componente `App`, pero lo necesitan componentes muy profundos: un `Header`, un `Sidebar`, un `Boton` dentro de un `Modal` dentro del `Sidebar`...

Sin Context, la única herramienta que conoces es pasar props:

```jsx
function App() {
  const [theme, setTheme] = useState('light')
  return <Sidebar theme={theme} toggleTheme={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} />
}

function Sidebar({ theme, toggleTheme }) {
  // Sidebar NO usa el tema, solo lo reenvía
  return <Modal theme={theme} toggleTheme={toggleTheme} />
}

function Modal({ theme, toggleTheme }) {
  // Modal TAMPOCO lo usa, solo lo reenvía
  return <Boton theme={theme} toggleTheme={toggleTheme} />
}

function Boton({ theme, toggleTheme }) {
  // ¡Aquí sí se usa!
  return <button onClick={toggleTheme}>{theme}</button>
}
```

Eso es **prop drilling** (perforado de props): `Sidebar` y `Modal` reciben datos que no les importan solo porque están en el camino. ¿Qué significa esto en la práctica?

- **Código ruidoso**: cada nivel intermedio repite `theme={theme} toggleTheme={toggleTheme}` aunque no los use.
- **Acoplamiento**: si mañana el `Boton` necesita también el `user`, tienes que volver a editar `App`, `Sidebar` y `Modal` para reenviarlo.
- **Fragilidad**: olvidar una prop en un nivel intermedio produce bugs difíciles de rastrear ("llega `undefined`... ¿quién lo perdió?").

El prop drilling no es un error de principiante: es la consecuencia natural de que los datos solo pueden bajar por props. Lo que necesitas es un **atajo**.

## Qué es Context: la analogía de la radio

**Context API** te permite definir un **valor global** (tema, usuario logueado, idioma, token de sesión...) que cualquier componente descendiente pueda leer **sin que se lo pasen por props nivel a nivel**.

La analogía clásica es la **radio emisora y antena**:

- El **Provider** es la **emisora de radio**: produce y controla el valor (emite "tema = dark").
- Los **consumidores** son las **antenas** (los componentes): solo necesitan sintonizar la frecuencia para recibir la señal. No importa cuántos muros (componentes intermedios) haya entre la emisora y la antena: la señal los atraviesa.
- El **contexto** es la **frecuencia** en sí: un canal compartido por todos los que están dentro del mismo `Provider`.

¿Qué significa esto a nivel de código? Que un componente puede hacer `const { theme } = useTheme()` esté a 15 niveles de profundidad, y ningún componente intermedio tiene que saber que ese dato existe.

¿Por qué importa? Porque ataca directamente las tres dolencias del prop drilling: elimina el ruido de las props intermedias, desacopla los consumidores de la estructura del árbol y evita el "olvidé reenviar la prop".

> **Atención**: Context resuelve el *problema de transporte* de los datos, no el de *gestión*. Guarda ahí datos que cambian poco y necesitan muchos (tema, idioma, sesión). Verás más adelante por qué no es un store mágico.

## Crear y consumir un contexto

Veamos el flujo completo en tres pasos: crear, proveer y consumir. Este es el ejemplo completo tal como aparece en el material del curso.

### 1. Crear el contexto con `createContext`

```jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})
```

`createContext(defaultValue)` crea un objeto con dos piezas clave: `.Provider` (para envolver la app) y `.Consumer` (alternativa con render props, hoy en día casi siempre sustituida por `useContext`).

El **segundo argumento** —el valor por defecto— es el que se usa si alguien intenta leer el contexto **fuera de cualquier Provider**. Lo veremos ampliado en la regla 5.

### 2. El Provider: envolver y exponer el `value`

```jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const value = { theme, toggleTheme }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
```

¿Qué significa cada parte?

- `ThemeProvider` es un componente normal que **vive en App** y mantiene el estado con `useState`. Eso es lo que convierte el contexto en "algo que cambia": el estado vive en el Provider.
- `children` es todo lo que envuelvas con `<ThemeProvider>...</ThemeProvider>`. No sabemos qué es a priori, y **no nos importa**: solo lo pasamos hacia abajo. Este es el truco que rompe el prop drilling: en vez de pasar props conocidas, pasamos el árbol completo y el árbol accede al valor por el canal de Context.
- `value` es **la señal que emite la radio**. Puede ser un objeto, un string, un número... aquí tiene el dato y la función para modificarlo.

### 3. El hook `useTheme`: consumir el valor

```jsx
export function useTheme() {
  return useContext(ThemeContext)
}
```

`useContext(ThemeContext)` devuelve directamente el objeto que se pasó en `value`. El hook propio (`useTheme`) es una **envoltura con nombre de dominio**: en lugar de recordar en cada componente qué contexto importar, tus componentes solo piensan en "el tema".

El componente consumidor queda así:

```jsx
function Boton() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}
```

Fíjate: `Boton` **no recibe ninguna prop**. Puede estar a cualquier profundidad del árbol, siempre que esté *dentro* del `ThemeProvider`. El padre de `Boton` ya no necesita saber que existe el tema.

## Las 5 reglas de uso (explicadas una a una)

### Regla 1 — El Provider arriba (junto a la raíz o en un slice de la app)

**Qué significa**: el `<ThemeContext.Provider>` debe envolver *todos* los componentes que quieran leer ese contexto. Si un componente queda fuera del Provider, `useContext` devolverá el valor por defecto, no el real.

**Por qué importa**: es el error más habitual al empezar. Envuelves el `Header` pero te olvidas del `Modal` que se monta por portal, o envuelves una rama y otra se queda sin señal. Coloca el Provider lo más arriba posible en `App.jsx`, o como mucho en un "slice" (una rama concreta de la app que necesita ese dato).

```jsx
export default function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  )
}
```

### Regla 2 — El `value` debe ser un valor nuevo con cuidado (usa `useMemo`)

**Qué significa**: cada render del Provider se recalcula `value`. Si lo construyes como `{ theme, toggleTheme }` en línea, estás creando **un objeto nuevo en cada render**, y eso invalida la referencia del objeto.

**Por qué importa**: React compara props y contextos **por referencia**. Si el objeto del `value` "cambia" (nueva referencia) aunque su contenido sea idéntico, **todos los consumidores se re-renderizan**. En una app con muchos componentes consumidores, eso se nota en rendimiento.

La solución es **memórizalo con `useMemo`** para que solo se cree un objeto nuevo cuando de verdad cambie algo:

```jsx
const value = useMemo(
  () => ({ theme, toggleTheme }),
  [theme] // toggleTheme es estable si lo definimos con useCallback
)
```

Regla práctica: si tu Provider es grande o tiene muchos consumidores, aplica `useMemo` (y `useCallback` para las funciones que expones). Si es mínimo, con cuidado de no rehacer el objeto sin sentido basta.

### Regla 3 — Separar contextos (tema vs sesión vs datos remotos)

**Qué significa**: no metas todo en un único `AppContext` gigante con `{ theme, user, lang, cart, ... }`.

**Por qué importa**: un contexto enorme es un **contexto que cambia a menudo**. Si `user` cambia y todo vive en el mismo `value`, se re-renderizan también los componentes que solo querían leer `theme`. Es el mismo principio que ya viste con `useReducer` y las slices: **granularidad**.

Separa en contextos independientes:

- `ThemeContext` → tema claro/oscuro
- `AuthContext` → usuario y token
- `LocaleContext` → idioma

Así cada consumidor solo se entera de los cambios de su propio canal de radio.

### Regla 4 — Context **no es un store mágico**

**Qué significa**: Context solo *transporta* un valor. No optimiza re-renders por sí solo, no tiene devtools, no tiene acciones tipadas, no hace "state colocation".

**Por qué importa**: caer en la trampa de "como ya uso Context, mis componentes ya no se re-renderizan" es un bug de rendimiento esperando a ocurrir. De hecho, si mal usas el `value` (regla 2), Context puede provocar **más** re-renders que las props. Para estado global con updates muy frecuentes o con necesidad de herramientas de depuración, en el M9 verás Redux/Zustand.

Piensa en Context como una **tubería de datos**, no como un sistema de gestión de estado.

### Regla 5 — Valor por defecto seguro en `createContext`

**Qué significa**: `createContext({...})` admite un valor inicial que se usa cuando no hay Provider cerca. Inicialízalo con algo **seguro y representativo**, no con `null` sin más.

**Por qué importa**: si un componente se monta fuera del Provider (o lo montas en un test aislado), `useContext` devuelve el default. Si el default es `null` y tu componente hace `context.theme.toUpper()`, recibes el temido:

```
TypeError: Cannot read properties of null (reading 'theme')
```

Con un default bien formado (`{ theme: 'light', toggleTheme: () => {} }`), el componente simplemente funciona "en modo silencio" con valores razonables en lugar de romper la app.

> Consejo profesional: el default value es un salvavidas, no una excusa. Si un componente *siempre* necesita el Provider, el default te ayuda a detectar el problema sin romper la app, pero debes arreglar el árbol.

## Context vs Redux / Zustand (M9)

Llegados aquí, te preguntarás: "¿entonces para qué voy a necesitar Redux o Zustand en el módulo 9?". Esta tabla te da la respuesta rápida:

| Caso de uso | Context | Redux / Zustand (M9) |
|---|---------|----------------------|
| Tema, idioma, sesión de auth | ✅ ideal | posible, excesivo |
| Muchos updates frecuentes | ⚠️ cuidado (re-renders) | ✅ mejor store |
| Devtools / time travel / acciones | ❌ no | ✅ sí |
| Curva de aprendizaje | ✅ baja (nativa de React) | ⚠️ media |
| Estado compartido entre árboles aislados (portales) | ✅ sí | ✅ sí |

En resumen: **Context para pocos datos que cambian poco; store global para mucho estado que cambia a menudo**. Muchas apps reales usan ambos: Context para UI (tema, idioma) y un store para el dominio (carrito, datos de negocio).

## En el ejemplo del curso

El material práctico de esta unidad vive en `../EJEMPLO_REACT_AVANZADO/`:

- `src/context/ThemeContext.js` — crea el contexto con `createContext` y su valor por defecto.
- `src/context/ThemeProvider.jsx` — componente Provider con `useState`, `toggleTheme` y el `value` (revisa cómo se memoiza).
- `src/hooks/useTheme.js` — el hook envoltorio que consumen los componentes.

Y la integración se hace en `App.jsx`:

```jsx
import { ThemeProvider } from './context/ThemeProvider'
import Boton from './components/Boton'

export default function App() {
  return (
    <ThemeProvider>
      <Boton />
    </ThemeProvider>
  )
}
```

Ábrelo con calma: es exactamente el flujo "crear → proveer → consumir" que has estudiado en esta unidad.

## Errores comunes

### Error 1 — Consumir el contexto fuera del Provider

**Síntoma**: el valor que llega es siempre el default (`'light'`) o `undefined`, aunque el Provider sí está en `App`.

```jsx
// ❌ Mal: Boton está fuera de ThemeProvider
function App() {
  return (
    <>
      <ThemeContext.Provider value={{ theme: 'dark' }}>
        <Header />
      </ThemeContext.Provider>
      <Boton /> {/* ¡no recibe la señal! */}
    </>
  )
}
```

**Solución**: envuelve *todos* los consumidores dentro del Provider (regla 1).

```jsx
// ✅ Bien
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Boton />
    </ThemeProvider>
  )
}
```

### Error 2 — Olvidar `children` en el Provider

**Síntoma**: la app se queda en blanco o el contenido interno desaparece.

```jsx
// ❌ Mal: nunca renderizamos {children}
return <ThemeContext.Provider value={value} />
```

**Solución**: el Provider debe renderizar sus hijos; sin `children`, el árbol interior no existe.

```jsx
// ✅ Bien
return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
```

### Error 3 — Construir el `value` sin estabilidad

**Síntoma**: los componentes consumidores se re-renderizan en bucle o en cada render de un padre no relacionado.

```jsx
// ❌ Mal: objeto nuevo + función nueva en cada render
const value = { theme, toggleTheme: () => setTheme(...) }
```

**Solución**: memoiza el objeto y haz estables las funciones (reglas 2 y 4).

```jsx
// ✅ Bien
const toggleTheme = useCallback(
  () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  []
)
const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
```

### Error 4 — Un `AppContext` monolítico

**Síntoma**: al cambiar la sesión se re-renderiza toda la app porque el `value` entero cambió de referencia.

```jsx
// ❌ Mal: todo en un solo contexto
const value = { theme, user, lang, cart, addProduct, login, logout }
```

**Solución**: separa contextos por dominio (regla 3): `ThemeContext`, `AuthContext`, `CartContext`...

### Error 5 — Default value de `createContext(null)` sin proteger

**Síntoma**: error en consola al acceder a propiedades del contexto.

```jsx
// ❌ Mal
const ThemeContext = createContext(null)
// luego en un componente:
const { theme } = useContext(ThemeContext) // TypeError
```

**Solución**: define un default con la misma forma que el `value` real (regla 5).

```jsx
// ✅ Bien
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})
```

## Conceptos clave

- **Prop drilling**: pasar props por niveles que no las usan; ruido, acoplamiento y bugs difíciles.
- **Context API**: canal compartido ("radio") que da acceso a un valor global sin drills.
- **`createContext(defaultValue)`**: crea el contexto; el default protege contra lecturas fuera del Provider.
- **Provider**: componente que emite el `value`; debe quedar arriba y envolver a todos los consumidores.
- **`value`**: el objeto/señal que reciben los consumidores; memoízalo con `useMemo` para evitar re-renders innecesarios.
- **`useContext` / hook `useTheme`**: forma hooks de leer el contexto con nombre de dominio.
- **5 reglas**: Provider arriba · `value` nuevo con cuidado (`useMemo`) · separar contextos · no es store mágico · default value seguro.
- **Context vs Redux/Zustand**: Context para datos poco volátiles (tema, auth); stores (M9) para estado de negocio con updates frecuentes y devtools.
- **Integración**: `ThemeContext.js` + `ThemeProvider.jsx` envuelven `App.jsx`; los componentes consumen vía `useTheme`.

## Autoevaluación

**1. ¿Qué problema concreto resuelve la Context API que `useState` solo no resuelve?**

<details>
<summary>Respuesta</summary>

`useState` guarda estado **dentro de un componente concreto**. Si otro componente (hijo o lejano) necesita ese estado, obliga al prop drilling: hay que reenviarlo por todos los niveles intermedios. Context permite que cualquier descendiente del Provider **acceda al valor sin que se lo pasen por props**, rompiendo el drilling.

</details>

**2. Mi app usa Context y los componentes consumidores se re-renderizan en cada cambio... ¿qué reviso primero?**

<details>
<summary>Respuesta</summary>

1) Que el `value` del Provider no se esté recreando como objeto nuevo sin necesidad: memoízalo con `useMemo` (y las funciones con `useCallback`). 2) Que no estés metiendo datos muy volátiles en un único contexto: separa tema/sesión/datos (regla 3). Recuerda que Context **no es un store mágico**: no evita re-renders por sí solo.

</details>

**3. ¿Por qué el `ThemeProvider` renderiza `{children}` y no su propio contenido?**

<details>
<summary>Respuesta</summary>

Porque el Provider no sabe (ni le importa) qué app va a envolver: su única responsabilidad es mantener el estado del tema y **emitir el `value`**. Renderizar `children` deja pasar el árbol que lo envuelve sin tocarlo. Si olvidas `children`, ese árbol simplemente no se renderiza y la app aparece vacía.

</details>

**4. Context vs Redux/Zustand: ¿cuándo elijes Context y cuándo un store global?**

<details>
<summary>Respuesta</summary>

Elige **Context** para pocos datos que cambian poco y necesitan estar disponibles en muchos sitios: tema, idioma, sesión de autenticación. Elige **Redux/Zustand (M9)** cuando hay mucho estado de negocio con updates frecuentes, muchos consumidores que deberían re-renderizarse selectivamente, o necesitas devtools, time travel y trazabilidad de acciones.

</details>
