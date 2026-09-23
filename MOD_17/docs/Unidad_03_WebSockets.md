# Unidad 03 — WebSockets y tiempo real

## Objetivos

Al terminar esta unidad podrás:

- Explicar la diferencia entre HTTP request/response y una conexión WebSocket full-duplex.
- Describir el handshake `Upgrade` que convierte una petición HTTP en WebSocket.
- Escribir un endpoint WebSocket en FastAPI con "rooms" y un cliente en React.
- Aplicar los patrones de producción: heartbeat, reintentos con backoff, auth en el
  handshake y escala con Redis Pub/Sub.
- Elegir entre WebSocket, SSE y polling según lo que necesites.

## Requisitos

- Haber seguido la Unidad 02: FastAPI corriendo y un componente React con `useEffect`.
- Entender el ciclo de vida de un effect en React (montaje, desmontaje, dependencias).
- Conocer a grandes rasgos HTTP (métodos, cabeceras); el handshake de abajo se apoya en eso.

## HTTP vs WebSocket

HTTP funciona por **idempotent request/response**: el cliente pregunta, el servidor
responde y la conversación termina. Para preguntar 100 veces necesitas 100
peticiones. WebSocket abre un **canal persistente** donde cualquiera de los dos
lados puede hablar cuando quiera. Comparado directamente:

| | HTTP | WebSocket |
|---|------|-----------|
| Conexión | request/response | **full-duplex** persistente |
| Overhead | headers cada vez | bajo tras handshake |
| Caso | CRUD, páginas | chat, live, colaboración |

Lectura para novatos:

- *Full-duplex*: el servidor puede enviar mensajes al cliente **sin** que el
  cliente pregunte antes (en HTTP puro, eso solo con trucos como polling/SSE).
- *Overhead*: HTTP repite cabeceras en cada petición; WebSocket solo paga ese
  coste en el primer intercambio.

## Handshake

El canal no empieza "por arte de magia": empieza como una petición HTTP normal
que pide **cambiarse** a WebSocket:

```text
GET /ws HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: ...
→ 101 Switching Protocols
```

Si el servidor responde `101 Switching Protocols`, a partir de ahí el mismo socket
habla el protocolo WebSocket: dos vías, sin recargar, sin abrir otra conexión.

## Server (FastAPI)

```python
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/{room}")
async def room(ws: WebSocket, room: str):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_text()
            await ws.send_json({"room": room, "msg": data})
    except WebSocketDisconnect:
        ...
```

Qué está pasando:

- `@app.websocket("/ws/{room}")` registra la ruta y extrae el nombre de la sala
  de la URL (`/ws/general` → `room="general"`).
- `await ws.accept()` completa el handshake `101`.
- El `while True` es el bucle de vida del socket: recibe un mensaje, responde.
- `WebSocketDisconnect` es cómo sabes que el cliente se fue: cierra el bucle en
  vez de dejar una excepción suelta.

> En una app real, en vez de responder al mismo socket, publicarías el mensaje a
> **todos** los de la sala (el patrón "room" de la sección Patrones).

## Cliente (React)

