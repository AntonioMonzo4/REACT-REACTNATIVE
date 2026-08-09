//COMO USAR LOS PROPS EN REACT
import React from "react"; 

const Props = (props) => {
    return (
        <div>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
        </div>
    )
}

export default Props


//COMO USAR LOS PROPS EN REACT también se puede hacer de la siguiente manera:
import React from "react";

const Props = ({ title, description }) => {
    return (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export default Props

//NOTA: Los props son inmutables, es decir, no se pueden modificar desde el componente hijo. Si se quiere modificar un prop, se debe 
// hacer desde el componente padre.
//Tambien se puden ponmer como pertenecientes todos a un objeto y desestructurarlos en el componente hijo, de la siguiente manera:
import React from "react";

const Props = (props) => {
    const { title, description } = props;
    return (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export default Props

//Para usar key en un componente hijo, se debe pasar como prop al componente hijo, de la siguiente manera:
import React from "react";

const Props = (props) => {
    const { title, description, key } = props;
    return (
        <div key={key}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export default Props