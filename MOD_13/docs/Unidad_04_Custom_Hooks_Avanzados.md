# Unidad 04 — Custom Hooks Avanzados

## Objetivos

- Situar tu nivel actual de hooks en una escala de básico a avanzado.
- Escribir un custom hook **genérico** en TypeScript (`useSet<T>`).
- Conocer `useSyncExternalStore` y para qué sirve frente a stores de terceros.
- Aplicar las **reglas de oro** de diseño de hooks (prefijo, top level, una responsabilidad, cleanup).
- Detectar anti-patrones: hook que renderiza JSX, objetos de retorno inestables y "god hooks".

## Requisitos

- M4–M6: haber escrito hooks básicos (`useCounter`, `useLocalStorage`, `useFetch`).
- M7–M12: `useEffect` con cleanup, `useCallback`/`useMemo`, contexto.
- Conocer lo mínimo de TypeScript del M3 (genéricos `<T>`) para la sección de genéricos; el resto del ejemplo es JavaScript.

## De básico a avanzado

No todos los hooks son iguales de difíciles. Esta tabla te dice dónde estás y hacia dónde creces:

| Nivel | Ejemplos |
|-------|----------|
| Básico (M4–M6) | `useCounter`, `useLocalStorage`, `useFetch` |
| Medio | `useDebounce`, `useOnClickOutside`, `useMediaQuery` |
| Avanzado | genéricos TS, deps controladas, cleanup robusto, `useSyncExternalStore` |

**Qué significa cada nivel:**

- **Básico**: el hook guarda un pedacito de estado o lee algo sencillo. Ya lo sabes hacer.
- **Medio**: el hook interactúa con el **entorno** (temporizadores, eventos globales, media queries) y exige limpiar bien (`clearTimeout`, `removeEventListener`).
- **Avanzado**: el hook es **reutilizable en cualquier tipo de dato** (genéricos), tiene **dependencias controladas** y se conecta a **almacenamiento externo** (stores) sin romper la concurrencia de React.

**Por qué importa:** el salto de medio a avanzado es lo que separa un hook "que funciona en mi pantalla" de un hook "que pondría en una librería".

## Genéricos (con TS)

Un hook genérico funciona con **cualquier tipo** sin repetir su implementación. Ejemplo con un `Set` (colección sin duplicados):

```typescript
function useSet<T>(initial: T[] = []) {
  const [set, setSet] = useState<Set<T>>(() => new Set(initial))
  const add = useCallback((v: T) => setSet((s) => new Set(s).add(v)), [])
  return { set, add }
}
```

**Qué significa cada pieza:**

- `<T>` es el tipo de los elementos: `useSet<number>()`, `useSet<string>()`, etc.
- `useState<Set<T>>(() => new Set(initial))` — el initializer perezoso evita recrear el `Set` en cada render.
- `useCallback(..., [])` memoriza `add` para que la identidad no cambie y rompa hijos con `React.memo`.
- **Ojo:** `new Set(s).add(v)` crea un `Set` **nuevo** antes de mutar; así React detecta el cambio. Mutar el `Set` viejo en el sitio no dispararía un re-render.

Uso:

```typescript
const { set, add } = useSet(['a'])
add('b') // set es Set {'a', 'b'}
```

**Por qué importa:** el genérico garantiza que no metas tipos equivocados: `add(1)` con `useSet<string>` es error de TypeScript en tiempo de compilación.

## External store (React 18+)

Cuando el estado **no vive en React** sino en un almacén externo (Zustand, un store propio, un observable), React 18 ofrece `useSyncExternalStore` para suscribirte de forma **segura y consistente**:

```javascript
import { useSyncExternalStore } from 'react'

function useStoreExterno(store) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}
```

**Qué significa:** le pasas dos funciones: `subscribe` (te avisa cuando cambia) y `getSnapshot` (devuelve el valor actual). React se suscribe, re-renderiza ante cambios y garantiza que el snapshot sea consistente incluso con render interrumpido (concurrent mode) o en SSR.

**Por qué importa:** útil para stores de terceros (Zustand lo usa por debajo). Antes de React 18 esto se hacía a mano con `useEffect` + `useState` y tenía bugs de lecturas desfasadas; ahora el hook lo resuelve React.

**Advertencia clásica:** `getSnapshot` debe devolver un valor **estable** si nada cambió; si creas un objeto nuevo en cada llamada, entras en bucle infinito de renders.

## Reglas de oro

1. **Prefijo `use`** y llamadas **solo en top level** (no dentro de ifs/loops). El nombre `use*` es lo que permite al linter de reglas de hooks verificar el orden de hooks entre renders.
2. Un hook = **una responsabilidad** documentada. Si no puedes nombrarlo en una frase, está creciendo de más.
3. Devuelve **tupla estable** `[valor, set]` o **objeto con nombre**, sin mezclar a medias sin motivo. El estilo de retorno define el contrato con quien lo usa.
4. Limpia lo que suscribes (listeners, timers, abort). Todo lo que registres en `useEffect`, quítalo en el `return` del efecto.

