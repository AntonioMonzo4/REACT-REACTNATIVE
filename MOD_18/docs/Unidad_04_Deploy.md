# Unidad 04 — Deploy

## Opciones para un frontend React/Vite

| Plataforma | Imagen propia | Estático | Notas |
|------------|---------------|----------|-------|
| **Vercel / Netlify** | no hace falta | ✅ | `npm run build` → `dist` |
| **VPS + Nginx** | ✅ | ✅ | control total, tú pones TLS |
| **Docker + registry** | ✅ | ✅ | ideal con backend en compose |
| **Kubernetes / Cloud Run** | ✅ | ✅ | más complejo, escalable |

## Nginx estático (SPA)

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  location / {
    try_files $uri $uri/ /index.html;   # rutas React Router
  }
}
```

## Pipeline mental (docker)

```text
build imagen → tag semver → push registry → pull en servidor → docker compose up -d
```

```bash
docker tag mi-frontend:1.0 registry.example.com/mi-frontend:1.0
docker push registry.example.com/mi-frontend:1.0
```

## Checklist antes de prod

- [ ] Build optimizado (`vite build`, gzip/brotli en servidor)
- [ ] Env vars de runtime, no secrets en imagen
- [ ] Healthcheck y logs
- [ ] HTTPS (Let's Encrypt / plataforma)
- [ ] Backup y plan de rollback (`previous tag`)
