# Unidad 01 — Context como estado global

## Objetivos

- Entender qué es un "estado global" y por qué `useState` deja de bastar en apps medianas.
- Distinguir cuándo **Context solo** es suficiente y cuándo necesitas una librería (Redux, Zustand, Jotai).
- Repasar la estructura clásica de Context (crear → Provider → hook de consumo) que viste en el M6.
- Aplicar las buenas prácticas de rendimiento: partir Contexts y memorizar el `value`.
- Detectar los tres errores típicos al meter Context en una app real.
- Situar este módulo: Context es el **escalón 1** de la gestión de estado global; las unidades 02–05 son los escalones 2 y 3.

## Requisitos

- **M6 — Unidad 01 (Context)**: haber creado ya un `createContext`, un Provider y un hook con `useContext`. Aquí no se aprende Context desde cero, se **perfila** para usarlo como store.
- **M4–M5 — Hooks**: `useState` y `useEffect` con soltura; `useMemo` y `useCallback` (los usarás para evitar re-renders en cadena).
- **Secuencia del módulo**: esta unidad es la **puerta de entrada**. Después sigue la 02 (Redux Store y Slice), que resuelve justo lo que Context no escala a hacer. No empieces por la 04/05 si no entiendes primero *por qué* aparecieron esas librerías.

## Qué significa "estado global"

Durante todo el curso hasta ahora, el estado vivía **lo más cerca posible** del componente que lo usaba: un contador en el propio contador, el valor de un input en el propio input. Ese es el principio correcto de React y **sigue siéndolo**. El problema aparece cuando el mismo dato lo necesitan componentes que **no están emparentados** entre sí.

Imagina la app de un curso online:

- La **barra superior** muestra "Hola, Ana".
- El **menú lateral** tiene un enlace a "Mi perfil" que solo aparece si hay sesión.
- Un **modal de confirmación** al cerrar sesión.
- La **página de lecciones** comprueba la sesión para saber si desbloquea el contenido.

Los cuatro están en partes distintas del árbol de componentes. Si el estado de sesión sigue en el componente `App`, tendrías que pasarlo por props por 5 niveles intermedios que **no lo usan para nada**. A eso se le llama *prop drilling* (taladrar props) y es la señal clásica de que necesitas un estado global.

**Estado global** = un trozo de estado que vive **fuera** del árbol de componentes (o en la raíz, vía Provider) y al que cualquier componente puede **leer** (y, si tiene permiso, **escribir**) sin que se lo pase nadie por props.

> Analogía: es la diferencia entre gritar de habitación en habitación ("¿Ana, estás despierta?") y tener un **tablón de anuncios** en la entrada donde todos miran y escriben la misma información.

## Qué encaja en Context

Estado **de app** que muchos componentes leen y pocos cambian con mucha frecuencia:

- sesión de usuario, tema, idioma, feature flags
- datos "de catálogo" cacheados a mano

Context **no** sustituye a un store cuando hay:

- cientos de updates por segundo
- selectores/devtools/time-travel
- estado con reglas complejas (optimistic updates, caches)

### Por qué importa este criterio

Context resuelve **compartir**, no **gestionar**. Es decir: te saca del prop drilling perfectamente, pero no te da herramientas para saber *qué cambió*, *cuándo*, ni *por qué* tu app se re-renderiza entera. Elegir bien aquí te ahorra una migración dolorosa más adelante: meter todo en un Context gigante y luego extraerlo a Redux/Zustand es trabajo extra; al revés (empezar simple) es casi gratis.

La tabla de la sección "Cuándo es suficiente" es tu **brújula** para decidir. Úsala cada vez que dudes si un dato va en `useState` local, en Context o en una librería.

## Estructura (repaso M6)

La estructura canónica tiene **tres piezas** y conviene separarlas en archivos distintos para que el código sea predecible:

```jsx
// AuthContext.js — solo el createContext
import { createContext } from 'react'
export const AuthContext = createContext(null)

// AuthProvider.jsx — Provider + estado
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  return (
    <AuthContext.Provider value={user ? { user, logout: () => setUser(null) } : { user: null, login: setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth.js — hook de consumo
export function useAuth() {
  return useContext(AuthContext)
}
```

Qué significa cada pieza:

- `createContext(null)`: crea el "canal de radio". Solo declara que el canal existe; **no** guarda datos todavía. El `null` inicial es una defensa: si alguien consume el hook fuera del Provider, recibirá `null` y el error será fácil de rastrear.
- `AuthProvider`: es donde vive el estado real (`useState`) y donde se decide **qué se expone**. Fíjate en que no expone `setUser` crudo: expone `login`/`logout`, una API más segura y más estable. Ese detalle es lo que separa un Context "de aprendizaje" de uno de producción.
- `useAuth()`: el hook que **envelopa** `useContext`. Ventaja: si algún día cambia el nombre del Context o la forma del `value`, solo tocas este archivo; el resto de componentes siguen llamando a `useAuth()`.

Por qué importa: los componentes **no deberían** saber que existen `useContext` ni `AuthContext`. Solo deben conocer `useAuth()`. Es el mismo principio de encapsulado que ya aplicaste con custom hooks en M4–M5.

## Cuándo es suficiente

| Situación | Herramienta |
|-----------|-------------|
| 1–2 valores globales, updates lentos | Context |
| Mucha lógica + updates frecuentes | Redux Toolkit / Zustand (siguientes unidades) |
| Server cache (API) | React Query / SWR (fuera del roadmap) |

Cómo leer esta tabla en la práctica:

