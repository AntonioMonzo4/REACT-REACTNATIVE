# Unidad 02 — FastAPI (conceptos básicos)

## Arranque

```bash
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install fastapi "uvicorn[standard]"
uvicorn main:app --reload
```

```python
# main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PostIn(BaseModel):
    title: str
    body: str = ""

@app.get("/api/posts")
def list_posts():
    return [{"id": 1, "title": "Hola"}]

@app.post("/api/posts", status_code=201)
def create_post(post: PostIn):
    return {"id": 2, **post.model_dump()}
```

- **Pydantic** valida y serializa → 422 automático en body inválido.
- Docs interactivas en `/docs` (Swagger) y `/redoc`.

## Frontend: CORS

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Estructura sugerida

```text
app/
  main.py
  routers/posts.py
  models.py      # SQLAlchemy / Tortoise
  schemas.py     # Pydantic
  deps.py        # dependencias (DB, user actual)
```

## Conexión con el frontend React

```js
const res = await fetch('http://localhost:8000/api/posts')
```

- En producción, proxy o mismo origen (evitar CORS en prod).
- Auth: `Authorization: Bearer <jwt>` igual que M8.

## Errores comunes

- Olvidar CORS en dev → fallo preflight.
- Devolver ORM objects sin serializar.
- Sin validación de input (usar Pydantic siempre).
