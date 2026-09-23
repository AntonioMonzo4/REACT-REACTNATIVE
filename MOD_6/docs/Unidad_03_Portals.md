# Unidad 03 — Portals

## Objetivos

- Entender qué es un portal y por qué permite renderizar **fuera** de la jerarquía del DOM sin romper el árbol lógico de React.
- Diferenciar **árbol lógico (React)** de **árbol físico (DOM)** y saber cuándo conviene separarlos.
- Construir un `Modal` completo con `createPortal`, montado en `document.body` o en un nodo `#modal-root`.
- Aplicar los casos de uso típicos: modals, toasts, tooltips y dropdowns atrapados por `overflow`, `z-index` o `transform`.
- Implementar la accesibilidad mínima de un diálogo: `role`, `aria-modal`, cierre con `Escape` y devolución del foco.
- Saber leer y modificar el ejemplo del módulo: `../EJEMPLO_REACT_AVANZADO/src/components/DemoPortal.jsx`.

## Requisitos

Para seguir esta unidad ya debes dominar lo visto en **M4** (módulo de React básico):

- Componentes funcionionales, **props** y composición (`children`).
- JSX válido: etiquetas, expresiones `{}`, condicionales (`{open && ...}` y ternarios).
- **Estado con `useState`**: abrir/cerrar un modal es, en el fondo, un booleano de estado.
- **Eventos** en React (`onClick`, `e.stopPropagation()`), que verás otra vez al tratar el clic en el overlay.
- Clases CSS básicas (`className="overlay"`, `className="modal"`): no hace falta dominar CSS avanzado, pero sí entender que el estilo depende del sitio donde se monte el nodo.

Si algo de esa lista te suena a chino, repasa M4 antes de continuar.

## Qué es un portal

Un **portal** renderiza un hijo en un nodo del DOM que está **fuera de la jerarquía del padre**, manteniendo al mismo tiempo el contexto de React: props, estado, context y eventos siguen fluyendo como si el componente estuviera donde lo escribiste.

### Analogía: la puerta secreta

Imagina una casa con habitaciones encadenadas (el árbol de componentes). Un portal es una **puerta secreta**: sacas el mueble (el JSX del modal) por la puerta y lo colocas en el recibidor (el `body` del documento), pero el mueble **sigue colgado de la misma instalación eléctrica** (props, context, handlers de React). Nadie ha desenchufado nada: solo has cambiado dónde se ve, no de quién es.

### Qué significa en la práctica

- **DOM**: el nodo final puede ser cualquier otro contenedor de la página (`document.body`, `#modal-root`, un `div` dentro de otro layout…).
- **React**: el componente sigue siendo **hijo lógico** del que lo renderiza. Recibe sus props, su contexto (por ejemplo, el `ThemeContext` de la unidad 01) y sus eventos se propagan por el árbol de React.

```jsx
import { createPortal } from 'react-dom'

function Modal({ open, children, onClose }) {
  if (!open) return null

  return createPortal(
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal">
        {children}
        <button type="button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>,
    document.body,
  )
}
```

Lo esencial de la firma: `createPortal(<jsx>, nodoDestino)`. El primer argumento es **lo que quieres pintar**; el segundo, **dónde** debe vivir en el DOM. El valor de retorno se usa en el `return` como cualquier otro JSX.

### Por qué importa

Sin portales, todo lo que renderizas vive exactamente donde el árbol lo coloca. Eso está muy bien para contenido normal, pero es un problema clásico para la UI flotante… y lo vemos en la siguiente sección.

## Para qué sirve

### Casos de uso reales

- **Modals / diálogos**: deben cubrir toda la pantalla, no solo su tarjeta.
- **Toasts / notificaciones**: aparecen esquinados arriba, fuera del contenido scrolleable.
- **Tooltips y dropdowns**: burbujas pequeñas que no pueden recortarse.
- **Menus contextuales** (clic derecho) y **portales de búsqueda** a pantalla completa.

### El problema del layout que "atrapa" el UI flotante

Hay tres propiedades CSS que, heredadas por ancestros, arruinan cualquier elemento flotante hecho "a la antigua":

| Propiedad | Qué hace el ancestro | Síntoma en el modal/tooltip |
|-----------|----------------------|-----------------------------|
| `overflow: hidden` | recorta lo que sobresale | la parte del modal fuera de la caja **desaparece** |
| `transform` | crea un contexto de apilamiento (stacking context) | el `z-index` del modal compara **contra sus hermanos**, no contra la página entera: queda por debajo |
| `filter` / `perspective` / `contain` | efectos parecidos a `transform` | idéntico atrapamiento de capas |