1. **Empieza siempre en la fila 1.** La mayoría de "problemas de estado" de apps pequeñas-medias se resuelven con `useState` local + un Context bien partido.
2. Si te sorprendes escribiendo un reducer de 200 líneas **dentro** de un `useState` de un Provider, estás en la fila 2: es la señal de que la lógica de negocio ha crecido y merece una librería (Unidad 02 en adelante).
3. La fila 3 es un error frecuente de principiantes: guardar en Context la lista de productos que **vienen de una API** y no cambiarla nunca hasta "refrescar a mano". Eso es caché de servidor: React Query/SWR lo hacen solito (revalidación, loading, errores). Fuera del checklist base del curso, pero conviene saber que existe para no reinventarlo mal.

## Errores comunes

**1. Meter en Context el estado local de una pantalla** (pérdida de re-renders y claridad).

```text
Error conceptual: el contador de una sola pantalla vive en un GlobalContext
```

Solución: solo sube al Provider lo que **varios árboles** necesitan. Si solo un componente lo usa, déjalo en `useState` local.

```jsx
// Mal: estado de una pantalla en el contexto global
function UnscreenProvider({ children }) {
  const [busqueda, setBusqueda] = useState('')
  return <GlobalContext.Provider value={{ busqueda, setBusqueda }}>{children}</GlobalContext.Provider>
}

// Bien: estado local donde se usa
function PanelBusqueda() {
  const [busqueda, setBusqueda] = useState('')
  return <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
}
```

**2. Un solo Context gigante** → cualquier cambio refresca todo.

```text
Error típico: "he metido sesión, tema, idioma, carrito y filtros en el mismo Provider y la app va lenta"
```

Solución: **parte** por dominio, como ya partirías los componentes.

```jsx
// Varios Contexts pequeños y específicos
<ThemeProvider>       {/* cambia muy de vez en cuando */}
  <AuthProvider>      {/* cambia al login/logout */}
    <CarritoProvider> {/* cambia con cada click */}
      <App />
    </CarritoProvider>
  </AuthProvider>
</ThemeProvider>
```

Así, al cambiar el carrito solo se re-renderiza lo que consume `useCarrito()`, no el árbol entero.

**3. Crear objetos de `value` nuevos cada render sin `useMemo`** → re-renders en cadena.

```text
Uncaught Too many re-renders / app lenta al escribir en un input dentro del Provider
```

Solución: memoriza el `value` (recuerda `useMemo` del M5).

```jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const value = useMemo(
    () => ({ user, login: setUser, logout: () => setUser(null) }),
    [user],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

Sin `useMemo`, cada render del Provider crea un objeto **nuevo** (`{}` nunca es igual a `{}` por referencia), React ve "el contexto cambió" y re-renderiza a **todos** los consumidores… que a su vez pueden provocar otro render del Provider, y así.

## En el ejemplo

`ThemeProvider` (tema claro/oscuro) y `CartProvider` (carrito de demo) como Context puros.

Búscalos en `EJEMPLO_REACT_ESTADO/`: son el caso de estudio perfecto para comparar con las unidades siguientes (el mismo carrito que en Redux, el mismo tipo de dato que en Zustand…).

## Conceptos clave

- **Estado global**: dato compartido por ramas del árbol que no están emparentadas directamente.
- **Prop drilling**: pasar props por niveles que no las usan; síntoma de que toca elevar el estado.
- **Context = canal de distribución**, no un store con reglas: reparte valores, no los gobierna.
- **Tres piezas**: `createContext` / Provider con estado / hook de consumo (`useAuth`).
- **Partir Contexts** por dominio (tema, sesión, carrito) para acotar los re-renders.
- **Memorizar el `value`** con `useMemo` para no re-renderizar consumidores sin cambio.
- **Exponer acciones** (`login`, `logout`) en vez de setters crudos: API más estable.
- **Límite de Context**: updates muy frecuentes, selectores, devtools o reglas complejas → Redux/Zustand/Jotai (Unidades 02–05).

## Autoevaluación

**1. Mi app tiene tema, idioma y sesión de usuario; solo cambian al hacer login o abrir un menú de ajustes. ¿Qué herramienta elegirías y por qué?**

<details><summary>Respuesta</summary>

Context (probablemente tres Contexts pequeños o uno compartido si quieres simplicidad): son pocos valores globales con updates lentos, exactamente el caso de la fila 1 de la tabla. No te aporta nada instalar Redux o Zustand aquí; añadiría boilerplate sin beneficio.

</details>

**2. ¿Qué ocurre si no memorizas el objeto `value` de un Provider con `useMemo`?**

<details><summary>Respuesta</summary>

En cada render del Provider se crea un objeto nuevo por referencia, React lo considera "cambio de contexto" y re-renderiza a **todos** los consumidores aunque sus datos lógicamente no hayan cambiado; en casos extremos puede provocar bucles de re-render. La solución es `useMemo` con las dependencias reales (por ejemplo `[user]`).

</details>

**3. Estoy guardando en Context la lista de productos de una API que el usuario nunca edita, solo consulta. ¿Es buena idea? ¿Qué alternativa se menciona?**

<details><summary>Respuesta</summary>

No es el mejor encaje: es "server cache" (estado que pertenece al servidor y que solo lees). La alternativa indicada es React Query / SWR (fuera del checklist base del roadmap), que gestionan fetching, caché y revalidación por ti. Si te quedas con Context, al menos separa ese estado de tu estado de sesión/tema.

</details>

**4. ¿Por qué conviene envolver `useContext` en un hook propio (`useAuth`)?**

<details><summary>Respuesta</summary>

Encapsula el detalle de implementación: si mañana cambia el nombre del Context, la estructura del `value` o pasas a otra librería, solo modificas el hook; los cientos de componentes que llaman a `useAuth()` no cambian. Además te permite añadir validaciones (lanzar error si falta el Provider) en un solo sitio.

</details>
