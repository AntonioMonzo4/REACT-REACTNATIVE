# Unidad 03 — Variables de entorno y volúmenes

## Variables

| Contexto | Cómo |
|----------|------|
| Dev local | `.env` + docker-compose `env_file:` |
| Compose | `environment:` o `env_file:` |
| Runtime contenedor | `docker run -e KEY=v` / orchestrator secrets |
| Vite build-time | `VITE_*` → **embebidas en el bundle** (¡no secrets!) |

```dockerfile
# runtime env (recomendado para config sensible en server)
ENV NODE_ENV=production
```

```yaml
services:
  api:
    env_file: .env
```

Reglas:

1. `.env` en `.gitignore`; `.env.example` commiteado.
2. Nunca `ENV AWS_SECRET=...` en Dockerfile de imagen pública.
3. `NEXT_PUBLIC_*` / `VITE_*` = visibles en el cliente → solo públicos.

## Volúmenes

| Tipo | Uso |
|------|-----|
| **named** (`pgdata:`) | datos que sobreviven `down` |
| **bind mount** (`./src:/app/src`) | dev hot-reload |
| tmpfs | datos efímeros |

```yaml
services:
  web:
    build: .
    volumes:
      - ./src:/app/src   # solo dev override (compose.dev.yaml)
```

```bash
docker volume ls
docker volume rm proyecto_pgdata
```

## Datos en prod

- Backups del volumen de DB.
- No montar el código fuente en prod.
- Immutabilidad: etiquetas `:1.2.3`, no solo `:latest`.
