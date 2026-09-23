# Módulo 18 — Docker

Material del **Módulo 18** del roadmap.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — Dockerfile](docs/Unidad_01_Dockerfile.md) | Multi-stage Node, capas, `.dockerignore` |
| [02 — Docker Compose](docs/Unidad_02_Docker_Compose.md) | web + api + db, healthchecks |
| [03 — ENV y volúmenes](docs/Unidad_03_ENV_y_Volumenes.md) | env vars, named volumes |
| [04 — Deploy](docs/Unidad_04_Deploy.md) | Nginx SPA, registry, checklist |

### Plantillas

- [`plantillas/Dockerfile.frontend`](plantillas/Dockerfile.frontend) — Vite multi-stage → Nginx
- [`plantillas/compose.yaml`](plantillas/compose.yaml) — stack ejemplo
- [`plantillas/nginx.conf`](plantillas/nginx.conf) — SPA router

## Práctica (requiere Docker Desktop)

```bash
cd plantillas
# copia Dockerfile.frontend y nginx.conf a la raíz de un ejemplo (p. ej. MOD_4/EJEMPLO_REACT)
docker build -t curso-react:vite .
docker run --rm -p 8080:80 curso-react:vite
```

```bash
docker compose -f plantillas/compose.yaml config   # valida YAML sin levantar
```

## Mapa con el README

- [x] Dockerfile
- [x] Docker Compose
- [x] Variables de entorno
- [x] Volúmenes
- [x] Deploy
- [ ] Ejecutar build real — *pendiente (requiere Docker local)*
