# Unidad 01 — Dockerfile

## Mentalidad

**Imagen** = receta inmutable (capas de filesystem). **Contenedor** = instancia en ejecución.

## Node/Vite multi-stage

```dockerfile
# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime (solo dist) ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Buenas prácticas

- Base **alpine** / slim.
- **Multi-stage**: el runtime no lleva toolchain ni `node_modules` de dev.
- `.dockerignore`: `node_modules`, `.git`, `dist`, `.env*`.
- Orden de capas: copiar manifest **antes** de fuentes → cache de `npm ci`.
- No correr como root en prod (`USER node`).
- Un proceso por contenedor.

## Comandos

```bash
docker build -t mi-frontend:1.0 .
docker run --rm -p 8080:80 mi-frontend:1.0
docker image prune -f
```

## Errores comunes

- `COPY . .` antes de `npm ci` → invalida cache siempre.
- Olvidar `.dockerignore` → imágenes gigantes.
- Exponer secrets con `ARG`/`ENV` de build (no hacerlo).
