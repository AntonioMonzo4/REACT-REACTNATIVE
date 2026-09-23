# Unidad 01 — REST y GraphQL

## Objetivos

Al terminar esta unidad podrás:

- Diseñar los endpoints de un CRUD REST (recursos, verbos, códigos de estado).
- Explicar qué significa idempotencia y por qué `PUT` la tiene y `POST` no.
- Devolver errores con un cuerpo consistente que un frontend pueda leer.
- Definir qué es GraphQL y explicar con ejemplos sus ventajas y riesgos frente a REST.
- Elegir entre REST y GraphQL según el caso de uso, sin dogmas.

## Requisitos

- Haber hecho peticiones con `fetch` (módulo de consumo de APIs / M8 del roadmap).
- Conocer los verbos HTTP por encima: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Conocer qué es un código de estado (`200`, `404`…), aunque solo sea a nivel intuitivo.
- No hace falta haber montado nunca un backend: aquí solo diseñamos; el código llega en la Unidad 02.

## REST (recap + diseño)

REST es el estilo dominante para APIs web. La idea es modelar tu dominio como
**recursos** identificados por URLs y manipulate con los verbos HTTP. Si vienes de
`fetch('/api/...')` en React, ya estás usando REST: ahora damos nombre a las reglas
del juego:

- Recursos en URLs (`/posts`, `/posts/1`), verbos HTTP (`GET/POST/PUT/PATCH/DELETE`).
- **Idempotencia**: `PUT/DELETE` idempotentes; `POST` no.
  - *Idempotente* significa: repetir la misma petición deja el servidor en el mismo
    estado que una sola vez. Borrar `/posts/1` dos veces da el mismo resultado;
    crear dos veces con `POST` dos posts. Esto importa cuando una petición falla y
    el cliente reintenta.
- Estados útiles: `200/201/204/400/401/403/404/409/422/500`.
  - En castellano rápido: `200` ok, `201` creado, `204` ok sin cuerpo, `400` petición
    mal formada, `401` no identificado, `403` identificado pero sin permiso, `404`
    no existe, `409` conflicto, `422` datos validados pero inválidos, `500` se rompió
    el servidor.
- HATEOAS ligero: links en respuestas (`"links": { "self": ..., "next": ... }`).
  - Devolver enlaces dentro del JSON ayuda al cliente a navegar (auto-descubrir la
    siguiente página, el recurso actual) sin hardcodear rutas.
- Versionado: `/api/v1/...` o header.
  - Cuando rompas compatibilidad, no rompas la URL vieja: saca `/v2` o cambia un
    header de versión.

### Diseño (guía rápida)

Para un recurso `posts`, este esquema cubre el 95 % de los CRUD:

```text
GET    /api/posts           lista + filtros (?page=, ?q=)
GET    /api/posts/:id       detalle
POST   /api/posts           crea (201 + Location)
PUT    /api/posts/:id       reemplaza
PATCH  /api/posts/:id       actualiza parcial
DELETE /api/posts/:id       borra (204)
```

