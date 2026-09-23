# Unidad 03 — WebSockets y tiempo real

## HTTP vs WebSocket

| | HTTP | WebSocket |
|---|------|-----------|
| Conexión | request/response | **full-duplex** persistente |
| Overhead | headers cada vez | bajo tras handshake |
| Caso | CRUD, páginas | chat, live, colaboración |

## Handshake

```text
GET /ws HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: ...
→ 101 Switching Protocols
```

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

## Cliente (React)

```jsx
useEffect(() => {
  const ws = new WebSocket(`ws://localhost:8000/ws/${room}`)
  ws.onmessage = (e) => setMsgs((m) => [...m, JSON.parse(e.data)])
  return () => ws.close()
}, [room])
```

## Patrones

- **Rooms / channels**: `room:general`.
- Heartbeat `ping/pong` para detectar desconexiones.
- Reintento con backoff al caer.
- Auth: validar token en el handshake (`?token=` o cookie).
- Escala: Redis Pub/Sub entre nodos (no memoria local).

## Alternativas

- **SSE**: servidor→cliente unidireccional, sobre HTTP, más simple.
- **Polling**: fallback; intervalo + `ETag`.

## Errores comunes

- No limpiar `ws.close()` en unmount → fugas.
- Crear el socket en cada render sin dependencias estables.
- Confiar en mensajes del cliente sin validar/esquema.
