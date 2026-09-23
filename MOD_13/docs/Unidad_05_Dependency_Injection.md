# Unidad 05 — Dependency Injection

## Objetivos

- Entender **Dependency Injection (DI)** en el contexto de React: recibir la implementación en vez de importarla.
- Comparar el estilo "duro" (import directo) con la inyección por props y por contexto.
- Montar un `ServicesProvider` + `useServices` como contenedor de dependencias.
- Elegir cuándo inyectar y cuándo basta un import (tabla de escenarios).
- Crear **factories** para IoC ligero y evitar los errores de DI sin documentar.

## Requisitos

- M4–M12: imports/exports, props, `createContext`/`useContext`, pruebas unitarias básicas (mocks con `vi.fn()` si usas Vitest).
- Haber leído la Unidad 01 (Compound Components), porque el `ServicesProvider` es el mismo patrón con otro propósito.
- No se requiere TypeScript; los ejemplos son JavaScript.

## Qué es en React

**Dependency Injection** (inyección de dependencias) significa: en vez de importar un servicio **concreto** dentro del componente, el componente recibe la **implementación** por props o contexto → testeable y polimórfico.

**Analogía:** es la diferencia entre **cocinar con una marca concreta de horno** (import duro: si la marca cambia, reescribes la receta) y **recibir el horno que te den** (inyección: la receta solo exige "un horno que caliente a 200°"; en casa pones el tuyo y en el test uno de juguete).

```jsx
// Duro
import { enviarEmail } from '../api/email'
function Alta() { ... enviarEmail(...) }

// Inyectado
function Alta({ enviarEmail }) { ... }

// App root
<Alta enviarEmail={apiEmail.enviar} />
// Tests
<Alta enviarEmail={vi.fn()} />
```

**Qué significa:** en la versión "duro", `Alta` depende directamente del módulo `../api/email`: para testearla tienes que mockear el módulo completo. En la versión inyectada, `Alta` solo conoce una **función** `enviarEmail`: en producción le pasas la real, en el test le pasas `vi.fn()` y listo.

**Por qué importa:** desacoplas **quién usa** de **qué se usa**. Puedes cambiar la API, añadir un logger o simular fallos de red en tests sin tocar el componente.

## Context como contenedor de dependencias

Cuando la dependencia no es de un componente sino de **toda la app**, pasarla por props en cada nivel sería prop drilling. Ahí llega el contexto, igual que en Compound Components pero con otro rol: **guardar servicios, no estado de UI**.

```jsx
const ServicesCtx = createContext(null)

export function ServicesProvider({ value, children }) {
  return <ServicesCtx.Provider value={value}>{children}</ServicesCtx.Provider>
}

export function useServices() {
  return useContext(ServicesCtx)
}

// main.jsx
<ServicesProvider value={{ auth, cartApi, logger }}>
```

Uso en cualquier componente profundo:

```jsx
function Perfil() {
  const { auth, logger } = useServices()
  // ...
}
```

**Qué significa:** `main.jsx` es el único lugar que decide **qué implementaciones reales** se montan. Todo lo demás consume la abstracción `useServices()`.

**Por qué importa:** cambias `logger` por uno de consola, de Sentry o un fake en tests **tocando un solo archivo** (la raíz), sin buscar imports por todo el árbol.

## Cuándo inyectar

No todo necesita DI; abusar de ella opaca el flujo de datos. Usa esta tabla como guía:

| Escenario | Estrategia |
|-----------|------------|
| Lógica interna de la feature | import directo suele bastar |
| Multi-tenant / skins / storages distintos | DI por contexto o factory |
| Tests unitarios | mocks de módulo **o** DI (elige uno y sé coherente) |
| Micro frontends | contratos en paquete compartido |

**Cómo leerla:**

- **Lógica interna:** si solo ese componente usa el servicio y no varía, un `import` es más simple y legible.
- **Multi-tenant / skins:** cuando **cambia la implementación en runtime** (tema, tenant, `localStorage` vs `memory`), la DI por contexto o factory es la indicada.
- **Tests:** puedes mockear el módulo (`vi.mock`) **o** inyectar un doble; lo importante es no mezclar las dos técnicas en el mismo test sin criterio, o no sabrás qué estás probando.
- **Micro frontends:** cada equipo despliega por separado; los contratos (interfaces de servicios) viven en un paquete compartido que todos importan.

## IoC ligero

**IoC** (*Inversion of Control*) es el principio general: el componente no decide **cómo** se crea el servicio, solo declara **qué necesita**. En la práctica se logra con **factory functions** (funciones fábrica):

```javascript
export const crearRepositorio = ({ fetcher, baseUrl }) => ({
  listar: () => fetcher(`${baseUrl}/items`),
})
```

Uso:

```javascript
const repoReal = crearRepositorio({ fetcher, baseUrl: '/api' })
const repoFake = crearRepositorio({ fetcher: fetchFalso, baseUrl: '' })
```