Errores con cuerpo consistente:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "title": "requerido" } } }
```

Mantén siempre la misma forma del error: tu frontend podrá hacer un único
`if (data.error)` en el interceptor de `fetch` en vez de adivinar tres formatos
distintos.

## GraphQL

GraphQL es un **lenguaje de consultas** para APIs, no un "REST alternativo" ni una
base de datos. Su característica principal es el **endpoint único**:

- **Endpoint único** (`POST /graphql`), lenguaje de consultas.
- Cliente pide exactamente los campos que necesita → menos over/under-fetching.
  - *Over-fetching*: pedir `/api/posts/1` y recibir 30 campos cuando la tarjeta
    solo muestra 2. *Under-fetching*: pedir el post y luego otra llamada para el
    autor, y otra para los comentarios.

```graphql
query {
  post(id: "1") {
    title
    author { name }
    comments(first: 5) { body }
  }
}
```

Con esa única consulta el cliente recibe exactamente `title`, `author.name` y los
primeros 5 `comments.body`. El servidor decide cómo juntar los datos; el cliente
no multiplica endpoints.

### REST vs GraphQL

| | REST | GraphQL |
|---|------|---------|
| Caché HTTP | natural | compleja |
| Over-fetch | habitual | evitado |
| Mutaciones | verbos HTTP | schema de Mutation |
| Curva | baja | schema + resolvers |
| Realtime | SSE/polling | Subscriptions |

Lectura de la tabla para novatos:

- **Caché HTTP**: en REST, `GET /api/posts` se puede cachear con `Cache-Control`,
  CDNs y el propio navegador. En GraphQL casi todo va por `POST /graphql`, así que
  hay que construir caché a mano.
- **Curva**: REST lo escribes el mismo día; GraphQL necesita definir schema,
  resolvers y herramientas de validación antes de sacar el primer endpoint.

## Errores comunes

REST:

- Exponer GraphQL sin límites de profundidad/costo (DoS). *(también aplica a REST:
  consultas sin paginar ni límite de `?page=`)*
- Mezclar códigos de estado (`200` con un error dentro sin razón, `500` para
  errores de usuario).
- Errores con formatos distintos en cada endpoint.

GraphQL:

- Exponer GraphQL sin límites de profundidad/costo (DoS).
- N+1 en resolvers → **DataLoader**.
  - El *problema N+1*: listar 20 posts y, por cada uno, hacer una consulta extra
    por su autor → 1 + 20 consultas. **DataLoader** agrupa y cachea esas
    consultas en un solo batch.
- Mutaciones no autorizadas por rol.

## En la práctica

- REST para CRUD simple y caché CDN.
- GraphQL cuando muchos clientes/consumidores necesitan shapes distintos.

Regla práctica: si tu API la consume principalmente tu propio frontend y el
modelo es un CRUD predecible, REST. Si la consumen web + móvil + terceros con
necesidades de campos muy distintas, y ya tienes equipo para mantener el schema,
GraphQL empieza a compensar.

## Conceptos clave

| Concepto | Definición corta |
|----------|------------------|
| **Recurso** | Entidad identificable por URL (`/posts/1`) |
| **Idempotencia** | Repetir la petición no cambia el resultado (`PUT`, `DELETE` sí; `POST` no) |
| **HATEOAS** | Enlaces de navegación dentro de la respuesta JSON |
| **Versionado** | `/api/v1` o header para no romper clientes viejos |
| **Over/under-fetching** | Recibir de más o tener que hacer varias llamadas; GraphQL los mitiga |
| **N+1** | Una consulta por item de una lista; se arregla con **DataLoader** |
| **Subscription** | Canal GraphQL para tiempo real (equivalente a WebSocket/SSE) |

## Autoevaluación

**1. Tu cliente reintenta una petición que falló por red. ¿Con qué verbos es seguro reintentar y por qué?**

<details>
<summary>Respuesta</summary>

Con los **idempotentes**: `GET`, `PUT`, `PATCH` (si se define así) y `DELETE`.
Repetirlos deja el servidor igual que una sola llamada. `POST` **no** es
idempotente: reintentarlo puede crear dos recursos.

</details>

**2. La lista de posts pide 50 campos y tu tarjeta usa 2. ¿Qué problema es y cómo lo evita GraphQL?**

<details>
<summary>Respuesta</summary>

Es **over-fetching**. En GraphQL el cliente escribe la consulta pidiendo solo los
campos que necesita (`post { title author { name } }`), así que el servidor
responde exactamente con eso, en una sola petición al endpoint único
`POST /graphql`.

</details>

**3. ¿Qué es el problema N+1 y cómo se mitiga?**

<details>
<summary>Respuesta</summary>

Es hacer **1 consulta para la lista y 1 más por cada elemento** (p. ej., el autor
de cada post): 1 + N consultas. Se mitiga con **DataLoader**, que agrupa los
IDs pendientes en un solo batch y cachea resultados dentro del request.

</details>

**4. Tienes un CRUD simple para tu propio frontend React y quieres caché en CDN. ¿REST o GraphQL?**

<details>
<summary>Respuesta</summary>

**REST**: modela bien recursos, los `GET` se cachean de forma natural (HTTP/CDN)
y la curva de adquisición es baja. GraphQL compensa cuando muchos consumidores
necesitan shapes distintos y puedes mantener el schema.

</details>
