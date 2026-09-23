# Ejemplo Arquitectura — Módulo 11

Proyecto de práctica del **Módulo 11 (Arquitectura)**. Vite + React.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Estructura

```text
src/
  shared/           ← transversal (Atomic Design: atoms)
    atoms/          Button, Badge
    styles/
  domain/           ← reglas puras (Clean / DDD), sin React
    pedido.js
  features/
    productos/      feature + API pública (index.js)
      components/   SearchBar (molecule), ProductoCard
      pages/        ProductosPage
    carrito/
      components/   CarritoLista (organism)
      hooks/        useCarrito
      index.js      ← frontera de la feature
  app/              composición (Header, layout)
```

## Qué demuestra

| Concepto | Dónde |
|----------|-------|
| Atomic Design | `shared/atoms` → molecules en features → organism Header |
| Feature Based | `features/carrito` con `index.js` como única puerta |
| Clean Architecture | `domain/` sin imports de React; UI llama a reglas puras |
| Modularización | carrito no importa internals de productos fuera del index |
| DDD | lenguaje: `Pedido`, `LineaPedido`, `calcularTotalPedido` |

## Temario Módulo 11 — estado

- [x] Atomic Design
- [x] Feature Based Architecture
- [x] Clean Architecture
- [x] Modularización
- [x] Introducción a DDD
