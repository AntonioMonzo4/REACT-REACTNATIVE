# Unidad 06 — Route Handlers y React Compiler

## Objetivos

- Exponer endpoints HTTP (`GET`, `POST`, …) con Route Handlers dentro de `app/api/`.
- Entender la ruta dinámica `[id]` en un handler y leer `params` como promesa.
- Situar cuándo usar un Route Handler frente a una Server Action (BFF, webhooks, APIs externas).
- Comprender qué hace el **React Compiler**: memoización automática de componentes y hooks.
- Evaluar con criterio (y midiendo) si conviene activar el compiler en tu proyecto.

## Requisitos

- Unidades 01–05 completadas: React 19, frontera server/client, routing, SSR/SSG/ISR y data fetching en servidor.
- Haber escrito algún endpoint básico en el curso o conocer qué es `GET`/`POST`, JSON y códigos de estado (201, 404…).
- Saber qué problema resuelven `useMemo`/`useCallback`/`memo` (re-renders) para entender el valor del compiler.
- Proyecto `next-app` mínimo generado con `create-next-app` (ver README del módulo).

## Route Handlers (API en App Router)

### Qué significa

Un **Route Handler** es un archivo `route.js` (o `route.ts`) exportando funciones nombradas por método HTTP. Es la evolución de las *API Routes* de Pages Router: en vez de `pages/api/posts.js`, ahora vive **co-localizada** con la ruta UI en `app/api/posts/route.js`.

```javascript
// app/api/posts/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const posts = await db.posts.findMany()
  return NextResponse.json(posts)
}

export async function POST(request) {
  const body = await request.json()
  // validar...
  return NextResponse.json({ ok: true }, { status: 201 })
}
```

```javascript
// app/api/posts/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params
  return NextResponse.json({ id })
}
```

Lectura del primer bloque:

- El nombre de la **exportación** define el verbo: `GET`, `POST`, `PUT`, `DELETE`…
- `request` es la Request web estándar: `await request.json()`, headers, etc.
- `NextResponse.json(data, { status })` construye la respuesta (aunque un objeto `Response` normal también sirve).
- En `[id]/route.js`, `params` llega como **promesa** (mismo convenio que en las pages de Next 15+) → `const { id } = await params`.

Notas originales conservadas:

- Misma API web que Express/Fastify pero **co-localizada** con la ruta UI.
- Ideal para BFF (backend for frontend) y webhooks.

### Por qué importa (y Server Action o Route Handler)

| Necesidad | Herramienta |
|-----------|-------------|
| El usuario envía un `<form>` y quieres mutar + revalidar | **Server Action** (`'use server'`) |
| Un webhook de Stripe/GitHub te llama con POST | **Route Handler** |
| Un cliente externo o móvil consume JSON | **Route Handler** |
| Quieres control fino de headers, status y streaming HTTP | **Route Handler** |
| API pública versionada (`/api/v1/...`) | **Route Handler** |

**Analogía**: la Server Action es hablar con la cocina por el *interior* del restaurante (solo tú, cliente de la casa); el Route Handler es la *puerta de recepción* con un letrero `/api/posts` que cualquiera puede llamar respetando el horario (método HTTP).

**BFF** (backend for frontend): tu Next puede ser la fachada que agrega varias APIs internas, aplica auth y devuelve un JSON afinado al frontend — todo en la misma app.

## React Compiler (experimental / rollout)

**Qué hace**: memoiza **automáticamente** componentes y hooks → menos re-renders sin escribir `useMemo`/`useCallback` a mano.

```javascript
// babel plugin / react-compiler (config en next.config)
```

Cómo encaja en tu flujo: añades el plugin de Babel/SWC (`react-compiler`) en la configuración de Next, recompilas, y el compilador **transforma** tus componentes para que, cuando las props no cambien de identidad, React pueda reusar el render anterior. Es decir, hace en build lo que tú harías a mano con `React.memo`, `useMemo` y `useCallback` — pero de forma consistente en todo el árbol.

Tabla de reglas/límites (conservada):

| Reglas / límites actuales |
|---------------------------|
| No reemplaza entender cuándo un objeto es nuevo |
| No todo el ecosistema está 100 % compatible (verifica versiones) |
| Efectos y mutaciones siguen teniendo reglas propias |
| `memo` manual sigue siendo válido donde el compiler no aplica |

En palabras de novato: el compiler es un **becario ultra-diligente**, no un mago. Sigue importando saber que `onClick={() => x}` crea una función nueva en cada render si la defines inline, que los efectos necesitan dependencias correctas y que un store que cambia de identidad cada render seguirá rompiendo la memoización.

### Cuándo activarlo

