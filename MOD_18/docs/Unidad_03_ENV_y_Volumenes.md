# Unidad 03 — Variables de entorno y volúmenes

## Objetivos

- Saber **dónde** se define una variable de entorno según el contexto (dev, Compose, runtime, build de Vite).
- Entender por qué `VITE_*` **nunca** debe llevar secretos.
- Diferenciar **named volumes**, **bind mounts** y **tmpfs**, y cuándo usar cada uno.
- Conocer las reglas de datos en producción (backups, inmutabilidad).

## Requisitos

- Unidades 01–02 (Dockerfile y Compose).
- Saber lo que es un `.env` y el `.gitignore`.

---

## Variables de entorno

Las **variables de entorno** (env vars) son pares `CLAVE=valor` que tu proceso lee en ejecución. Permiten que **el mismo código** funcione en local, staging y producción sin editar archivos: solo cambian los valores.

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

Cómo se lee cada opción:

- **`ENV` en el Dockerfile** — valor por defecto grabado en la imagen. Bien para flags fijos (`NODE_ENV=production`); mal para secretos (quedan en las capas).
- **`environment:` en Compose** — valor declarado en el YAML, bueno para config del stack.
- **`env_file:`** — Compose lee un archivo `.env` entero y lo inyecta; cómodo para no pegar valores en el repo.
- **`docker run -e KEY=v`** — inyección puntual en el momento de arrancar el contenedor; en orquestadores (K8s, etc.) se usa el sistema de **secretos**.

Reglas:

1. `.env` en `.gitignore`; `.env.example` commiteado.
   - El `.env` real (con tus claves) **nunca** sube a git.
   - El `.env.example` es la plantilla pública: solo los *nombres* de las variables, con valores vacíos o de ejemplo, para que otra persona sepa qué rellenar.
2. Nunca `ENV AWS_SECRET=...` en Dockerfile de imagen pública.
3. `NEXT_PUBLIC_*` / `VITE_*` = visibles en el cliente → solo públicos.
   - En Vite, cualquier variable que empiece por `VITE_` se **sustituye en tiempo de build** dentro del JS que baja al navegador. Cualquiera con las DevTools puede verla. Sirve para URLs públicas o flags, jamás para tokens privados.

---

## Volúmenes

Un **volumen** es almacenamiento que vive **fuera** del ciclo de vida del contenedor. Sin volúmenes, si borras el contenedor de tu base de datos, borras también todos los datos. Es la diferencia entre escribir en la pizarra del contenedor (se borra con él) y escribir en un cuaderno aparte (sobrevive).

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

- **Named volume** (`pgdata:/var/lib/postgresql/data`): lo gestiona Docker en su propio directorio. Ideal para datos de producción (BD, uploads). `docker volume ls` los lista; el nombre real suele ir prefijado por el proyecto (`proyecto_pgdata`), por eso el `rm` de ejemplo.
- **Bind mount** (`./src:/app/src`): enlaza una carpeta de **tu máquina** dentro del contenedor. Como el contenedor ve tus ficheros en vivo, el hot-reload de Vite funciona: guardas, y el contenedor ya tiene el cambio. Solo en desarrollo; en producción no montes el código fuente.
- **tmpfs**: almacenamiento en memoria, se borra al parar el contenedor. Para datos temporales que no deben tocar disco.

---

## Datos en prod

- Backups del volumen de DB.
- No montar el código fuente en prod.
- Immutabilidad: etiquetas `:1.2.3`, no solo `:latest`.

---

## Errores comunes

- Subir `.env` a git "porque es solo local" → las claves quedan para siempre en el historial del repo. Añádelo a `.gitignore` desde el minuto uno; si ya subiste, rota las claves y corrige el historial.
- Poner un token en `VITE_API_TOKEN` → queda embebido en el bundle JS público. Si la variable empieza por `VITE_`, asume que es **pública**.
- Esperar que los datos sobrevivan a `docker compose down -v` → `-v` borra los volúmenes; sin `-v` sí persisten.
- Usar bind mounts en producción → montas tu código fuente sobre la imagen (puede enmascarar el build correcto) y pierdes inmutabilidad.
- Etiquetar todo como `:latest` → no puedes saber qué versión corre ni hacer rollback; usa semver (`:1.2.3`).

---

## Conceptos clave

| Término | Definición corta |
|---------|------------------|
| Variable de entorno | `CLAVE=valor` inyectada al proceso, separa config del código |
| `.env` / `.env.example` | Archivo real (oculto en git) / plantilla pública commiteada |
| Prefijo `VITE_*` | Se embebe en el bundle en build → solo datos públicos |
| Named volume | Almacenamiento nombrado gestionado por Docker, sobrevive `down` |
| Bind mount | Enlace carpeta host ↔ contenedor (hot-reload en dev) |
| tmpfs | Almacenamiento en memoria, efímero |
| Inmutabilidad | La imagen desplegada no se edita; se reconstruye con nueva tag |

---

## Autoevaluación

1. ¿Por qué `VITE_*` no puede llevar secretos?

<details>
<summary>Respuesta</summary>

Porque Vite las sustituye en tiempo de build y quedan embebidas en el JavaScript del bundle que el navegador descarga. Cualquiera puede verlas con las DevTools, así que solo sirven para datos públicos (URLs, flags).
</details>

2. Mi base de datos corre en un contenedor. ¿Qué tipo de volumen uso para que los datos no se pierdan al reiniciar el stack?

<details>
<summary>Respuesta</summary>

Un **named volume** (p. ej. `pgdata:/var/lib/postgresql/data`). Los datos viven fuera del contenedor y sobreviven a `docker compose down` (⚠️ no a `down -v`).
</details>

3. Estoy desarrollando con Vite y quiero que al guardar un archivo se recargue el navegador dentro del contenedor. ¿Qué monto?

<details>
<summary>Respuesta</summary>

Un **bind mount** de tu código al directorio de trabajo del contenedor (p. ej. `./src:/app/src`), en un override de desarrollo (`compose.dev.yaml`). Así el contenedor ve tus cambios en vivo.
</details>

4. Tengo que configurar `DATABASE_URL` en local sin commitear credenciales. ¿Cómo lo hago?

<details>
<summary>Respuesta</summary>

Creo un `.env` real (en `.gitignore`) con la URL, lo referencio con `env_file: .env` en Compose, y commiteo solo un `.env.example` con los nombres de las variables y valores de ejemplo.
</details>
