# Módulo 11 — Arquitectura

Material del **Módulo 11** del roadmap (Atomic Design, Feature Based, Clean Architecture, modularización y DDD).

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

## Mapa con el README

- [x] Atomic Design
- [x] Feature Based Architecture
- [x] Clean Architecture
- [x] Modularización
- [x] Introducción a DDD
