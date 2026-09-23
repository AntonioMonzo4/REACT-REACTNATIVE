# Unidad 02 — Docker Compose

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

```bash
docker compose up --build
docker compose down          # + -v si quieres borrar volúmenes
docker compose logs -f api
```

- **Red por defecto**: hostnames por nombre de servicio (`db`, `api`).
- `depends_on` + `healthcheck` para orden real.
