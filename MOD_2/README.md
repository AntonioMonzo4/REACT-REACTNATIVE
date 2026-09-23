# Módulo 2 — Node.js para Frontend

Material del **Módulo 2** del roadmap (Node.js, runtime, Event Loop y npm).

## Para quién es este módulo

**Alumnos que empiezan de cero.** No hace falta haber tocado Node antes.  
Solo necesitas saber abrir una terminal y tener Node instalado (`node -v` y `npm -v` deben responder).

## Cómo estudiar (orden recomendado)

Sigue las unidades **en orden**: cada una usa ideas de la anterior.

| Fase | Unidades | Qué saldrás sabiendo |
|------|----------|----------------------|
| **1. Qué es Node** | 01 → 04 | Qué es Node, runtime, motor V8 y piezas internas (sin profundizar aún) |
| **2. Cómo piensa Node** | 05 → 07 | Event Loop, diferencias con el navegador, casos de uso reales |
| **3. Gestor de paquetes** | 08 → 14 | npm, `package.json`, dependencias, scripts, lock files, SemVer |
| **4. Herramientas diarias** | 15 → 16 | `npx` y `pnpm` (lo usarás en todos los ejemplos del curso) |

> **Consejo:** tras cada unidad, responde a los “Conceptos clave” y a los ejercicios/autoevaluación sin mirar. Si fallas, relee solo esa sección.

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — ¿Qué es Node.js?](docs/Unidad_01_Que_es_Node_js.md) | Historia, qué es / no es, por qué React necesita Node, `node -v` |
| [02 — ¿Qué es un Runtime?](docs/Unidad_02_Que_es_Runtime.md) | Entorno de ejecución, APIs de runtime, analogía del traductor |
| [03 — ¿Qué es un Motor?](docs/Unidad_03_Que_es_Motor.md) | Motor de JavaScript (V8), JIT, parser → bytecode → CPU |
| [04 — ¿Qué es una Arquitectura?](docs/Unidad_04_Que_es_Arquitectura.md) | V8 + libuv + hilo único, delegación de I/O |
| [05 — El Event Loop](docs/Unidad_05_Event_Loop.md) | Call Stack, colas, microtasks, fases del ciclo |
| [06 — Node.js vs Navegador](docs/Unidad_06_Node_vs_Navegador.md) | APIs de cada entorno, por qué `document` falla en Node |
| [07 — Casos de uso](docs/Unidad_07_Casos_de_uso.md) | CLI, servidores, tooling, SSR; cuándo **no** usar Node |
| [08 — npm](docs/Unidad_08_npm.md) | Historia, registry, primeros comandos |
| [09 — package.json](docs/Unidad_09_package_json.md) | Manifest del proyecto, campos principales |
| [10 — Dependencias](docs/Unidad_10_Dependencias.md) | deps vs devDeps, peer/optional, engines, exports |
| [11 — Scripts](docs/Unidad_11_Scripts.md) | `scripts` de npm/pnpm, `.bin`, encadenado |
| [12 — node_modules](docs/Unidad_12_node_modules.md) | Instalación, árbol de paquetes, resolución de módulos |
| [13 — Lock Files](docs/Unidad_13_Lock_Files.md) | Reproducibilidad, `package-lock.json` / `pnpm-lock.yaml` |
| [14 — SemVer](docs/Unidad_14_SemVer.md) | MAJOR.MINOR.PATCH, `^` y `~` |
| [15 — npx](docs/Unidad_15_npx.md) | Ejecutar paquetes sin instalarlos |
| [16 — pnpm](docs/Unidad_16_pnpm.md) | Store, hard links, velocidad, monorepos |

## Práctica mínima del módulo

```bash
node -v
npm -v

mkdir mi-prueba && cd mi-prueba
npm init -y
npm install axios
# revisa package.json y node_modules/
npx cowsay Hola   # opcional: npx en acción
```

## Mapa con el README

- [x] ¿Qué es Node.js? / Runtime / Motor / Arquitectura
- [x] Event Loop
- [x] Node.js vs Navegador
- [x] Casos de uso de Node.js
- [x] npm / package.json / dependencias / scripts
- [x] node_modules / lock files / SemVer
- [x] npx / pnpm
- [ ] Backend con Node (M17) — *pendiente*
