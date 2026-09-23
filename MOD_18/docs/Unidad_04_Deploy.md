# Unidad 04 — Deploy

## Objetivos

- Comparar las plataformas de despliegue habituales para un frontend React/Vite.
- Configurar Nginx para servir una SPA con rutas de React Router.
- Entender el flujo mental de publicar una imagen en un registry y levantarla en el servidor.
- Pasar el checklist de producción antes de dar el "botón rojo".

## Requisitos

- Unidades 01–03 (Dockerfile, Compose, env/volúmenes).
- Saber qué hace `npm run build` y qué es `dist/`.

---

## Opciones para un frontend React/Vite

Tu app Vite genera archivos estáticos (`dist/`). Desplegar es decidir **quién** los sirve por HTTP y cómo actualizas la versión:

| Plataforma | Imagen propia | Estático | Notas |
|------------|---------------|----------|-------|
| **Vercel / Netlify** | no hace falta | ✅ | `npm run build` → `dist` |
| **VPS + Nginx** | ✅ | ✅ | control total, tú pones TLS |
| **Docker + registry** | ✅ | ✅ | ideal con backend en compose |
| **Kubernetes / Cloud Run** | ✅ | ✅ | más complejo, escalable |

- **Vercel / Netlify**: no tocas servidores; conectas el repo, ellos hacen build y sirven `dist`. Ideal para empezar (se detallan en el Módulo 19).
- **VPS + Nginx**: alquilas un servidor y tú configuras Nginx y el certificado TLS (Let's Encrypt). Control absoluto, responsabilidad también tuya.
- **Docker + registry**: construyes tu imagen, la subes a un registro (Docker Hub, GHCR…) y el servidor la descarga. Perfecto cuando frontend y backend viajan juntos en Compose.
- **Kubernetes / Cloud Run**: orquestación para escalar muchas réplicas; potente pero con curva de aprendizaje alta.

---

## Nginx estático (SPA)

React Router maneja las rutas en el navegador (`/perfil`, `/settings`), pero Nginx, si no le dices nada, responderá **404** al recargar `https://tudominio.com/perfil` porque ese fichero no existe en disco. La directiva `try_files` dice: *"si no existe el fichero, devuelve siempre `index.html` y deja que React haga su routing"*.

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  location / {
    try_files $uri $uri/ /index.html;   # rutas React Router
  }
}
```

Con `COPY --from=build /app/dist /usr/share/nginx/html` (Unidad 01) y este bloque, tienes tu SPA servida por Nginx dentro del contenedor. Es el mismo principio que verás como redirect `/* → /index.html` en Netlify y `rewrites` en Firebase.

---

## Pipeline mental (docker)

El recorrido completo de una imagen desde tu portátil hasta producción:

```text
build imagen → tag semver → push registry → pull en servidor → docker compose up -d
```

```bash
docker tag mi-frontend:1.0 registry.example.com/mi-frontend:1.0
docker push registry.example.com/mi-frontend:1.0
```

1. **build imagen** — `docker build -t mi-frontend:1.0 .`
2. **tag semver** — `docker tag` añade una segunda etiqueta apuntando al registry donde la subirás. Usa versión (`1.0`), no solo `latest`, para poder volver atrás.
3. **push registry** — sube la imagen a la nube (Docker Hub, GHCR, ECR…).
4. **pull en servidor** — el servidor la descarga: `docker pull registry.example.com/mi-frontend:1.0`.
5. **`docker compose up -d`** — levanta el stack con la nueva versión, en segundo plano.

Como el paso 3–5 es mecánico, en serio se automatiza con un pipeline CI/CD (Módulo 19).

---

## Checklist antes de prod

- [ ] Build optimizado (`vite build`, gzip/brotli en servidor)
- [ ] Env vars de runtime, no secrets en imagen
- [ ] Healthcheck y logs
- [ ] HTTPS (Let's Encrypt / plataforma)
- [ ] Backup y plan de rollback (`previous tag`)

---

## Errores comunes

- Recargar `/perfil` y recibir 404 → falta el `try_files ... /index.html` de Nginx (o el redirect equivalente en Vercel/Netlify/Firebase).
- Desplegar siempre `:latest` → no sabes qué corre ni puedes hacer rollback rápido. Usa tags semver.
- Secrets dentro de la imagen (`ENV`/`ARG`) → visibles con `docker history`; inyéctalos en runtime.
- Sin plan de rollback → si la nueva versión falla, no sabes a qué tag volver. Ten el `previous tag` listo y probado.
- Sin backup de la BD → el mejor deploy del mundo no salva datos perdidos. Programa backups del volumen **antes** de tocar prod.

---

## Conceptos clave

| Término | Definición corta |
|---------|------------------|
| Deploy | Poner tu app disponible en un entorno accesible (normalmente producción) |
| SPA | Single Page App: todo el routing lo hace React en el cliente |
| `try_files` | Fallback de Nginx a `index.html` para rutas de React Router |
| Registry | Almacén de imágenes (Docker Hub, GHCR, ECR…) |
| `docker tag` / `push` / `pull` | Etiquetar, subir y bajar imágenes |
| Semver (`1.2.3`) | Etiqueta de versión que permite rollback explícito |
| Rollback | Volver a la versión anterior ante un fallo |

---

## Autoevaluación

1. He desplegado la SPA pero al entrar en `/dashboard` y recargar la página aparece un 404. ¿Por qué y cómo lo arreglas?

<details>
<summary>Respuesta</summary>

Nginx busca el fichero `/dashboard`, que no existe (las rutas las maneja React Router en el cliente). Se arregla con `try_files $uri $uri/ /index.html;` (o el redirect/rewrite equivalente en Netlify/Firebase) para que siempre se sirva `index.html`.
</details>

2. Explica con tus palabras el "pipeline mental" de Docker hasta producción.

<details>
<summary>Respuesta</summary>

Construyes la imagen (`build`), le pones una etiqueta de versión (`tag semver`), la subes al registry (`push`), el servidor la baja (`pull`) y levanta el stack (`docker compose up -d`). En CI/CD estos pasos se automatizan.
</details>

3. ¿Por qué tag semver y no `latest`?

<details>
<summary>Respuesta</summary>

`latest` es móvil y no te dice qué versión corre realmente; con semver (`1.2.3`) sabes exactamente qué hay desplegado y puedes hacer rollback rápido a la etiqueta anterior.
</details>

4. Menciona dos cosas del checklist de producción y por qué importan.

<details>
<summary>Respuesta</summary>

Ej.: **env vars de runtime, no secrets en imagen** (los secretos en `ENV` quedan extraíbles de las capas) y **backup + plan de rollback** (si sale mal la nueva versión, vuelves al `previous tag`, y si hay incidente de datos, el backup te salva). También: build optimizado, healthcheck/logs y HTTPS.
</details>
