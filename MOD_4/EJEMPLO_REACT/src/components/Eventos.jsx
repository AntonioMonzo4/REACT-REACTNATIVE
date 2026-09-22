// Los eventos en React son una forma de manejar las interacciones del usuario
// con la interfaz. Son acciones que ocurren en el navegador, como hacer clic
// en un botón, mover el mouse o presionar una tecla. En React, los eventos se
// manejan mediante funciones que se pasan como props a los elementos JSX.

const Eventos = () => {
  const handleClick = () => {
    alert("Has hecho clic en el botón")
  }

  const handleChange = (e) => {
    console.log("Valor del input:", e.target.value)
  }

  return (
    <div>
      <button onClick={handleClick}>Haz clic aquí</button>
      <input type="text" onChange={handleChange} placeholder="Escribe algo..." />
    </div>
  )
}

export default Eventos

// Diferentes tipos de eventos en React:
// onClick: Se activa cuando se hace clic en un elemento.
// onChange: Se activa cuando el valor de un elemento cambia.
// onSubmit: Se activa cuando se envía un formulario.
// onMouseEnter: Se activa cuando el mouse entra en un elemento.
// onMouseLeave: Se activa cuando el mouse sale de un elemento.
// onKeyDown: Se activa cuando se presiona una tecla.
// onKeyUp: Se activa cuando se suelta una tecla.
// onFocus: Se activa cuando un elemento recibe el foco.
// onBlur: Se activa cuando un elemento pierde el foco.
// onDoubleClick: Se activa cuando se hace doble clic en un elemento.
// onContextMenu: Se activa cuando se hace clic derecho en un elemento.
// onDrag: Se activa cuando se arrastra un elemento.
// onDrop: Se activa cuando se suelta un elemento arrastrado sobre otro elemento.
// onScroll: Se activa cuando se desplaza un elemento con scroll.
// onLoad: Se activa cuando un elemento se carga completamente.
// onError: Se activa cuando ocurre un error al cargar un elemento.
// onInput: Se activa cuando el valor de un elemento de entrada cambia.
// onSelect: Se activa cuando se selecciona un texto en un elemento de entrada.
// onReset: Se activa cuando se restablece un formulario.
