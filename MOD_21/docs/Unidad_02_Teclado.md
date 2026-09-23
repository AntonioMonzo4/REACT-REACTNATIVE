# Unidad 02 — Navegación por teclado

## Objetivos

- Entender por qué el teclado es la primera prueba de accesibilidad de cualquier interfaz.
- Aplicar las **reglas de tabulación** (orden DOM, `tabIndex` correcto, elementos nativos).
- Implementar un **skip link** que salte al contenido principal.
- Construir un **modal** con trampa de foco (*focus trap*), cierre con `Escape` y devolución del foco.
- Reconocer y corregir los errores típicos de foco en React (portales, listas que refrescan).

## Requisitos

- Haber completado la **Unidad 01** (conocer POUR y la checklist).
- React M4–M15: `useRef`, `useEffect`, JSX, estilos con clases CSS.
- Un ejemplo navegable con varias secciones y algún formulario (p. ej. `MOD_4/EJEMPLO_REACT` o `MOD_12/EJEMPLO_DISENO`).
- Ganas de probar **sin tocar el ratón**: esa es la mitad de la unidad.

## Reglas

- **Tab** en orden DOM (evitar `tabIndex > 0` salvo casos raros).
- Elementos interactivos → botones/enlaces nativos, no `div onClick`.
- **Skip link** al contenido:

```jsx
<a href="#main" className="skip">Saltar al contenido</a>
<main id="main" tabIndex={-1}>…</main>
```

- Modales: trap de foco, `Escape` cierra, foco al opener al salir.
- Menús: flechas + `aria-expanded`, `role="menu"` solo si imitas menú real.

Desglosemos cada regla:

- **Tab en orden DOM**: el foco avanza en el orden en que los elementos aparecen en el HTML. Si tu maquetación visual no coincide con el DOM, el foco “salta” de forma incomprensible. Evita `tabIndex > 0` (rompe el orden natural para todo el mundo); el único valor numérico habitual es `tabIndex={-1}`, que **saca** un elemento del Tab pero permite enfocarlo por código (lo usaremos en el `<main>` del skip link).
- **Elementos nativos**: `<button>` y `<a>` ya vienen con teclado, roles y eventos de fábrica. Un `<div onClick>` no: no es enfocable, no responde a Enter/Espacio y no comunica que es una acción. (La Unidad 03 verá el rol; aquí basta con que **funcione con teclado**.)
- **Skip link**: el primer Tab de la página debe poder saltar la cabecera/nav completa e ir directo al contenido. En el ejemplo, el `<a href="#main">` lleva el foco al `<main>`; `tabIndex={-1}` hace ese `<main>` enfocable aunque no sea tabulable normalmente. El enlace suele estar **oculto visualmente** y aparecer al recibir foco (CSS `:focus`).
- **Modales**: cuando se abre, el foco debe entrar dentro; mientras está abierto, **Tab no puede escapar** al fondo (*focus trap*); con `Escape` se cierra; al cerrarse, el foco **vuelve al botón que lo abrió** (*opener*), si no, la persona queda perdida en el `body`.
- **Menús**: si imitas un menú de escritorio, las flechas navegan entre ítems y `aria-expanded` indica si está desplegado. Ojo: `role="menu"` solo si realmente imitas el comportamiento de un menú de sistema; para una nav normal, usa elementos de lista y enlaces normales.

## En React (trap simple)

```jsx
function Modal({ open, onClose, children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    ref.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="dlg-t" tabIndex={-1} ref={ref}>
      {children}
    </div>
  )
}
```

Paso a paso de ese efecto:

1. **`if (!open) return`**: si el modal no está abierto, no hay nada que enfocar ni escuchar. Al salir temprano evitas listeners huérfanos.
2. **`ref.current?.focus()`**: en cuanto el modal monta, el foco entra a su contenedor (`tabIndex={-1}` permite enfocarlo). Es el primer paso del trap: el foco **dentro**.
3. **`keydown` en `window`**: escucha la tecla `Escape` en toda la ventana y llama a `onClose()`. Usamos `window` para no depender de que el foco esté en un hijo concreto.
4. **Cleanup del `useEffect`**: `return () => window.removeEventListener(...)` al desmontar o cambiar `open`/`onClose`; sin esto, cada apertura acumularía listeners y cerraría varias veces.
5. **Atributos del diálogo**: `role="dialog"` + `aria-modal="true"` dicen al lector de pantalla “esto es un diálogo modal y el resto está inactivo”; `aria-labelledby="dlg-t"` apunta al `id` del título visible del diálogo (lo veremos bien en la Unidad 03).