**Qué significa:** `crearRepositorio` no conoce la implementación concreta de `fetcher` ni la URL; recibe ambas por parámetro y devuelve el objeto listo. La **configuración se invierte**: quien crea decide.

**Por qué importa:** una sola fábrica genera la versión real (producción) y la falsa (tests) sin duplicar `listar()`; además, cambiar de transporte (`fetch` → `axios`) no toca al consumidor.

## En el ejemplo

`ServicesProvider` con `logger` y `clock` reales/fake en tests y demo. En el proyecto vive en `src/services/ServicesProvider.jsx` (+ `ServicesContext.js`, `useServices.js`), se monta en `src/main.jsx` con `services={{ logger }}` y `useServices()` lanza error si falta el Provider.

## Errores comunes

**1. Context DI gigante sin documentar → hard to trace.**

```jsx
// ❌ 20 servicios en un objeto anónimo: nadie sabe qué ofrece useServices()
<ServicesProvider value={{ a, b, c, d, /* … */ z }}>

// ✅ contrato explícito: documenta/nombra cada servicio
// Services = { auth: AuthApi, cartApi: CartApi, logger: Logger }
<ServicesProvider value={{ auth, cartApi, logger }}>
```

Solución: define y documenta el **contrato** del contexto (qué servicios y qué métodos exponen); opcionalmente divídelo en varios contextos pequeños (`AuthCtx`, `CartCtx`) para que cada consumidor dependa solo de lo suyo.

**2. Inyectar estado cuando lo que se necesita es un servicio.**

```jsx
// ❌ inyectas un usuario concreto (estado mutable) y lo mutan por todas partes
value={{ usuario }}

// ✅ inyecta el servicio que administra el estado (auth), con su API
value={{ auth }}   // auth.getCurrentUser(), auth.logout()…
```

Solución: DI es para **comportamiento** (servicios, funciones, factories), no para repartir copias de estado. El estado debe tener un único dueño (store/contexto de estado) y los servicios, inyectados.

**3. Olvidar que el contexto puede ser `null`.**

Si `ServicesProvider` no envuelve la app, `useServices()` devuelve `null` y recibes errores de destructuring. Solución: valor por defecto con forma conocida o error claro al consumir ("`useServices` requiere `<ServicesProvider>`").

## Conceptos clave

- **DI en React**: recibir la implementación (props/contexto) en vez de importarla → testeable y polimórfico.
- **Import duro vs inyectado**: el primero acopla al módulo concreto; el segundo depende de una abstracción.
- **`ServicesProvider` + `useServices`**: contenedor por contexto para servicios globales; la raíz (`main.jsx`) decide las implementaciones reales.
- **Tabla de escenarios**: import directo para lógica interna; DI cuando la implementación varía (tenant, storage, tests, micro frontends).
- **IoC / factories**: `crearRepositorio({ fetcher, baseUrl })` — quién crea configura; el servicio solo usa lo recibido.
- **Peligros**: contexto gigante sin contrato documentado e inyectar **estado** en vez de **servicios**.

## Autoevaluación

**1. Explica con tus palabras la diferencia entre la versión "duro" y la "inyectada" de `Alta`.**

<details>
<summary>Respuesta</summary>

En la "duro", `Alta` importa `enviarEmail` de un módulo concreto: está acoplada a esa implementación y para testear debe mockear el módulo. En la "inyectada", `Alta` recibe `enviarEmail` como prop: en producción llega la real y en el test `vi.fn()`; el componente no sabe de dónde sale la función.

</details>

**2. ¿Por qué `ServicesProvider` usa contexto y no props? ¿Qué problema resuelve frente a pasar servicios por props?**

<details>
<summary>Respuesta</summary>

Porque los servicios suelen necesitarse en muchos componentes a distintas profundidades. Pasarlos por props obligaría a re-enviarlos en cada nivel (prop drilling) y a tocar decenas de firmas al añadir un servicio. El contexto los entrega "por aire" a cualquier descendiente; solo `main.jsx` cambia al variar implementaciones.

</details>

**3. Según la tabla, en qué escenario usarías DI por factory y por qué encaja mejor que el contexto?**

<details>
<summary>Respuesta</summary>

En escenarios como multi-tenant/storages o tests, cuando necesitas **varias instancias configuradas** de la misma lógica. La factory (`crearRepositorio({ fetcher, baseUrl })`) crea la real y la falsa sin duplicar código y sin un Provider global; el contexto sirve para **una** implementación compartida por el árbol, no para instancias múltiples.

</details>

**4. Tu equipo inyecta `{ usuario }` por contexto y ahora nadie sabe quién muta el usuario. ¿Qué diagnosis y solución aplicas?**

<details>
<summary>Respuesta</summary>

Diagnosis: están inyectando **estado** (mutable, compartido) en vez de un **servicio**, así que cualquier hijo puede mutarlo y se pierde el dueño único. Solución: inyectar el servicio que administra ese estado (`auth` con `login/logout/updateProfile`), dejando el estado encapsulado detrás de su API.

</details>
