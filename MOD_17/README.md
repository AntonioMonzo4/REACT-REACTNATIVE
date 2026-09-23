# Módulo 17 — Backend para Frontend

Material del **Módulo 17** del roadmap: REST/GraphQL, FastAPI, WebSockets y autenticación.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — REST y GraphQL](docs/Unidad_01_REST_y_GraphQL.md) | Diseño REST, errores, GraphQL vs REST |
| [02 — FastAPI](docs/Unidad_02_FastAPI.md) | Rutas, Pydantic, CORS, estructura |
| [03 — WebSockets](docs/Unidad_03_WebSockets.md) | Tiempo real, rooms, SSE vs WS |
| [04 — Autenticación](docs/Unidad_04_Autenticacion_API.md) | JWT, cookies, OAuth2/PKCE, roles |

## Práctica sugerida

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
