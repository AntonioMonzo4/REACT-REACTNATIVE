# Módulo 17 — Backend para Frontend

Material del **Módulo 17** del roadmap: REST/GraphQL, FastAPI, WebSockets y autenticación.

## Para quién es este módulo

Este módulo es para ti si:

- **Eres frontend y te falta el otro lado**: quieres poder montar tú mismo una API
  sencilla para tus proyectos React, en vez de depender siempre de un backend ajeno
  o de servicios de terceros.
- **Ya usas `fetch`** (por ejemplo, lo visto en el M8) y quieres entender de dónde
  salen esas respuestas: rutas, códigos de estado, JSON bien formado y errores con
  sentido.
- **Escuchas "GraphQL", "WebSockets" o "JWT"** en las entrevistas y quieres
  entender qué es cada cosa, cuándo conviene cada una y cómo se ven en código.

No necesitas ser experto en Python: FastAPI se usa aquí como puente, con ejemplos
cortos y copia-pega. Si nunca has escrito una petición HTTP con `fetch`, repasa
antes el módulo de consumo de APIs del roadmap.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — REST y GraphQL](docs/Unidad_01_REST_y_GraphQL.md) | Diseño REST, errores, GraphQL vs REST |
| [02 — FastAPI](docs/Unidad_02_FastAPI.md) | Rutas, Pydantic, CORS, estructura |
| [03 — WebSockets](docs/Unidad_03_WebSockets.md) | Tiempo real, rooms, SSE vs WS |
| [04 — Autenticación](docs/Unidad_04_Autenticacion_API.md) | JWT, cookies, OAuth2/PKCE, roles |

## Cómo estudiar

Sigue estas 4 fases en orden; cada una depende de la anterior.

| Fase | Qué haces | Resultado esperado |
|------|-----------|--------------------|
| **1 — Diseño de APIs** | Lee la [Unidad 01](docs/Unidad_01_REST_y_GraphQL.md): verbos HTTP, códigos de estado, idempotencia y la comparativa REST vs GraphQL. | Sabes diseñar las rutas de un CRUD (`GET/POST/PUT/PATCH/DELETE`) y elegir REST o GraphQL con argumentos. |
| **2 — Tu primer backend** | Sigue la [Unidad 02](docs/Unidad_02_FastAPI.md): crea el venv, instala FastAPI, levanta `uvicorn` y abre `/docs`. Conecta el `fetch` del frontend. | Tienes `main.py` corriendo en `http://localhost:8000` y tu React pidiéndole datos sin errores de CORS. |
| **3 — Tiempo real** | Lee la [Unidad 03](docs/Unidad_03_WebSockets.md): handshake, server en FastAPI, cliente en React, rooms, heartbeat y alternativas (SSE, polling). | Explicas cuándo hace falta WebSocket y tienes un chat mínimo funcionando (o sabes por qué SSE bastaría). |
| **4 — Seguridad** | Termina con la [Unidad 04](docs/Unidad_04_Autenticacion_API.md): JWT vs cookies, OAuth2 con PKCE, reglas de oro y checklist de implementación. | Sabes proteger tus rutas, qué va en el cliente y qué solo en el servidor, y completas la *Práctica mínima* de abajo. |

## Práctica mínima

No se commitea un backend Python en este repo (fuera del alcance frontend); sigue:

```bash
# Terminal aparte
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install fastapi "uvicorn[standard]"
uvicorn main:app --reload       # http://localhost:8000/docs
```

1. Reproduce `main.py` de la Unidad 02.
2. Conecta un cliente fetch del M8 a `http://localhost:8000/api/posts`.
3. Añade CORS con el origen de Vite (`http://localhost:5173`).
4. (Opcional) WebSocket de chat con el snippet de la Unidad 03.

## Mapa con el README

- [x] REST
- [x] GraphQL
- [x] FastAPI (conceptos básicos)
- [x] WebSockets
- [x] Autenticación
- [ ] Proyecto backend propio — *pendiente* (pasos arriba)