```jsx
useEffect(() => {
  const ws = new WebSocket(`ws://localhost:8000/ws/${room}`)
  ws.onmessage = (e) => setMsgs((m) => [...m, JSON.parse(e.data)])
  return () => ws.close()
}, [room])
```

Puntos clave para que no se te rompa:

- El `WebSocket` se crea **dentro** del `useEffect`, una vez por dependencia.
- El `return () => ws.close()` cierra la conexión al desmontar o al cambiar
  `room`; sin él, acumulas sockets abiertos (fugas).
- `ws.onmessage` da el payload crudo: aquí haces `JSON.parse(e.data)` y añades a
  tu estado con el updater funcional `setMsgs((m) => ...)`.

## Patrones

- **Rooms / channels**: `room:general`.
  - Agrupa conexiones por sala (una conversación, un documento, una partida) para
    que los mensajes no salten a todos los clientes del servidor.
- Heartbeat `ping/pong` para detectar desconexiones.
  - El cliente responde `pong` cada N segundos; si falla, el servidor da de baja
    la sesión. Detecta conexiones "muertas" que el sistema operativo no avisa.
- Reintento con backoff al caer.
  - Si se corta, reconecta esperando 1s, 2s, 4s… (no a cada milisegundo: eso
    abruma al servidor cuando hay una caída general).
- Auth: validar token en el handshake (`?token=` o cookie).
  - El WebSocket no lleva headers custom fácilmente tras el `101`, así que el
    token se suele pasar en la query o en una cookie leída durante el upgrade.
- Escala: Redis Pub/Sub entre nodos (no memoria local).
  - Con un solo proceso basta un dict en memoria; con 10 réplicas, un mensaje
    recibido en el nodo A debe llegar al B: Redis (Pub/Sub o streams) hace de
    buzón compartido.

## Alternativas

- **SSE**: servidor→cliente unidireccional, sobre HTTP, más simple.
  - Ideal para "stock en vivo" o progreso de un job: el servidor emite eventos y
    el navegador usa `EventSource`. Si nunca necesitas que el cliente envíe
    mensajes por ese canal, no te compliques con WebSocket.
- **Polling**: fallback; intervalo + `ETag`.
  - Consultar cada X segundos con `If-None-Match`/`ETag` para que el servidor
    responda `304` si no hay cambios. Funciona con cualquier infraestructura HTTP.

## Errores comunes

- No limpiar `ws.close()` en unmount → fugas.
  - Señales: varias conexiones en la pestaña de red tras navegar, mensajes
    duplicados. Solución: el `return () => ws.close()` del `useEffect`.
- Crear el socket en cada render sin dependencias estables.
  - Si abres el socket fuera del effect o con dependencias que cambian en cada
    render, abres y cierras conexiones sin parar. Usa `[]` o `[room]`, nada que
    sea un objeto nuevo cada render.
- Confiar en mensajes del cliente sin validar/esquema.
  - El payload de un WebSocket es texto libre: valida con Pydantic (u otro
    schema) en el servidor antes de procesar o reenviar, igual que harías con un
    body de REST.

## Conceptos clave

| Concepto | Definición corta |
|----------|------------------|
| **Full-duplex** | Ambos lados pueden enviar en cualquier momento, sin esperar turno |
| **Handshake / `101`** | Upgrade de HTTP a WebSocket sobre la misma conexión |
| **Room / channel** | Subconjunto de conexiones al que se reenvía un mensaje |
| **Heartbeat** | `ping/pong` periódico para detectar peers muertos |
| **Backoff** | Espera creciente entre reintentos de reconexión |
| **SSE** | Eventos servidor→cliente sobre HTTP, unidireccional y más simple |
| **Redis Pub/Sub** | Buzón compartido para propagar mensajes entre nodos |

## Autoevaluación

**1. Mi app de chat funciona, pero al navegar entre pantallas los mensajes llegan duplicados. ¿Qué reviso?**

<details>
<summary>Respuesta</summary>

La limpieza del effect: falta `return () => ws.close()` (o no cierras el socket
anterior al cambiar de sala). Cada montaje deja un socket vivo recibiendo y
procesando mensajes.

</details>

**2. ¿Qué le pasa a la conexión cuando el servidor responde `101 Switching Protocols`?**

<details>
<summary>Respuesta</summary>

Se completa el handshake: la conexión HTTP original **se convierte** en una
conexión WebSocket full-duplex persistente. A partir de ahí ambos lados envían
mensajes libremente sobre el mismo socket, sin abrir otra conexión.

</details>

**3. Solo necesito enviarle novedades del servidor al cliente (precio de unas
acciones). ¿WebSocket o SSE?**

<details>
<summary>Respuesta</summary>

**SSE**: es unidireccional (servidor→cliente), corre sobre HTTP normal, es más
simple y se reconecta solo con `EventSource`. Reserva WebSocket cuando el
cliente también tenga que enviar mensajes en tiempo real (chat, colaboración).

</details>

**4. Tengo 4 réplicas del servidor de WebSockets. ¿Dónde debo mantener el estado de las salas?**

<details>
<summary>Respuesta</summary>

**No en memoria local de cada nodo**: un mensaje que llega al nodo A nunca llegaría
al cliente conectado al nodo B. Usa un canal compartido tipo **Redis Pub/Sub**
(entre otras opciones) para retransmitir entre réplicas.

</details>
