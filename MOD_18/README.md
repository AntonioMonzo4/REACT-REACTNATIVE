# Módulo 18 — Docker

Material del **Módulo 18** del roadmap.

Docker es la herramienta que separa el clásico *"en mi máquina sí funciona"* de la realidad: empaquetas tu aplicación junto con todo lo que necesita (Node, Nginx, variables, versiones exactas) y esa misma "caja" corre igual en tu portátil, en el ordenador de un compañero y en el servidor de producción. En este módulo aprendes a construir esa caja desde cero, aunque nunca hayas oído hablar de contenedores.

## Para quién es este módulo

- Ya sabes **React** y haz hecho algún `npm run build`.
- Sabes **git básico** (clone, add, commit, push).
- **No necesitas** saber Docker todavía: se explica desde cero con analogías.
- Quieres poder desplegar tu frontend (y un stack con backend + base de datos) de forma repetible.
- Si nunca has tocado la terminal más allá de npm/git, no pasa nada: cada comando se explica.

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

## Cómo estudiar

| Fase | Qué haces | Resultado |
|------|-----------|-----------|
| **1 — Mentalidad** | Lee la Unidad 01 sin tocar nada: imagen = molde, contenedor = instancia | Entiendes la diferencia antes de escribir un Dockerfile |
| **2 — Primer build** | Sigue la *Práctica* de abajo con un ejemplo del curso | Ves tu React corriendo dentro de un contenedor |
| **3 — Stack completo** | Unidades 02 y 03: levanta web + api + db con Compose | Practicas red, healthchecks, env vars y volúmenes |
| **4 — Puesta en producción** | Unidad 04: Nginx SPA, tag, push al registry, checklist | Sabes el camino completo hasta prod y sus riesgos |

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

## Práctica mínima

Si solo puedes dedicar 30 minutos a este módulo, haz esto:

1. Instala Docker Desktop y comprueba que `docker --version` responde.
2. Copia `plantillas/Dockerfile.frontend` y `plantillas/nginx.conf` a un ejemplo React y ejecuta el `docker build` + `docker run` de arriba.
3. Abre `http://localhost:8080` y comprueba que tu app carga dentro del contenedor.
4. Valida el compose con `docker compose -f plantillas/compose.yaml config`.

Con eso ya has "contenerizado" algo real; el resto de unidades profundizan.

## Mapa con el README

- [x] Dockerfile
- [x] Docker Compose
- [x] Variables de entorno
- [x] Volúmenes
- [x] Deploy
- [ ] Ejecutar build real — *pendiente (requiere Docker local)*