1. Equipo con problemas de performance por recreación de callbacks.
2. Base de código grande sin `memo` disciplinado.
3. Medir **antes** (React DevTools Profiler) y **después**.

La tercera línea es la más importante del apartado: sin perfiles de Profiler no sabrás si el compiler te dio ganas reales o solo ruido en el build. Captura commit timings, re-renders de componentes caros y tamaño de bundle antes y después de activarlo.

## Errores comunes

### 1. Esperar que el compiler “arregle” un store que cambia identidad cada render

**Ejemplo (mal):**

```javascript
const state = { ...prev, items: [...prev.items] }  // objeto nuevo en cada render
```

**Solución**: aunque el compiler memoice, un valor que **realmente** nace nuevo en cada render no puede reusarse — entiende la identidad de objetos/arrays y normaliza en el origen (estado inmutable, stores tipados, dependencias estables). El compiler no sustituye ese razonamiento.

### 2. Activar el compiler sin limpiar `useMemo` mal hechos

**Ejemplo (mal):**

```javascript
// dependencias incorrectas + compiler encima → doble memoización inútil
const valor = useMemo(() => calc(a, b), [])   // ❌ faltan a, b
```

**Solución**: primero corrige/reglas las memoizaciones manuales (dependencias completas) y *después* activa el compiler; si no, tendrás doble memoización inútil y resultados cacheados de más.

### 3. Exponer la API interna por accidente

**Ejemplo (mal):**

```javascript
// route.js que devuelve todo el registro de la BD
return NextResponse.json(row)   // ❌ incluye passwordHash, etc.
```

**Solución**: en los Route Handlers selecciona y sanea los campos antes de responder, valida el `body` (status 400 ante entradas malas) y aplica auth cuando toque: es una puerta pública de tu app.

## En el ejemplo

README con flags de `next.config` y nota de Profiler. El ejemplo del módulo documenta dónde iría la entrada del compiler (`next.config`) y recuerda tomar perfiles con React DevTools Profiler antes/después; la demo de `EJEMPLO_MODERNO/` (Vite) es el bancillo de pruebas de React 19 sin servidor, mientras que los Route Handlers se prueban en el `next-app` con `curl` o el navegador sobre `/api/posts`.

## Conceptos clave

- **Route Handler**: `route.js` con exports por método HTTP (`GET`, `POST`…) en `app/api/...`.
- **Co-localización**: la API vive junto a la ruta UI que la consume, en el mismo `app/`.
- **Ruta dinámica en API**: `app/api/posts/[id]/route.js` → `params` como promesa.
- **`NextResponse.json`**: helper de respuesta JSON (status y headers opcionales).
- **BFF**: el Next como fachada que agrega/authifica APIs internas para su frontend.
- **Server Action vs Route Handler**: form interno + revalidación frente a endpoint HTTP público/webhook.
- **React Compiler**: transformación en build que memoiza automáticamente componentes/hooks.
- **Límites del compiler**: no reemplaza entender identidad de objetos, ecosistema no 100 % compatible, efectos con sus propias reglas, `memo` manual sigue válido.
- **Medir antes/después**: React DevTools Profiler como criterio de activación.

## Autoevaluación

1. Necesito recibir un webhook de pagos (POST con JSON). ¿Server Action o Route Handler? ¿Por qué?

<details><summary>Respuesta</summary>

Route Handler: el emisor es externo a tu UI y habla HTTP estándar; monta `app/api/webhooks/pagos/route.js` con `export async function POST(request)` y responde con el status adecuado. Las Server Actions sirven para mutaciones disparadas desde tus propios formularios/clientes React.

</details>

2. En `app/api/posts/[id]/route.js`, ¿cómo obtengo el `id` en Next 15+?

<details><summary>Respuesta</summary>

El segundo argumento del handler es `{ params }` y `params` es una promesa: `export async function GET(request, { params }) { const { id } = await params; ... }`.

</details>

3. ¿Qué gano y qué no gana el React Compiler?

<details><summary>Respuesta</summary>

Gana: memoización automática de componentes y hooks sin escribir `useMemo`/`useCallback` a mano, menos re-renders por recreación de callbacks. No gana: entender cuándo un objeto/array es nuevo de verdad, garantías sobre todo el ecosistema (verifica compatibilidad), ni reglas de efectos/mutaciones —siguen siendo tu responsabilidad—.

</details>

4. ¿Por qué se recomienda medir con Profiler antes de activar el compiler?

<details><summary>Respuesta</summary>

Porque solo comparando perfiles antes/después sabrás si las ganancias de re-render son reales o si el problema de performance estaba en otra parte (renders baratos, datos mal cacheados, librerías pesadas). Medir evita optimizar a ciegas.

</details>
