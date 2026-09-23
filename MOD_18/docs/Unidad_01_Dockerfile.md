# Unidad 01 — Dockerfile

## Objetivos

- Entender qué es una **imagen** y qué es un **contenedor** (y por qué no es lo mismo).
- Escribir tu primer `Dockerfile` multi-stage para una app React/Vite.
- Saber por qué el **orden de las instrucciones** importa (cache de capas).
- Evitar los errores que producen imágenes gigantes o inseguras.

## Requisitos

- React y `npm run build` vistos en módulos anteriores.
- Git básico.
- Docker Desktop instalado y en marcha (lo necesitas solo para la práctica).

---

## Mentalidad

Antes de escribir una sola línea, fija estos dos conceptos con una analogía de cocina:

- **Imagen** = receta inmutable (capas de filesystem). Es una plantilla cerrada: contiene el código, el runtime (Node, Nginx…), las dependencias y la configuración. Nadie la "edita" en caliente; si quieres cambiarla, la vuelves a construir.
- **Contenedor** = instancia en ejecución. Es esa receta *cocinada*: puedes tener diez contenedores corriendo a la vez a partir de la misma imagen, como diez platos servidos desde la misma receta. Si borras el contenedor, la imagen sigue ahí.

Otras analogías útiles:

| Concepto | Analogía | En la práctica |
|----------|----------|----------------|
| Imagen | Molde de pastel | `docker build -t mi-frontend:1.0 .` |
| Contenedor | El pastel horneado | `docker run -p 8080:80 mi-frontend:1.0` |
| Capa (layer) | Ingredientes apilados en orden | Cada `RUN`/`COPY` deja una capa cacheada |
| Dockerfile | La receta escrita | Archivo de texto en la raíz del proyecto |
| Registry (Docker Hub) | Libro de recetas en la nube | `docker push usuario/mi-frontend` |

---

## Node/Vite multi-stage

Un **multi-stage** (varias etapas) construye tu app en una etapa "pesada" con todo el toolchain de Node, y luego copia **solo el resultado final** (`dist/`) a una imagen ligera con Nginx. Así el runtime no arrastra `node_modules` de desarrollo, npm ni el código fuente.

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

Línea a línea:

1. `FROM node:22-alpine AS build` — primera etapa: Node 22 sobre Alpine (imagen base mínima), con el alias `build`.
2. `WORKDIR /app` — fija el directorio de trabajo (como un `cd` permanente).
3. `COPY package*.json .` — trae solo los manifiestos de dependencias *antes* que el código: así la capa de `npm ci` se cachea mientras no cambien tus dependencias.
4. `RUN npm ci` — instala dependencias de forma limpia y reproducible (usa el lockfile).
5. `COPY . .` — ahora sí, copia el resto del proyecto.
6. `RUN npm run build` — genera `dist/`.
7. `FROM nginx:alpine` — segunda etapa: imagen fresja y pequeña, solo con Nginx.
8. `COPY --from=build /app/dist ...` — copia el resultado **desde la etapa anterior**; todo lo demás (node_modules, fuentes) queda descartado.
9. `EXPOSE 80` / `CMD [...]` — documenta el puerto y arranca Nginx en primer plano.

---

## Buenas prácticas

- Base **alpine** / slim: menos tamaño, menos superficie de ataque.
- **Multi-stage**: el runtime no lleva toolchain ni `node_modules` de dev.
- `.dockerignore`: `node_modules`, `.git`, `dist`, `.env*`. (Igual que `.gitignore`, pero para el "contexto de build": si no lo pones, esas carpetas viajan al demonio de Docker en cada build.)
- Orden de capas: copiar manifest **antes** de fuentes → cache de `npm ci`.
- No correr como root en prod (`USER node`).
- Un proceso por contenedor: Nginx en uno, la API en otro; no metas dos servicios en la misma caja.

---

## Comandos

```bash
docker build -t mi-frontend:1.0 .
docker run --rm -p 8080:80 mi-frontend:1.0
docker image prune -f
```

- `docker build -t nombre:tag .` — construye la imagen desde el `Dockerfile` del directorio actual (`.`). El `tag` (`:1.0`) es tu etiqueta de versión.
- `docker run --rm -p 8080:80 ...` — crea y arranca un contenedor; `-p 8080:80` mapea el puerto 8080 de tu máquina al 80 del contenedor; `--rm` lo borra al pararse (no acumulas contenedores viejos).
- `docker image prune -f` — borra imágenes colgando para liberar disco.

---

## Errores comunes

- `COPY . .` antes de `npm ci` → invalida cache siempre. Si copias *todo* el código y luego instalas dependencias, cualquier cambio en cualquier archivo (incluso un README) fuerza una reinstalación completa. Copia primero `package*.json`, instala, y solo después copia el código.
- Olvidar `.dockerignore` → imágenes gigantes. Sin él, tu `node_modules` local (cientos de MB) y tu `.git` viajan en el contexto de build.
- Exponer secrets con `ARG`/`ENV` de build (no hacerlo). Un `ENV AWS_SECRET=...` queda **grabado en las capas de la imagen**: cualquiera que la descubra puede leerlo con `docker history`. Pasa los secretos en tiempo de ejecución, nunca de build.

---

## Conceptos clave

| Término | Definición corta |
|---------|------------------|
| Imagen | Plantilla inmutable, en capas, con la que creas contenedores |
| Contenedor | Instancia aislada en ejecución de una imagen |
| Dockerfile | Archivo de instrucciones que produce una imagen |
| Capa / layer | Caché de cada instrucción; se reutiliza si nada anterior cambió |
| Multi-stage | Varios `FROM`: construyes en una etapa, copias el resultado a otra |
| `.dockerignore` | Exclusiones del contexto de build |
| Tag | Etiqueta (`:1.0`, `:latest`) de una imagen |
| Puerto (`-p host:cont`) | Puente entre tu máquina y el contenedor |

---

## Autoevaluación

1. ¿Cuál es la diferencia entre una imagen y un contenedor?

<details>
<summary>Respuesta</summary>

La **imagen** es la receta/molde inmutable en capas; el **contenedor** es una instancia en ejecución de esa imagen. De una imagen pueden salir muchos contenedores; borrar un contenedor no borra la imagen.
</details>

2. ¿Por qué copiamos `package*.json` antes que el resto del código?

<details>
<summary>Respuesta</summary>

Para que la capa `RUN npm ci` quede cacheada mientras no cambien las dependencias. Docker solo recalcula una capa y las posteriores si algo anterior cambió; así los cambios en tu código no obligan a reinstalar node_modules cada build.
</details>

3. ¿Qué aporta el multi-stage en una app Vite?

<details>
<summary>Respuesta</summary>

Que la imagen final solo recibe `dist/` dentro de `nginx:alpine`: sin Node, sin npm, sin `node_modules` de desarrollo ni código fuente. Menos tamaño, menos riesgo de seguridad y arranque más rápido.
</details>

4. ¿Dónde NO debes poner un secreto (token, clave AWS…)?

<details>
<summary>Respuesta</summary>

Nunca en `ENV`/`ARG` del Dockerfile ni en el código que se copia a la imagen: queda en las capas y es extraíble. Tampoco en el repositorio. Se inyectan en tiempo de ejecución (`-e`, `env_file` o secretos del orquestador).
</details>
