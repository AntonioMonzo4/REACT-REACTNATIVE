# Unidad 03 — Mocking

## Objetivos

- Entender **qué es un mock** y por qué el mocking **aisla** la unidad que pruebas.
- Crear funciones espía con `vi.fn` (Vitest) y comprobar sus llamadas con `expect`.
- **Mockear módulos** con `vi.mock` para sustituir dependencias reales.
- Sustituir `fetch` (la red) en tests, conociendo **MSW** como alternativa más seria.
- Manipular el tiempo con **fake timers** (`vi.useFakeTimers`, `advanceTimersByTime`).
- Reconocer **qué NO conviene mockear** para no autoengañarte con tests verdes pero inútiles.

## Requisitos

- Haber completado **M4–M8**: en especial `useState`/`useEffect` (M4–M5), promesas y `async/await` (JS/TS) y `fetch` de **M8 (Consumo de APIs)**.
- Haber leído la **Unidad 01** (Vitest configurado, `globals: true`) y la **Unidad 02** (queries y `userEvent`).
- **Secuencia entre unidades**: la 03 es el puente entre los tests de UI (02) y los **unit puros** (04) y los **flujos de integración** (05); sin mocking no podrás probar login ni hooks sin tocar la red real.

## Por qué

Aísla el unit bajo prueba: sin red real, sin timers reales, sin módulos pesados.

**Analogía**: un mock es el **doblaje de doblaje**... mejor dicho, un **doble de escena**. Cuando ensayas una obra de teatro, no invitas al actor real a comparecer en el juicio; pones a alguien que **responde lo predeterminado**. Del mismo modo, en un test no llamas a la API de producción (lenta, cara, con datos que cambian): pones un doble que devuelve `{ id: 1, name: 'Ana' }` siempre.

**Qué significa "aislar"**: que tu test solo falle si **tu** lógica está mal, no porque:

- el servidor estuviera caído,
- internet fuera lento,
- la fecha real cambiara el resultado,
- un módulo pesado (PDF, mapas) tardara minutos en cargar.

**¿Por qué importa?** Un test sin mock es **impredicible**; uno con mock excesivo es **mentiroso** (aprueba cosas que en producción fallarían). La unidad trata de encontrar el equilibrio.

## fn / spies (Vitest `vi` ≡ Jest `jest`)

```js
import { vi } from 'vitest'

const fn = vi.fn()
fn('a')
expect(fn).toHaveBeenCalledWith('a')
expect(fn).toHaveBeenCalledTimes(1)
```

**Qué hace `vi.fn()`**: crea una función **falsa** que no hace nada por sí sola, pero **recuerda todo**: cuántas veces la llamaron, con qué argumentos, qué devolvió. Sirve para:

- sustituir un callback y **verificar** que tu componente lo invocó;
- **espiar** funciones pasadas como props sin ejecutar su lógica real.

| Aserción | Pregunta que responde |
|----------|------------------------|
| `toHaveBeenCalledTimes(1)` | ¿La llamaron exactamente una vez? |
| `toHaveBeenCalledWith('a')` | ¿La llamaron con ese argumento? |
| `toHaveBeenLastCalledWith(...)` | ¿La **última** llamada fue con...? |
| `mockResolvedValue(x)` | ¿Qué **devuelve** si es async? |

> Si vienes de tutoriales con Jest: `jest.fn` ≡ `vi.fn`, `jest.mock` ≡ `vi.mock`. Misma idea, otro prefijo.

## Mock de módulo

```js
vi.mock('./api', () => ({
  fetchUser: vi.fn(),
}))

import { fetchUser } from './api'
fetchUser.mockResolvedValue({ id: 1, name: 'Ana' })
```

**Qué significa**: sustituyes **el archivo entero** `./api` por una versión falsa en la que `fetchUser` es un `vi.fn()`. Desde ese punto, **todos** los imports de `./api` en este test reciben el doble.

Pasos mentales:

1. `vi.mock('./api', factory)` → reemplazo el módulo (se registra *antes* de los imports, por eso va arriba).
2. `fetchUser.mockResolvedValue(...)` → programo la respuesta: la próxima promesa se resolverá con ese objeto.
3. Ejecuto el código real que **consume** `./api` y asevero su comportamiento.

**¿Por qué importa?** Así pruebas, por ejemplo, la pantalla de perfil sin llamar a tu backend: decides tú qué responde el servidor, incluido el caso de error (`mockRejectedValue`).

## Mock de fetch / red

```js
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1 }]),
    }),
  )
})
```

**Qué significa**: reescribes el **global `fetch`** del entorno por una función falsa que responde con una promesa que imita la API real (`ok`, `json()`). `beforeEach` lo **restaura en cada test** para que un test no herede el mock del anterior.

**¿Por qué importa?** Tu hook o componente puede probarse miles de veces sin una sola petición saliendo de tu máquina: rápido, offline y con resultados idénticos en tu ordenador y en el pipeline de CI.

En suites más serias: **MSW** (Mock Service Worker) intercepta en la red sin cambiar el código.

MSW (Mock Service Worker) instala un *service worker* que **intercepta peticiones en la capa de red**: tu código sigue llamando a `fetch('/api/users')` normalito, pero la respuesta la pinta MSW. Ventaja: **no tocás tu código** para mockear, y puedes levantar la misma definición de endpoints en desarrollo y en tests.