**Por qué importa:** estas reglas no son estética; violarlas causa hooks que se saltan renders, fugas de memoria y errores imposibles de reproducir ("hook order changed").

## Anti-patrones

- **Hook que renderiza JSX** (mezcla responsabilidades). El hook debe devolver **datos/funciones**, no UI; el JSX vive en el componente.
- **Objeto de retorno nuevo cada render** pasado a hijo memorizado (rompe `memo`) → `useMemo` en el objeto:

```javascript
// ❌ identidad nueva en cada render → React.memo no funciona
return { set, add }

// ✅ memoriza el objeto de retorno
return useMemo(() => ({ set, add }), [set, add])
```

- **"God hook" con 10 efectos**: difícil de testear y de limpiar. Divídelo en hooks pequeños que se componen.

## En el ejemplo

`useMediaQuery`, `useDebounce` y `useSet` en `src/hooks/` (`useMediaQuery.js` usa `useSyncExternalStore`; `useDebounce.js` limpia su `setTimeout`; `useSet.js` crea `Set` nuevos en cada mutación). `useMouse.js` es la contraparte hook del render prop de la Unidad 02.

## Errores comunes

**1. Llamar un hook condicionalmente.**

```javascript
// ❌ si isActive cambia, el orden de hooks cambia → crash
if (isActive) {
  const [v, setV] = useState(0)
}

// ✅ llama siempre; decide dentro del hook con guardas de datos, no de hooks
const [v, setV] = useState(0)
```

Solución: las llamadas a hooks siempre en top level y en el mismo orden; controla la lógica **dentro** del hook.

**2. Suscripción sin cleanup.**

```javascript
// ❌ acumula listeners cada vez que se monta
useEffect(() => {
  window.addEventListener('resize', fn)
}, [])

// ✅ devuelve la limpieza
useEffect(() => {
  window.addEventListener('resize', fn)
  return () => window.removeEventListener('resize', fn)
}, [])
```

Solución: todo `addEventListener`/`setInterval`/`subscribe` lleva su contrapartida en el `return` del efecto.

**3. Mutar el estado en el sitio (Set/Map/objeto) sin crear copia.**

```javascript
set.add(v)          // ❌ misma referencia → React no re-renderiza
setSet(new Set(s).add(v))  // ✅ copia nueva
```

Solución: siempre nueva referencia (copiar y mutar la copia, o `Map`/`Set` inmutables).

**4. `getSnapshot` inestable en `useSyncExternalStore`.**

Solución: devuelve una referencia primitiva o cacheada; nunca `new Date()`/`{...obj}` a cada llamada si nada cambió.

## Conceptos clave

- **Escala de hooks**: básico (estado simple) → medio (entorno/limpieza) → avanzado (genéricos, deps, external store).
- **Hook genérico**: `<T>` permite reutilizar la lógica para cualquier tipo con seguridad de tipos.
- **`useSyncExternalStore(subscribe, getSnapshot)`**: suscripción a stores externos, consistente y oficial (React 18+).
- **Reglas de oro**: prefijo `use`, top level, una responsabilidad, retorno estable, cleanup total.
- **Anti-patrones**: JSX dentro del hook, objeto de retorno inestable (rompe `memo`), god hook.
- **Inmutabilidad**: `Set`/`Map`/objetos requieren nueva referencia para que React re-renderice.

## Autoevaluación

**1. ¿Cuál es la diferencia de nivel entre `useCounter` y `useDebounce`, y qué exige el segundo?**

<details>
<summary>Respuesta</summary>

`useCounter` es básico: solo guarda estado. `useDebounce` es medio: interactúa con el entorno mediante temporizadores, así que exige `cleanup` correcto (`clearTimeout`) para no dejar timers huérfanos al desmontar o al cambiar el valor debounced.

</details>

**2. En `useSet<T>`, ¿por qué se hace `new Set(s).add(v)` en vez de `set.add(v)` directamente?**

<details>
<summary>Respuesta</summary>

Porque mutar el `Set` original no cambia su referencia: React compara referencias y no re-renderizaría. Crear un `Set` nuevo (copiar + añadir) entrega una referencia distinta y React detecta el cambio de estado.

</details>

**3. ¿Para qué sirve `useSyncExternalStore` y cuándo lo usarías?**

<details>
<summary>Respuesta</summary>

Para conectar React con un estado que vive fuera de React (un store externo): recibe `subscribe` y `getSnapshot`, se suscribe y re-renderiza ante cambios con garantías de consistencia (también en SSR/concurrent). Lo usarías con stores de terceros tipo Zustand o un store propio; de hecho Zustand lo usa por debajo.

</details>

**4. Un hook devuelve `{ set, add }` nuevo en cada render y un hijo con `React.memo` se re-renderiza siempre. ¿Diagnóstico y arreglo?**

<details>
<summary>Respuesta</summary>

Diagnóstico: el objeto de retorno tiene identidad nueva en cada render, así que la prop cambia y `memo` no evita nada. Arreglo: memorizar el objeto con `useMemo(() => ({ set, add }), [set, add])` (o devolver una tupla estable). Es uno de los anti-patrones listados.

</details>
