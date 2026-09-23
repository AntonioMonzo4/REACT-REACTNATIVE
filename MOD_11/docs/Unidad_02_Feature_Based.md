# Unidad 02 — Feature Based Architecture

## Objetivos

- Entender la diferencia entre agrupar por **tipo** y agrupar por **dominio**.
- Saber qué es una "feature" y cómo reconocer los límites de cada una.
- Usar `index.js` como frontera (API pública) de una feature.
- Evitar los import prohibidos entre features.
- Justificar por qué el enfoque por features reduce conflictos de merge en equipo.
- Identificar las features y su `index.js` en el ejemplo `EJEMPLO_ARQUITECTURA`.

## Requisitos

- Haber leído la [Unidad 01 — Atomic Design](Unidad_01_Atomic_Design.md) (conviene, pero no es obligatoria).
- Saber importar archivos en JavaScript: `import { useCarrito } from './hooks/useCarrito'`.
- Entender la idea básica de carpetas dentro de `src/`.
- Tener abierta la app de práctica `EJEMPLO_ARQUITECTURA` para mirarla mientras lees.

## Idea

En vez de agrupar por **tipo** (`components/`, `hooks/`, `utils/`), agrupar por **dominio / feature**:

**¿Qué significa "agrupar por tipo"?** Es el orden por defecto de casi todo tutorial: una carpeta para todos los componentes, otra para todos los hooks, otra para toda la API. Se llama *technical topology* (topología técnica) porque organiza según **qué es** el archivo (¿componente? ¿hook? ¿utilidad?), no según **para qué sirve** en el negocio.

**¿Qué es una feature?** Un concepto del negocio: el carrito, el login, la facturación, la búsqueda. Es lo que un usuario describiría con una palabra: "añadí algo al *carrito*", "me *logueé*".

**El problema del enfoque técnico:** para entender el carrito tienes que abrir cinco carpetas (`components/CarritoLista.js`, `hooks/useCarrito.js`, `api/carritoApi.js`, `store/carritoSlice.js`...). El código del mismo concepto está **disperso por todo el árbol**. Con el enfoque por feature, todo lo del carrito está en una sola carpeta: entras, lees de arriba abajo y ya lo entiendes. Es como si en tu casa la ropa estuviera en el armario (feature) o repartida entre la cocina, el baño y el salón (por tipo).

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

**Cómo leer el árbol "Bien":**

- `features/carrito/` contiene **todo** lo del carrito: sus componentes, su hook, su llamada a la API y su slice de Redux (si usas uno).
- `features/carrito/index.js` es la **puerta de entrada**. Las demás features solo pueden tocar este archivo; nunca entrar en las subcarpetas.
- `features/productos/` es otra isla independiente con su propia estructura.
- `app/` guarda lo que es de **toda** la app: el router, los providers globales, el layout raíz.
- `shared/` guarda lo **transversal**: `Button`, `formatearPrecio`, cosas que usa media app y no pertenecen a un solo negocio.

## Reglas

1. **Una feature = un concepto de negocio** (carrito, auth, facturación).
2. `index.js` expone solo lo que otras features necesitan (**frontera**).
3. Importar *dentro* de la feature libremente; *entre* features → solo por `index`.
4. `shared/` o `components/ui/` para lo genérico (Button, Modal).

**Explicación de cada regla:**

1. *Concepto de negocio.* Si tu carpeta se llama `botonera/` o `utils2/`, no es una feature. Se llama `carrito/`, `auth/`, `pedidos/`. Pista: si no puedes nombrarla con una o dos palabras que un usuario entendería, probablemente sea otra cosa (quizá un `shared/`).
2. *`index.js` es la fachada.* Igual que una tienda tiene escaparate y almacén: tú ves el escaparate (`index.js`), no el almacén. Ese archivo exporta solo lo público: `export { useCarrito } from './hooks/useCarrito'`. El resto (el `carritoApi.js` interno, los componentes privados) queda oculto.
3. *Import entre features solo por `index`.* `features/auth` puede hacer `import { useCarrito } from '../carrito'` pero **nunca** `import ... from '../carrito/api/clienteInterno'`. Así puedes reescribir por completo la carpeta interna de `carrito/` sin romper nada fuera.
4. *`shared/` para lo genérico.* `Button` no es del carrito ni de productos: es de todos. Vive en `shared/` (o `components/ui/`) para que ninguna feature lo duplique.

