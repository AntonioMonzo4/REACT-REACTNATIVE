# Unidad 02 — Feature Based Architecture

## Idea

En vez de agrupar por **tipo** (`components/`, `hooks/`, `utils/`), agrupar por **dominio / feature**:

```text
# Mal (technical topology)
src/
  components/  Boton.js, CarritoLista.js
  hooks/       useCarrito.js, useProductos.js
  api/         carritoApi.js, productosApi.js

# Bien (feature topology)
src/
  features/
    carrito/
      components/  CarritoLista.jsx
      hooks/       useCarrito.js
      api/         carritoApi.js
      cartSlice.js
      index.js     ← API pública de la feature
    productos/
      ...
  app/           router, providers globales
  shared/        Button, formatearPrecio (transversales)
```

## Reglas

1. **Una feature = un concepto de negocio** (carrito, auth, facturación).
2. `index.js` expone solo lo que otras features necesitan (**frontera**).
3. Importar *dentro* de la feature libremente; *entre* features → solo por `index`.
4. `shared/` o `components/ui/` para lo genérico (Button, Modal).

## Ventajas

- Co-localizar código que cambia junto (menos saltos de archivos).
- Borrar/extraer una feature más fácil.
- Conflictos de merge menores entre equipos.

## Errores comunes

- Features que importan a profundidad de otra (`features/auth/api/clienteInterno`).
- Crear una feature por componente (`features/BotonRojo`).

## En el ejemplo

Carpetas `features/carrito` y `features/productos` con su API pública en `index.js`.