Nota de honestidad: este trap es **simple** (foco inicial + Escape). Un trap completo también mueve el foco dentro del modal al pulsar Tab en el último elemento (y viceversa con Shift+Tab); en proyectos se suele delegar en una librería de componentes madura. Lo importante es entender las piezas: foco al abrir, contención, Escape y devolución al opener.

## Errores comunes

- `onClick` en `<div>`/`<span>` sin rol ni teclado → inaccesible.
- Portal de menú **detrás** del foco (orden de tabulación).
- Foco pierde al refrescar listas (recuperar foco o `aria-live`).

Vamos uno a uno:

- **`onClick` en `<div>`/`<span>` sin rol ni teclado → inaccesible**: el elemento no entra en el orden de Tab, no responde a Enter/Espacio y un lector de pantalla no lo anuncia como botón. Solución: usa `<button>` (o convierte el `div` con el mínimo: rol + teclado + foco, pero lo primero es preferir el nativo).
- **Portal de menú “detrás” del foco**: si renderizas el menú con un portal al final del `body`, puede quedar **antes/después** de dónde estábamos en el orden de tabulación, así que Tab no llega a los ítems o salta raro. Revisa el orden del DOM resultante y enfoca el primer ítem al abrir.
- **Foco pierde al refrescar listas**: si al borrar/actualizar ítems React desmonta el nodo enfocado, el foco cae al `body` y Tab vuelve a empezar desde arriba. Soluciones: mover el foco a un elemento vecino previsible (siguiente/anterior) o anunciar el cambio con `aria-live` (Unidad 03).

## Conceptos clave

- **Tab / orden DOM**: el foco avanza según el orden real del documento; `tabIndex > 0` se evita.
- **`tabIndex={-1}`**: elemento enfocable por código pero fuera del Tab normal (p. ej. `<main>` del skip link).
- **Elementos nativos**: `<button>`/`<a>` con teclado, rol y foco de fábrica; preferir siempre a `div onClick`.
- **Skip link**: enlace oculto que aparece con el foco y salta al contenido principal.
- **Focus trap**: mantener el foco dentro de un modal mientras está abierto.
- **`Escape` + foco al opener**: cierre estándar de modales y devolución del foco al botón que los abrió.
- **Portal**: nodo renderizado en otra parte del DOM; puede alterar el orden de tabulación.
- **`role="dialog"` / `aria-modal="true"`**: identifican un diálogo modal (detalle en la Unidad 03).

## Autoevaluación

1. ¿Por qué se desaconseja `tabIndex={1}` o `tabIndex={2}`?

<details><summary>Respuesta</summary>

Porque fija manualmente la prioridad de tabulación y **rompe el orden natural del DOM**: personas que usan Tab o lectores de pantalla esperan un orden predecible. Con números positivos, tu orden impuesto puede quedar por delante/de detrás del visual y confundir a todo el mundo. El único valor práctico habitual es `tabIndex={-1}` (enfocable por código, fuera del Tab).

</details>

2. Tu modal se abre, pero Tab sigue moviéndose por la página de fondo. ¿Qué tres comportamientos debe tener ese modal?

<details><summary>Respuesta</summary>

(1) **Trap de foco**: Tab y Shift+Tab se quedan atrapados dentro del diálogo. (2) **`Escape` cierra** el modal. (3) Al cerrar, el foco **vuelve al botón opener**, no cae al `body`. Además debe llevar `role="dialog"` + `aria-modal="true"` para que el lector de pantalla sepa que el fondo está inactivo.

</details>

3. ¿Qué hace exactamente el par skip link + `tabIndex={-1}` del ejemplo?

<details><summary>Respuesta</summary>

El `<a href="#main">` es el primer elemento tabulable: al pulsarlo (Enter) se salta la cabecera/navegación y lleva el foco/viewport al contenido. El `<main tabIndex={-1}>` hace ese destino **enfocable por código** aunque no sea un punto de parada normal de Tab, de modo que el foco queda realmente dentro del contenido y el siguiente Tab continúa desde allí.

</details>

4. Al borrar el ítem enfocado de una lista, el foco desaparece. ¿Dos formas de arreglarlo?

<details><summary>Respuesta</summary>

(1) **Recuperar el foco** de forma explícita tras el refresh: enfocar el ítem siguiente (o el anterior si no hay siguiente) conservando una referencia con `useRef`/ids. (2) **Anunciar el cambio** con una `aria-live` (p. ej. “Elemento eliminado”) para que el lector de pantalla se entere aunque el foco se mueva de forma impredecible. Lo ideal es combinar ambas.

</details>
