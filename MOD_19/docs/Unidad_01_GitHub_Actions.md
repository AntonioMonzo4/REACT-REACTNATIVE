# Unidad 01 — GitHub Actions

## Objetivos

- Entender el modelo mental de GitHub Actions: workflow, event, job, step.
- Escribir (y leer) un workflow de CI que ejecute lint, tests y build en cada push/PR.
- Conocer qué son los secrets y por qué jamás se loguean.
- Detectar los errores típicos que rompen la primera corrida del CI.

## Requisitos

- Git básico: `add`, `commit`, `push`, idea de qué es un Pull Request.
- Un proyecto React/TS con `lint`, `test` y `build` en el `package.json`.
- (Opcional) Docker visto en el Módulo 18: no hace falta aquí, pero encaja en el mismo "pipeline mental".

---

## Estructura

La analogía: el **workflow** es el obrador automático, un **job** es un obrero (máquina virtual) y un **step** es la tarea concreta que ese obrero ejecuta. El archivo vive en `.github/workflows/*.yml`; GitHub lo detecta solo.

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test:run
      - run: pnpm build
```

Lectura línea a línea:

1. `name: CI` — nombre que verás en la pestaña Actions.
2. `on:` — los **eventos** que disparan el workflow: cada `push` a `main` y cada `pull_request`.
3. `jobs.build` — un trabajo llamado `build`.
4. `runs-on: ubuntu-latest` — el obrero corre en una máquina virtual Ubuntu limpia de GitHub (no en tu portátil).
5. `actions/checkout@v4` — clona tu repo dentro de esa VM.
6. `actions/setup-node@v4` — instala Node 22 y activa la caché del package manager.
7. `corepack enable` — habilita pnpm/yarn modernos que trae Node.
8. `pnpm install --frozen-lockfile` — instala dependencias **exactamente** como el lockfile; si alguien cambió dependencias sin actualizar el lock, el CI falla en lugar de instalar versiones distintas a las tuyas.
9. `lint` → `test:run` → `build` — la misma triada que ejecutarías en local, ahora automáticamente en cada push.

---

## Conceptos

| Elemento | Rol |
|----------|-----|
| **Workflow** | archivo en `.github/workflows/` |
| **Event** | `push`, `pull_request`, `schedule`, `workflow_dispatch` |
| **Job** | runner (`ubuntu-latest`, `windows-latest`); paralelo por defecto |
| **Step** | `uses:` action o `run:` shell |
| **Artifact** | sube `dist/` entre jobs |
| **Secret** | `secrets.TOKEN` en Settings → Secrets |

Detalle de cada uno:

- **Workflow**: el documento completo; puede contener varios jobs.
- **Event**: qué dispara la ejecución. Además de `push` y `pull_request`:
  - `schedule` (cron, p. ej. tests nocturnos),
  - `workflow_dispatch` (botón "Run workflow" manual en la UI).
- **Job**: contenedor de steps que corre en su propia VM. Varios jobs **en paralelo** por defecto; si necesitan orden se usa `needs: nombre_job`.
- **Step**:
  - `uses:` reutiliza una action pública ya empaquetada (`checkout`, `setup-node`…),
  - `run:` ejecuta comandos de shell tal cual.
- **Artifact**: archivo generado (p. ej. `dist/`) que se sube para que otro job o el humano lo descargue.
- **Secret**: valor cifrado que guardas en *Settings → Secrets and variables → Actions* y lees como `${{ secrets.NOMBRE }}`. Para el CI de deploy (token de Vercel, etc.).

---

## Patrón release (tag)

A veces no quieres desplegar en cada push, sino cuando creas una **etiqueta de versión** (`v1.2.3`):

```yaml
on:
  push:
    tags: ['v*']
```

El patrón `v*` coincide con cualquier tag que empiece por `v`. Es la base de un flujo "etiqueta → build de release → publicación".

---

## Errores comunes

- Lockfile distinto vs CI (`--frozen-lockfile` falla).
  - Cambiaste dependencias en local y no commiteaste `pnpm-lock.yaml`/`package-lock.json`. Solución: sube el lockfile; nunca edites dependencias solo en la nube.
- Secrets logueados accidentalmente.
  - Un `echo ${{ secrets.TOKEN }}` o un debug verbose puede filtrar el valor. GitHub intenta enmascararlos, pero no te fíes: no imprimas secretos.
- Usar `master` cuando la rama es `main`.
  - El workflow nunca se dispara y piensas que "no funciona Actions". Revisa la rama real del repo.
- Olvidar `permissions:` mínimo (principio de menor privilegio).
  - Por defecto un token puede hacer más de lo que necesitas. Declara solo lo imprescindible, p. ej.:

  ```yaml
  permissions:
    contents: read
  ```

---

## Conceptos clave

| Término | Definición corta |
|---------|------------------|
| Workflow | Archivo YAML en `.github/workflows/` que define la automatización |
| Event (`on`) | Disparador: `push`, `pull_request`, `schedule`, `workflow_dispatch`, `tags` |
| Job | Obrero/VM que agrupa steps; paralelo por defecto, `needs:` para orden |
| Step | `uses:` (action) o `run:` (shell) dentro de un job |
| Runner | Máquina donde corre el job (`ubuntu-latest`, `windows-latest`…) |
| Action | Paquete reutilizable (`actions/checkout@v4`) |
| Artifact | Fichero compartido entre jobs o para descarga manual |
| Secret | Valor cifrado en Settings → Actions, leído con `${{ secrets.X }}` |
| `--frozen-lockfile` | Instala exactamente el lockfile; falla si está desactualizado |

---

## Autoevaluación

1. Con la analogía del obrador: ¿qué es un workflow, un job y un step?

<details>
<summary>Respuesta</summary>

El **workflow** es el obrador completo (el archivo que define todo). Un **job** es un obrero/máquina que ejecuta una unidad de trabajo (corre en su propia VM). Un **step** es la tarea concreta de ese obrero: una acción (`uses:`) o un comando (`run:`).
</details>

2. Mi CI falla siempre en `pnpm install --frozen-lockfile`. ¿Qué reviso?

<details>
<summary>Respuesta</summary>

Que el lockfile commiteado coincida con `package.json`. Si añadiste o cambiaste dependencias sin regenerar/subir el lock, `--frozen-lockfile` falla a propósito para evitar que el CI instale versiones distintas a las de tu equipo.
</details>

3. ¿Cómo hago para que un job B solo empiece cuando termine bien el job A?

<details>
<summary>Respuesta</summary>

Con `needs: a` en el job B. Por defecto los jobs corren en paralelo; `needs` establece la dependencia de orden.
</details>

4. ¿Dónde guardo el token de Vercel y cómo lo uso en el YAML?

<details>
<summary>Respuesta</summary>

En *Settings → Secrets and variables → Actions* de GitHub (nunca en el repo), y en el workflow como `${{ secrets.VERCEL_TOKEN }}`.
</details>
