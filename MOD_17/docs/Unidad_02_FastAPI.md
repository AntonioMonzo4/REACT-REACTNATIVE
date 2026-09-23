# Unidad 02 — FastAPI (conceptos básicos)

## Objetivos

Al terminar esta unidad podrás:

- Montar un entorno Python aislado (`venv`) e instalar FastAPI + Uvicorn.
- Escribir un `main.py` con una ruta de lectura y una de creación.
- Entender el papel de Pydantic para validar el body y devolver `422` automático.
- Habilitar CORS para que tu frontend Vite (puerto 5173) pueda llamar a la API.
- Conectar un `fetch` de React a tu backend y estructurar el proyecto cuando crezca.

## Requisitos

- Python 3.10+ instalado (`python --version`).
- Conocer `fetch` y cómo consume APIs tu frontend (M8 del roadmap).
- Saber qué es un código de estado HTTP y para qué sirve CORS (Unidad 01).
- Un terminal donde puedas dejar un proceso corriendo (`uvicorn --reload`).

## Arranque

Primero creamos un entorno virtual (una burbuja de dependencias solo para este
proyecto) y arrancamos el servidor:

```bash
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install fastapi "uvicorn[standard]"
uvicorn main:app --reload
```

- `python -m venv .venv` crea la carpeta `.venv/` con un Python aislado.
- `source .venv/bin/activate` lo "enciende" (en Windows PowerShell:
  `.venv\Scripts\activate`). Si no lo activas, `pip install` instala a sistema.
- `uvicorn main:app --reload` arranca el servidor: `main` es el archivo
  (`main.py`), `app` el objeto `FastAPI()`, y `--reload` reinicia al guardar.
- Abre **http://localhost:8000/docs**: Swagger UI te permite probar cada endpoint
  desde el navegador, sin escribir una sola línea de JS.

### El `main.py` mínimo

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

Lo que ocurre línea a línea:

- `@app.get(...)` registra una ruta; el decorador es lo que convierte una función
  Python en un endpoint HTTP.
- `class PostIn(BaseModel)` define el **contrato de entrada**: qué campos esperas
  y de qué tipo.
- `status_code=201` en el `POST` cumple la regla de la Unidad 01: recurso creado.
- `**post.model_dump()` expande el modelo Pydantic en el dict de respuesta.

Lo importante de Pydantic:

- **Pydantic** valida y serializa → 422 automático en body inválido.
  Si envías `{"title": 123}` o te falta `title`, FastAPI ni siquiera entra en tu
  función: responde `422` con el detalle del campo. Escribe una vez, valida en
  todas las rutas.
- Docs interactivas en `/docs` (Swagger) y `/redoc`.

## Frontend: CORS

El navegador aplica la **same-origin policy**: tu app en `http://localhost:5173`
(Vite) no puede llamar a `http://localhost:8000` salvo que el servidor lo
permita explícitamente. Eso es CORS:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- `allow_origins` es la lista blanca de orígenes. Solo pon `*` si estás
  experimentando: en serio, lista los orígenes reales.
- `allow_methods` / `allow_headers` autorizan verbos y cabeceras (como
  `Authorization` cuando uses tokens en la Unidad 04).

## Estructura sugerida

Cuando el `main.py` pase de una pantalla, sepáralo así:

```text
app/
  main.py
  routers/posts.py
  models.py      # SQLAlchemy / Tortoise
  schemas.py     # Pydantic
  deps.py        # dependencias (DB, user actual)
```

- `routers/`: una carpeta por recurso, con su `APIRouter`.
- `models.py`: tablas de la base de datos (SQLAlchemy / Tortoise).
- `schemas.py`: modelos Pydantic de entrada/salida (lo que ve el cliente).
- `deps.py`: dependencias reutilizables (sesión de DB, usuario actual).

La separación `models` (persistencia) vs `schemas` (API) evita que expongas
campos internos por accidente.

## Conexión con el frontend React

```js
const res = await fetch('http://localhost:8000/api/posts')
```

- En producción, proxy o mismo origen (evitar CORS en prod).
  - En desarrollo Vite puedes montar un proxy en `vite.config` apuntando a
    `localhost:8000` y llamar `/api/posts` sin host; en producción, ambos
    orígenes suelen estar bajo el mismo dominio tras un reverse proxy.
- Auth: `Authorization: Bearer <jwt>` igual que M8.
  - Cuando protejas rutas, añade la cabecera en cada `fetch`:
    `headers: { Authorization: `Bearer ${token}` }`.

## Errores comunes

- Olvidar CORS en dev → fallo preflight.
  - Síntoma típico en consola: *«Ha sido bloqueada por la política de CORS»*.
  - Prerrequisito: revisa `allow_origins` (y que el puerto sea el de Vite, `5173`).
- Devolver ORM objects sin serializar.
  - FastAPI no sabe convertir cualquier objeto de SQLAlchemy en JSON: usa
    `model_dump()`, `.dict()` o Pydantic antes de devolver.
- Sin validación de input (usar Pydantic siempre).
  - Si no defines `BaseModel`, cualquier JSON entra y los errores aparecen más
    tarde como `500` en lugar de `422` limpio.

## Conceptos clave

| Concepto | Qué es |
|----------|--------|
| **venv** | Entorno Python aislado por proyecto (`.venv/`) |
| **FastAPI** | Framework web async que convierte funciones Python en endpoints |
| **Uvicorn** | Servidor ASGI que ejecuta FastAPI (`uvicorn main:app --reload`) |
| **Pydantic** | Modelos que validan y serializan el JSON (error `422` automático) |
| **CORS** | Lista blanca de orígenes que el navegador exige para llamadas cross-origin |
| **Swagger (`/docs`)** | Docs interactivas generadas automáticamente |
| **`APIRouter`** | División de rutas por recurso al crecer el proyecto |

## Autoevaluación

**1. ¿Qué dos comandos hacen falta para arrancar una API FastAPI desde cero?**

<details>
<summary>Respuesta</summary>

Tras crear el venv e instalar (`pip install fastapi "uvicorn[standard]"`):

```bash
uvicorn main:app --reload
```

Y antes, en cada terminal nueva, activar el entorno
(`source .venv/bin/activate` o `.venv\Scripts\activate`).

</details>

**2. El frontend en Vite da error de CORS. ¿Qué añades en el backend?**

<details>
<summary>Respuesta</summary>

El middleware `CORSMiddleware` con el origen exacto del frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

</details>

**3. ¿Qué gana tu API al modelar el body con Pydantic (`PostIn`)?**

<details>
<summary>Respuesta</summary>

Validación automática: campos obligatorios, tipos y valores se comprueban antes
de entrar en tu función, devolviendo `422` con detalle si algo falla, y
serialización limpia con `model_dump()`. Sin Pydantic, cualquier JSON entra y los
errores acaban en `500`.

</details>

**4. ¿Qué URL abres para probar los endpoints sin escribir frontend?**

<details>
<summary>Respuesta</summary>

**http://localhost:8000/docs** (Swagger UI); también está `/redoc` para la
documentación en lectura. Ambas se generan solas a partir de tus rutas y modelos.

</details>