## Ventajas

- Co-localizar código que cambia junto (menos saltos de archivos).
- Borrar/extraer una feature más fácil.
- Conflictos de merge menores entre equipos.

**Por qué importa cada una:**

- **Co-localización:** cuando el cliente diga "cambia el IVA del carrito", todo lo que hay que tocar está en `features/carrito/`. No tienes que recordar en qué siete carpetas se escondió la lógica.
- **Borrar o extraer:** si un día el carrito pasa a ser un microservicio con su propia app, **cortas una carpeta y ya**. Igual si lo extraes a un paquete de un monorepo.
- **Conflictos de merge:** si Ana toca `features/carrito/` y Beto toca `features/productos/`, sus ramas **nunca** chocan en el mismo archivo. Con la topología técnica, los dos tocarían `components/index.js` y Git pelearía.

## Errores comunes

**Error 1: Features que importan a profundidad de otra (`features/auth/api/clienteInterno`).**

```jsx
// ❌ Mal: rompe la frontera
import { clienteInterno } from '../auth/api/clienteInterno'

// ✅ Bien: solo por la API pública
import { useSesion } from '../auth'
```

**Solución:** añadir un `index.js` en cada feature que exporte lo público, y un lint que lo vigile (ver Unidad 04 — Modularización). Pregúntate siempre: "¿esto es API pública o detalle interno?". Si es interno, no exportes.

**Error 2: Crear una feature por componente (`features/BotonRojo`).**

```text
src/features/
  BotonRojo/
  TarjetaAzul/
  ModalGrande/
```

**Solución:** eso son atoms o molecules, no features. Las features se nombran con **palabras del negocio**: `carrito`, `auth`, `facturación`. Si es solo una pieza de UI, va a `shared/` o a la feature que la use.

**Error 3: features gigantes que mezclan todo ("features/app/").**

```text
features/app/
  components/  (¡toda la UI de la app aquí otra vez!)
  hooks/
```

**Solución:** si una feature crece sin parar, es que en realidad son varias. Divide por subconcepto: `features/pedidos/` puede contener `features/pedidos/checkout/` y `features/pedidos/historial/`. Una feature debería poder explicarse en una frase.

## Conceptos clave

- **Feature:** un concepto del negocio (carrito, auth) agrupado en su propia carpeta.
- **Topología técnica vs. por feature:** agrupar por *qué es* el archivo vs. por *para qué sirve*.
- **`index.js` / frontera:** archivo que expone solo lo público de la feature.
- **Import entre features:** solo a través del `index.js`, nunca en profundidad.
- **`shared/`:** código transversal (Button, formatos) que no pertenece a una feature.
- **`app/`:** router y providers globales de toda la aplicación.
- **Co-localización:** el código que cambia junto vive junto.
- **Conflictos de merge:** al dividir por features, dos equipos trabajan en carpetas distintas.

## Autoevaluación

**1. ¿Dónde va `formatearPrecio`, que usan el carrito y la ficha de producto?**

<details>
<summary>Respuesta</summary>

En `shared/` (o en `utils/` transversal). No es de una feature concreta: la usan varias, así que no debe vivir dentro de `features/carrito/` ni de `features/productos/`.

</details>

**2. `features/productos` necesita el hook del carrito para añadir productos. ¿Qué import es correcto?**

<details>
<summary>Respuesta</summary>

`import { useCarrito } from '../carrito'` (a través del `index.js` de la feature). Nunca `../carrito/hooks/useCarrito`, porque eso cruza la frontera y te ata a la estructura interna del carrito.

</details>

**3. Ventaja principal de agrupar por feature en un equipo de 5 personas.**

<details>
<summary>Respuesta</summary>

Menos conflictos de merge y código co-localizado: cada persona trabaja en su carpeta de feature sin pisar los archivos de los demás, y todo lo de un concepto está junto para entenderlo rápido.

</details>

**4. Quieres borrar toda la funcionalidad de facturación. ¿Qué haces con la topología por feature?**

<details>
<summary>Respuesta</summary>

Borras `features/facturación/` (y sus imports en el router) en lugar de perseguir archivos dispersos por `components/`, `hooks/` y `api/`. Si además todo lo entraba por su `index.js`, solo tienes que revisar ese punto de contacto.

</details>
