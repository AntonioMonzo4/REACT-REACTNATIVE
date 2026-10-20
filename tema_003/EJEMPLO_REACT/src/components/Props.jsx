// CÓMO USAR LOS PROPS EN REACT
//
// Variante 1: acceder mediante props.title, props.description
//   const Props = (props) => { ... props.title ... }
//
// Variante 2 (recomendada): desestructurar en los parámetros
//   const Props = ({ title, description }) => { ... }
//
// Variante 3: desestructurar en el cuerpo de la función
//   const Props = (props) => {
//     const { title, description } = props;
//     ...
//   }
//
// NOTA: Los props son inmutables, es decir, no se pueden modificar desde el
// componente hijo. Si se quiere modificar un valor, se debe hacer desde el
// componente padre.
//
// NOTA sobre key: `key` es una prop especial de React que se usa en listas
// para identificar cada elemento. React la extrae del objeto props y el
// componente hijo NO la recibe.

const Props = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

export default Props
