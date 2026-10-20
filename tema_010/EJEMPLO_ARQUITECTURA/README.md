# Ejemplo Arquitectura — Módulo 11

Proyecto de práctica del **Módulo 11 (Arquitectura)**. Vite + React.

Este ejemplo no es una app de producción gigante: es una **demo deliberadamente pequeña** donde puedes ver en un vistazo las cinco ideas del módulo (Atomic Design, Feature Based, Clean Architecture, modularización y DDD) viviendo en el mismo `src/`. Úsalo como laboratorio: rompe cosas, muévelas y mira cómo reacciona.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

| Comando | Qué hace |
|---------|----------|
| `pnpm install` | instala dependencias (la primera vez que entras) |
| `pnpm dev` | arranca el servidor de desarrollo con hot reload |
| `pnpm lint` | ejecuta ESLint: aquí verás si violas fronteras de módulos |
| `pnpm build` | genera el bundle de producción en `dist/` |

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

**Qué significa cada zona:**

- `shared/` → lo genérico que usa media app (patrón Atomic Design: los **atoms** `Button` y `Badge` viven aquí, en la base de la pirámide).
- `domain/` → las reglas puras del negocio (`pedido.js`). Si `Ctrl+F` "react" dentro de esa carpeta, **no debe aparecer**. Eso es Clean Architecture + DDD en su estado más puro.
- `features/productos/` → todo lo del catálogo: componentes, página y su `index.js` de API pública.
- `features/carrito/` → todo lo del carrito, con su hook `useCarrito` y su `index.js` como **única frontera** hacia fuera.
- `app/` → la composición final: Header y layout que ensamblan las features (el "organism" principal vive aquí).

## Qué demuestra

| Concepto | Dónde |
|----------|-------|
| Atomic Design | `shared/atoms` → molecules en features → organism Header |
| Feature Based | `features/carrito` con `index.js` como única puerta |
| Clean Architecture | `domain/` sin imports de React; UI llama a reglas puras |
| Modularización | carrito no importa internals de productos fuera del index |
| DDD | lenguaje: `Pedido`, `LineaPedido`, `calcularTotalPedido` |

## Qué practica este ejemplo

Antes de tocar código, ten claro qué habilidad estás entrenando con cada carpeta:

- **Jerarquía de UI (Atomic Design):** reconocer un atom (`Button`) cuando lo ves, y ver cómo se ensambla en molecules y organisms superiores.
- **Fronteras por feature:** comprobar que solo se entra a `carrito` por su `index.js`, y experimentar rompiéndolo a propósito para ver cómo el lint lo señala.
- **Separación dominio/infraestructura:** tocar `domain/pedido.js` y comprobar que es JavaScript puro, testeable sin renderizar nada.
- **Vocabulario de negocio (DDD):** leer `LineaPedido` y `calcularTotalPedido` y notar que los nombres son los del negocio, no de la base de datos.
- **Práctica de comandos:** flujo diario `pnpm dev` → editar → `pnpm lint` → `pnpm build`.

## Cómo recorrerlo

Sigue este orden: primero observa, luego rompe, luego repara. No empieces leyendo todos los archivos seguidos; alterna lectura y edición.

1. **Arranca:** `pnpm install` y `pnpm dev`. Abre la URL en el navegador y juega con la UI (añade productos, mira el carrito).
2. **Sigue el flujo en el DOM:** con las DevTools del navegador, inspecciona un botón y localízalo en el código (`shared/atoms/Button.jsx`).
3. **Sube la pirámide atómica:** de `Button` pasa a `SearchBar` (molecule) y luego al Header/`ProductosPage`. Observa cómo un nivel importa solo a niveles inferiores.
4. **Cruza la frontera de feature:** abre `features/carrito/index.js` y lista lo que exporta. Intenta importar algo que **no** está ahí desde `productos` y ejecuta `pnpm lint` para verlo fallar.
5. **Desciende al dominio:** abre `domain/pedido.js`, comprueba que no hay React, y cambia un cálculo (p. ej. un redondeo) para ver el efecto en la UI.
6. **Rompe a propósito:** importa `features/carrito/hooks/useCarrito` por ruta profunda desde otra feature. Ejecuta `pnpm lint`, lee el error, y **reparalo** usando el `index.js`.
7. **Verifica:** `pnpm build` debe terminar sin errores antes de pasar a la siguiente unidad del módulo.

> Regla del laboratorio: si algo deja de funcionar, `git checkout .` (o deshaz el cambio) y vuelve a intentarlo. El objetivo es entender, no atesorar un estado roto.

## Temario Módulo 11 — estado

- [x] Atomic Design
- [x] Feature Based Architecture
- [x] Clean Architecture
- [x] Modularización
- [x] Introducción a DDD
