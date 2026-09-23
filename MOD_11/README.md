# Módulo 11 — Arquitectura

Material del **Módulo 11** del roadmap (Atomic Design, Feature Based, Clean Architecture, modularización y DDD).

Si acabas de empezar a programar con React, este módulo es el paso que separa "sé crear componentes" de "sé organizar un proyecto real". Aquí no aprenderás APIs nuevas de React: aprenderás a **dónde poner cada archivo**, **por qué**, y **cómo evitar que tu código se convierta en un espagueti de 200 carpetas** que ni tú entiendes dentro de dos meses.

Piensa en la arquitectura como la distribución de una casa: no cambia el material de las paredes (los componentes), pero si la cocina está al lado del baño y no de la sala, cada día sufrirás. Igual pasa con tu `src/`.

## Para quién es este módulo

- Ya creaste al menos una app con Vite + React y entiendes `useState`, props y componentes.
- Te sientes perdido cuando el proyecto crece: no sabes si crear `components/`, `utils/` o carpetas por pantalla.
- Quieres trabajar en equipo y que tus compañeros entiendan tu código sin pedirte un tour.
- Te preparas para entrevistas donde preguntan "¿cómo organizarías esta app?".
- **No** necesitas saber TypeScript ni backend; los ejemplos usan JavaScript y son autoexplicativos.

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Atomic Design](docs/Unidad_01_Atomic_Design.md) | Atoms → organisms → pages |
| [02 — Feature Based](docs/Unidad_02_Feature_Based.md) | Carpetas por dominio, fronteras con `index.js` |
| [03 — Clean Architecture](docs/Unidad_03_Clean_Architecture.md) | Capas, dependencias hacia dentro, hexagonal |
| [04 — Modularización](docs/Unidad_04_Modularizacion.md) | Contratos, límites con ESLint, tamaño de módulo |
| [05 — DDD](docs/Unidad_05_Introduccion_DDD.md) | Lenguaje unificado, aggregates, bounded contexts |

### Práctica (`EJEMPLO_ARQUITECTURA/`)

Vite + React con estructura mixta (feature + shared + domain):

- `shared/atoms` — `Button`, `Badge`
- `features/carrito` — organism/list + hook + `index.js`
- `features/productos` — molecule `SearchBar` + página
- `domain/pedido.js` — reglas puras sin React

```bash
cd EJEMPLO_ARQUITECTURA
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
```

## Cómo estudiar

Cada fase está pensada para que no te sientas abrumado: primero entiendes la idea con palabras, luego la ves hecha, luego la practicas con las manos y por último la verificas.

| Fase | Qué haces | Cuánto |
|------|-----------|--------|
| **1. Leer** | Lee la teoría de la unidad en `docs/` sin abrir el editor; solo asimila las ideas y las tablas | 20-30 min por unidad |
| **2. Observar** | Abre `EJEMPLO_ARQUITECTURA` y busca en el código los conceptos que acabas de leer | 20 min |
| **3. Practicar** | Modifica el ejemplo: renombra, mueve archivos, rompe una regla a propósito y mira qué pasa | 30-45 min |
| **4. Verificar** | Ejecuta `pnpm lint` y `pnpm contesta` la autoevaluación del final de cada unidad | 15 min |

> Consejo: no intentes memorizar las cinco unidades de corrido. Atomic Design y Feature Based se entienden en una tarde; Clean Architecture y DDD conviene dejarlas digerir un día.

## Práctica mínima

Lo mínimo que debes hacer antes de pasar de módulo (si haces esto, ya aprendiste de verdad):

```bash
cd EJEMPLO_ARQUITECTURA
pnpm install
pnpm dev
```

- [ ] Abrir `src/shared/atoms/Button.jsx` y explicar en voz alta qué es un "atom".
- [ ] Abrir `src/features/carrito/index.js` y explicar por qué existe ese archivo.
- [ ] Abrir `src/domain/pedido.js` y comprobar con `Ctrl+F` que **no** aparece la palabra `react`.
- [ ] Cambiar un color en `Button.jsx` y ver el cambio en el navegador con `pnpm dev`.
- [ ] Ejecutar `pnpm lint` sin errores.

## Mapa con el README

- [x] Atomic Design
- [x] Feature Based Architecture
- [x] Clean Architecture
- [x] Modularización
- [x] Introducción a DDD
