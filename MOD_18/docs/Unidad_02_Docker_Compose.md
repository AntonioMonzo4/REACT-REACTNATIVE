# Unidad 02 — Docker Compose

## Objetivos

- Entender qué resuelve Docker Compose frente a `docker run` suelto.
- Leer y escribir un `compose.yaml` con frontend + API + base de datos.
- Usar `depends_on` + `healthcheck` para que los servicios arranquen en el orden correcto.
- Manejar los comandos esenciales: `up`, `down`, `logs`.

## Requisitos

- Unidad 01 completada (saber qué es una imagen y un contenedor).
- Docker Desktop instalado.
- Un ejemplo de frontend (y opcionalmente backend) del curso.

---

## ¿Qué es Compose?

Cuando tu app es **solo** un frontend estático, te bastan `docker build` y `docker run`. Pero en cuanto hay backend y base de datos, tienes tres o cuatro contenedores que deben:

1. Arrancar en orden (la API no puede conectar si la BD aún no vive).
2. Comunicarse entre sí por nombre.
3. Compartir configuración y volúmenes.

**Docker Compose** es un archivo único (`compose.yaml`) que describe todo el stack y un mando que lo levanta con un comando. Piensa en él como la **partitura de una orquesta**: cada servicio es un músico, y `docker compose up` hace que toquen a la vez, en su sitio y sincronizados.

Conceptos clave:

- **Red por defecto**: Compose crea una red interna; los servicios se hablan por el **nombre del servicio** (`db`, `api`), no por `localhost`.
- **Servicio**: un contenedor (o réplicas) definido en el YAML.
- **Healthcheck**: un "test de vida" periódico que marca cuándo el servicio está realmente listo.

---

## `compose.yaml` típico (frontend + API)

```yaml
services:
  web:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - api

  api:
    build: ./backend
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  pgdata:
```

Recorrido del archivo:

- **`services:`** — lista los contenedores del stack.
  - `web`: se **construye** desde `./frontend` (ahí hay un Dockerfile) y publica el puerto `8080:80` (host:contenedor).
  - `api`: se construye desde `./backend` y recibe `DATABASE_URL`. Fíjate en que la host es **`db`**: el nombre del servicio en la red de Compose, no `localhost`.
  - `db`: en vez de construir, usa una imagen pública `postgres:16-alpine`, con sus variables de arranque, un **volumen** `pgdata` (los datos sobreviven al `down`) y un **healthcheck** que ejecuta `pg_isready` cada 5s.
- **`depends_on` con `condition: service_healthy`** — la API solo arranca cuando la BD responde "listo" al healthcheck, no simplemente cuando su contenedor exista. Sin esto, la API suele morir en el primer arranque porque la BD aún estaba inicializándose.
- **`volumes:` (raíz)** — declara el volumen con nombre `pgdata` usado por `db`.

---

## Comandos

```bash
docker compose up --build
docker compose down          # + -v si quieres borrar volúmenes
docker compose logs -f api
```

- `docker compose up --build` — construye las imágenes que tengan `build:` y levanta todo el stack en foreground (Ctrl+C lo para).
- `docker compose down` — para y borra los contenedores y la red; **los volúmenes con nombre se quedan** (tus datos persisten). Añade `-v` si de verdad quieres borrarlos (⚠️ destruye datos).
- `docker compose logs -f api` — sigue en vivo los logs de un servicio concreto: tu mejor amigo cuando algo no arranca.

Otros útiles: `docker compose ps` (estado), `docker compose restart api`, `docker compose up -d` (detached, en segundo plano).

---

- **Red por defecto**: hostnames por nombre de servicio (`db`, `api`).
- `depends_on` + `healthcheck` para orden real.

---

## Errores comunes

- Usar `localhost` dentro de otro servicio para llegar a la BD o a la API → no funciona: dentro de la red de Compose, cada servicio es un "host" distinto. Usa el **nombre del servicio** (`db:5432`, `api:3000`).
- Olvidar `condition: service_healthy` → la API arranca antes que la BD y crashea al conectar (clásico `ECONNREFUSED` en el primer `up`).
- Comillas en los puertos: `"8080:80"` debe ir entre comillas; sin ellas YAML puede interpretar los dos puntos de forma rara.
- Quejarse de "borré todo y desaparecieron los datos" → `docker compose down -v` borra los volúmenes; sin `-v` los datos de la BD persisten.
- Ejecutar `docker compose` en un directorio sin `compose.yaml` (o con otro nombre) → especifica `-f ruta/compose.yaml`.

---

## Conceptos clave

| Término | Definición corta |
|---------|------------------|
| `compose.yaml` | Archivo declarativo con todo el stack |
| Servicio | Contenedor definido en el YAML (`web`, `api`, `db`) |
| Red por defecto | Red interna donde los servicios se resuelven por nombre |
| `depends_on` | Orden de arranque (simple o con `condition`) |
| `healthcheck` | Test periódico que marca cuándo el servicio está listo |
| `environment` / `env_file` | Variables inyectadas al contenedor |
| Volumen con nombre | Almacenamiento que sobrevive al `down` |
| `docker compose logs` | Visor de logs por servicio |

---

## Autoevaluación

1. ¿Por qué la API usa `db` como host en `DATABASE_URL` en vez de `localhost`?

<details>
<summary>Respuesta</summary>

Porque Compose crea una red donde cada servicio es un host con el nombre del servicio. Desde dentro del contenedor `api`, `localhost` sería el propio `api`; para llegar a la base de datos debe hablar a `db`, el nombre del servicio.
</details>

2. ¿Qué diferencia hay entre `depends_on: [db]` y `depends_on: {db: {condition: service_healthy}}`?

<details>
<summary>Respuesta</summary>

El primero solo espera a que el contenedor de `db` *arranque* (exista). El segundo espera a que el **healthcheck** diga que está realmente listo para aceptar conexiones. Sin `service_healthy`, la API puede lanzarse mientras Postgres aún inicializa y fallar.
</details>

3. ¿Qué hace `docker compose down -v` de más respecto a `docker compose down`?

<details>
<summary>Respuesta</summary>

Borra también los volúmenes declarados (p. ej. `pgdata`), es decir, **elimina los datos** de la base de datos. `down` a secas los conserva.
</details>

4. Tengo tres servicios y quiero ver solo los logs de la API. ¿Qué comando uso?

<details>
<summary>Respuesta</summary>

`docker compose logs -f api` (el `-f` hace follow, se queda pegado a la salida como un tail en vivo).
</details>