Ejemplo mínimo del dolor: un `<div className="card" style={{ overflow: 'hidden' }}>` que contiene el botón "Abrir modal". Si el modal es hijo de esa card, puede quedar cortado o, con `transform` de por medio, **por debajo** del header aunque pongas `z-index: 9999`.

**Por qué importa**: con un portal montas el modal en `document.body` (o en `#modal-root`), que no hereda el `overflow` ni el stacking context de tu card. El modal mira a la página entera, como debe ser. Ojo: el portal resuelve el layout, no elimina la necesidad de un `z-index` razonable en el CSS del overlay.

## Cómo no romper el árbol lógico

Aquí está la magia (y el matiz importante) de los portales.

### Sigue siendo hijo en React

Aunque el nodo DOM aparezca en otra parte, el componente portal **sigue recibiendo props y context del punto donde se llama**. Si `<Modal>` está dentro de un proveedor de tema, usa ese tema. Si su padre le pasa `onClose`, ese handler es el del padre. El árbol lógico no se corta: solo se "desvía" la salida visual.

### El event bubbling sigue la jerarquía React

Los eventos de React se propagan según el **árbol de React**, no según la posición física en el DOM. Matiz de oro:

- Si el portal cuelga de `<Card>`, un clic en el modal **sí** burbujea hacia los handlers de `<Card>` en React.
- El navegador, por su parte, burbujea por el DOM real (hacia `body`).

Por eso el overlay del ejemplo hace `onClick={() => setOpen(false)}` y el modal interior hace `e.stopPropagation()`: evitamos que el clic "atraviese" al overlay cuando el usuario pulsa dentro del cuadro. Es el mismo patrón de stopPropagation que ya usaste en M4, con la particularidad de que la confusión de "¿hacia dónde burbujea?" aparece mucho en portales.

### Un nodo destino, creado una sola vez

Crea el nodo destino **una sola vez**, en el HTML, y no lo dupliques desde un componente. La forma cómoda y segura:

```html
<!-- index.html -->
<body>
  <div id="root"></div>
  <div id="modal-root"></div>
</body>
```

```jsx
const root = document.getElementById('modal-root')
```

- El nodo vive en el HTML: siempre está ahí, sin importar cuántas veces montes el componente.
- `getElementById` es el método más rápido del DOM y legible. Llámalo **dentro del render** (o en un `useMemo`) no es un problema, pero evita crear `div`s con `document.createElement` en cada render: acabarías con nodos huérfanos por la página.

Conviene un pequeño guardia por si el id no existe (HTML mal escrito, test en entorno sin DOM completo):

```jsx
function Modal({ open, children, onClose }) {
  if (!open) return null

  const destino = document.getElementById('modal-root')
  if (!destino) return null

  return createPortal(<div className="modal">{children}</div>, destino)
}
```

**Por qué importa**: si el segundo argumento de `createPortal` es `null`, React lanza `Target container is not a DOM element` y la app revienta en runtime. Un `if` de dos líneas te ahorra ese susto.

## Ejemplo completo: Modal con createPortal

El patrón que verás una y otra vez en proyectos reales, condensado:

```jsx
import { createPortal } from 'react-dom'

function Modal({ open, children, onClose }) {
  if (!open) return null

  return createPortal(
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal">
        {children}
        <button type="button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>,
    document.body,
  )
}

function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3>Hola desde fuera del árbol visual</h3>
      </Modal>
    </>
  )
}
```

Flujo completo: el estado `open` vive en `App` (árbol lógico), el JSX del modal se pinta en `document.body` (árbol físico), y el botón "Cerrar" dispara `onClose` que actualiza el estado del padre. Puerta secreta con instalación eléctrica intacta.

## Accesibilidad mínima

Un modal inaccesible es un modal que mitad de tus usuarios no puede usar. La lista mínima, sin librerías:

1. **`role="dialog"`** y **`aria-modal="true"`**: le dice al lector de pantalla que esto es un diálogo y que el resto de la página está "en pausa".
2. **`aria-label`** (o `aria-labelledby` apuntando a un título): el diálogo necesita nombre.
3. **Cerrar con `Escape`**: escucha `keydown` en el documento mientras está abierto.
4. **Devolver el foco** al botón que abrió el modal al cerrarlo: si no, el foco queda en el limbo y el usuario pierde su sitio.
5. **No dejar pasar clics sin querer**: el overlay suele cerrar; el contenido, no (de ahí el `stopPropagation`).