## Timers

```js
vi.useFakeTimers()
// avanzar el reloj
vi.advanceTimersByTime(1000)
vi.useRealTimers()
```

**Qué significa**: congelas el reloj (`setTimeout`, `setInterval`, `Date.now`) y lo avanzas **tú**. Un `setTimeout` de 1000 ms se dispara al instante con `advanceTimersByTime(1000)`, sin esperar un segundo real.

**¿Por qué importa?** Sin esto, un test con un *debounce* de 500 ms tarda medio segundo... y uno con una animación de 30 segundos haría que tu suite durara una eternidad. Con fake timers, tardan **milisegundos**. Siempre vuelve con `vi.useRealTimers()` para no arrastrar el estado al siguiente test.

Con `userEvent` y fake timers cuida los delays (`userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`).

Ese ajuste es necesario porque `userEvent` internamente usa pequeñas esperas (delays) para simular tecleo real; si el reloj está congelado y no le dices cómo avanzarlo, esos delays se quedarían colgados y el test no terminaría.

## Qué no mockear

- En tests de integración de UI: deja correr la lógica real del componente.
- No mockees lo que estás intentando verificar (si pruebas el reducer, no lo sustituyas).

Ampliación de esas dos reglas de oro:

| Sí conviene mockear | No conviene mockear |
|---------------------|---------------------|
| La frontera de red (`fetch`, `api`) | El módulo/reducer **que estás testeando** |
| Tiempo (`Date`, timers) | La lógica interna del componente en tests de UI |
| Dependencias pesadas o externas (PDF, mapas) | Todo a la vez: si mockeas 5 cosas, solo pruebas el envoltorio |

**Autoengaño clásico**: si mockeas la función que suma... y luego esperas que la suma salga bien, tu test pasará aunque la suma real esté rota. El mock **sustituye** lo que mockea; solo puedes afirmar sobre lo que dejas **real**.

## Errores comunes

### 1. `vi.mock` fuera de lugar o con path equivocado

```text
Error: No "src/api" module is defined... (Cannot find module './api')
```

**Solución**: la ruta del mock debe calzar con el **import del archivo bajo prueba** (relativa al archivo de test). Recuerda que `vi.mock` se registra al **inicio** del archivo, antes de los imports.

### 2. El mock "se escapa" entre tests

```text
AssertionError: expected 2 to be 1
```

**Solución**: estás contando llamadas acumuladas de un test anterior. Añade `vi.clearAllMocks()` (o `vi.resetAllMocks()`) en un `beforeEach`, o define los mocks dentro de cada test.

### 3. Test colgado con fake timers

```text
Test timed out in 5000ms.
```

**Solución**: dejaste `vi.useFakeTimers()` activo sin avanzar el reloj (o sin avisar a `userEvent`). Termina con `vi.useRealTimers()` y configura `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.

## Conceptos clave

- **Mock**: doble falso que responde lo predeterminado → **aisla** la unidad bajo prueba.
- **`vi.fn`** (Jest: `jest.fn`): función espía; recuenta llamadas y argumentos.
- **`vi.mock`**: sustituye un módulo completo por una fábrica falsa.
- **`mockResolvedValue` / `mockRejectedValue`**: programan el éxito y el error de promesas.
- **Mock de `fetch`**: reemplaza el global en `beforeEach` para no tocar la red real.
- **MSW**: intercepta en la red sin modificar el código.
- **Fake timers**: congelas y avanzas el tiempo; siempre restaura con `vi.useRealTimers()`.
- **Regla de oro**: no mockees lo que estás intentando verificar.

## Autoevaluación

1. **¿Para qué sirve `vi.fn()` y qué te permite afirmar?**

   <details><summary>Respuesta</summary>

   Crea una función falsa que registra sus llamadas. Te permite afirmar con `toHaveBeenCalledTimes` y `toHaveBeenCalledWith` si (y con qué argumentos) fue invocada, además de controlar su retorno con `mockResolvedValue`/`mockReturnValue`.

   </details>

2. **Quiero probar que mi componente muestra un error cuando el login falla. ¿Cómo programo ese fallo con `vi.mock`?**

   <details><summary>Respuesta</summary>

   Mockeas el módulo de la API y haces que `login` rechace la promesa:

   ```js
   vi.mock('../src/api', () => ({ login: vi.fn() }))
   import { login } from '../src/api'
   login.mockRejectedValue(new Error('401'))
   ```

   Así tu componente recibe el error sin tocar el backend.

   </details>

3. **¿Por qué hay que restaurar los mocks/timers en `beforeEach`?**

   <details><summary>Respuesta</summary>

   Porque los mocks y el reloj falso son **estado global del archivo de test**: si no los limpias (`vi.clearAllMocks()`, `vi.useRealTimers()`), un test hereda el comportamiento del anterior y los resultados dejan de ser deterministas.

   </details>

4. **Estoy testeando `cartReducer`. ¿Tiene sentido hacer `vi.mock('./cartReducer')`?**

   <details><summary>Respuesta</summary>

   No. Sería sustituir justo lo que quieres verificar: el test aprobaría aunque el reducer real estuviera roto. Solo debes mockear la **frontera** (red, tiempo, dependencias externas), nunca la unidad bajo prueba.

   </details>
