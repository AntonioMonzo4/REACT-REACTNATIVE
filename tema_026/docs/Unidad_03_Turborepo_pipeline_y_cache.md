# Unidad 03 — Turborepo: pipeline y caché
> 🧭 **Navegación:** [← Anterior: Unidad 02 — pnpm workspaces](Unidad_02_pnpm_workspaces.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 04 — Packages compartidos y CI →](Unidad_04_Packages_compartidos_y_CI.md)

## Objetivos

Al terminar esta unidad podrás:

- Configurar `turbo.json` con un pipeline (`build`, `lint`, `check`).
- Entender la **dependencia topológica**: Turborepo construye `ui` antes que `web`.
- Aprovechar la **caché local** (y la remota en equipos) para acelerar el CI.
- Saber cuándo usar `--filter` de turbo y `--force` / `--dry-run`.

## Requisitos

- Unidades 01 y 02 (estructura del workspace ya montada).

## Instalación en la raíz

```bash
pnpm add -D turbo
```

```json
// package.json raíz
{
  "scripts": {
    "build": "turbo run build",
    "lint": "turbo run lint",
    "check": "turbo run check",
    "dev": "turbo run dev"
  }
}
```

## `turbo.json`: declarar el pipeline

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "check": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Significado de las claves clave:

| Clave | Qué hace |
|-------|----------|
| `dependsOn: ["^build"]` | Antes de buildar este paquete, builda **sus dependencias** (el `^` = dependencias del `package.json`) |
| `outputs: ["dist/**"]` | Qué carpetas guarda la caché para reutilizar en la próxima ejecución |
| `cache: false` + `persistent: true` | Para `dev`: nunca cachea, corre hasta que lo pares |

Con eso, `pnpm build` en la raíz ejecuta:

1. `build` de `@miorg/ui` (porque `web` depende de él).
2. `build` de `@miorg/web`.
3. Ambos en paralelo cuando es posible, respetando el grafo.

## La caché: la mitad del valor

```bash
pnpm build   # primera vez: ejecuta todo
pnpm build   # segunda vez: "cache miss, skipping" — milisegundos
```

Si tocas un archivo de `packages/ui`, Turborepo rebuilda `ui` **y** `web`
(como antes). Si solo tocas un `.tsx` de `web`, rebuilda solo `web`; `ui`
sale de caché.

Para verlo sin ejecutar:

```bash
pnbo exec turbo run build --dry-run
pnpm exec turbo run build --force   # ignora la caché (para depurar)
```

### Caché remota (equipos y CI)

En un equipo, la caché local de cada máquina no sirve al compañero. Turborepo
soporta caché remota (`TURBO_TOKEN` + `TURBO_TEAM`, con Vercel Remote Cache o
self-hosted). No es necesario para el ejemplo; conviene saber que existe cuando
el CI empieza a tardar demasiado.

## Ejemplos de día a día

```bash
# Solo la app, con sus dependencias
pnpm exec turbo run build --filter=@miorg/web

# Todo lo que depende de ui (sus "consumidores")
pnpm exec turbo run build --filter=...@miorg/ui

# check (tsc) de todos los paquetes
pnpm exec turbo run check
```

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Olvidar `dependsOn: ["^build"]` | web se compila antes que ui y falla el import | Añadir `"^build"` en la tarea `build` |
| No declarar `outputs` | Caché siempre miss | Apuntar a `dist/**` (o `build/**` según la tool) |
| `dev` con cache | El server se "repite" raro o no watcha | `"cache": false, "persistent": true` |

## Conceptos clave

- **Task/pipeline**: definición de qué scripts corre turbo y en qué orden.
- **`^build`**: dependencias primero (topología del grafo).
- **Outputs**: qué guarda la caché para reutilizar.
- **Caché remota**: comparte aciertos de cache entre máquinas y CI.

## Autoevaluación

<details>
<summary><b>1. ¿Qué hace `dependsOn: ["^build"]` exactamente?</b></summary>

Indica que, antes de ejecutar `build` del paquete actual, turbo debe ejecutar
`build` en todos los paquetes de los que este dependa (los del grafo de
`package.json`). Garantiza el orden ui → web.
</details>

<details>
<summary><b>2. ¿Por qué `dev` lleva `"persistent": true`?</b></summary>

Porque `vite dev` es un proceso que no termina: turbo debe saber que esa tarea
"nunca acaba" para no bloquear el resto del pipeline ni tratarla como una tarea
normal con fin.
</details>

<details>
<summary><b>3. Tocas solo CSS de `apps/web`. ¿Qué se rebuilda?</b></summary>

Solo `@miorg/web`. `@miorg/ui` no cambió, su hash de inputs es el mismo y sale
de caché — que es justo la aceleración que aporta Turborepo.
</details>

> 🧭 **Navegación:** [← Anterior: Unidad 02 — pnpm workspaces](Unidad_02_pnpm_workspaces.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 04 — Packages compartidos y CI →](Unidad_04_Packages_compartidos_y_CI.md)