```jsx
// extracto ilustrativo de los handlers de accesibilidad
useEffect(() => {
  if (!open) return

  const onKey = (e) => {
    if (e.key === 'Escape') onClose()
  }
  document.addEventListener('keydown', onKey)
  openerRef.current?.focus() // foco al entrar (o al salir, al botón que abrió)

  return () => document.removeEventListener('keydown', onKey)
}, [open, onClose])
```

**Por qué importa**: `role` y `aria` son triviales de añadir y cambian por completo la experiencia con teclado/lector; el `Escape` es lo que la gente espera de cualquier diálogo; el foco evita que al cerrar quedes navegando a ciegas.

## Errores comunes

| Error (síntoma) | Causa probable | Solución |
|-----------------|----------------|----------|
| `Target container is not a DOM element` | El nodo destino es `null`: falta el id en el HTML o se busca antes de que exista | Añade `<div id="modal-root"></div>` en `index.html`; haz guardia `if (!destino) return null` |
| El modal se ve recortado | Sigue montándose dentro del ancestro con `overflow: hidden` | Pásalo por `createPortal` hacia `body` o `#modal-root` |
| El modal queda **detrás** del header aunque `z-index: 9999` | Un ancestro con `transform`/`filter` creó un stacking context | Portal fuera de ese ancestro (mismo `z-index`, ahora compite a nivel raíz) |
| "El clic pasa al fondo" / se cierra al tocar dentro | Falta `stopPropagation` en el contenido del modal | `onClick={(e) => e.stopPropagation()}` en el diálogo (el overlay sí cierra) |
| El contexto/tema "se pierde" al abrir el modal | Mito: no ocurre por el portal; suele ser que buscas el nodo con un id inexistente o montas fuera del provider en el código | Revisa que el componente portal siga colgado del provider en el **árbol React**, no del DOM |
| Nodos `#modal-root` duplicados | Crear el nodo con `document.createElement` dentro del render | Nodo estático en `index.html`, creado una sola vez |

## Conceptos clave

- **Portal** = pintar JSX en un nodo DOM externo **sin** desconectarse del árbol lógico de React.
- `createPortal(jsx, container)` devuelve el equivalente a JSX; el árbol **React** no cambia, solo el **DOM**.
- Props, **context** y **event bubbling** siguen la jerarquía de React, no la posición física del nodo.
- Uso principal: UI flotante (modals, toasts, tooltips) esquivando `overflow: hidden`, `transform` y sus trampas de `z-index`.
- Nodo destino **único y estático**: `#modal-root` en `index.html` + `document.getElementById` con guardia.
- Accesibilidad mínima: `role="dialog"`, `aria-modal="true"`, `Escape`, foco de vuelta al disparador y `stopPropagation` en el diálogo.
- Ejemplo vivo del módulo: `../EJEMPLO_REACT_AVANZADO/src/components/DemoPortal.jsx`.

## Autoevaluación

**1. Si muevo un modal con `createPortal` a `document.body`, ¿sigue teniendo acceso al `ThemeContext` del `App`?**

<details>
<summary>Respuesta</summary>

Sí. El portal solo cambia dónde se monta el **DOM**; el componente sigue siendo hijo lógico en el **árbol React**, por lo que hereda providers, props y handlers exactamente igual que antes.
</details>

**2. Mi tooltip se corta dentro de una card con `overflow: hidden`. ¿Qué solución más limpia aplicas y por qué funciona?**

<details>
<summary>Respuesta</summary>

Sacarlo con `createPortal` hacia `document.body` (o un contenedor fuera de la card). Al montarse fuera, no hereda el recorte del ancestro; el contexto de React (handlers de hover, estado) se mantiene intacto.
</details>

**3. ¿Por qué el segundo argumento de `createPortal` no debe ser un `div` creado en cada render con `document.createElement`?**

<details>
<summary>Respuesta</summary>

Porque crearías un nodo nuevo en cada render y abandonarías los anteriores: nodos huérfanos, IDs duplicados y `getElementById` apuntando a uno viejo. Lo correcto es un nodo único declarado en `index.html` y referenciado con `getElementById`.
</details>

**4. Un clic dentro del modal cierra el overlay por error. ¿Qué pieza de código lo evita y con qué lógica?**

<details>
<summary>Respuesta</summary>

`onClick={(e) => e.stopPropagation()}` en el elemento del diálogo: corta la propagación hacia el overlay (que tiene el `onClick` que cierra). Recuerda que en React la burbuja sigue la jerarquía lógica, aunque el nodo esté en `body`.
</details>
