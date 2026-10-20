//Como crear un custom hook
//Un custom hook es una función que nos permite reutilizar lógica de estado y efectos en diferentes componentes. 
// Los custom hooks deben comenzar con la palabra "use" y 
// pueden utilizar otros hooks dentro de ellos. 
// Los custom hooks nos permiten abstraer la lógica de un componente y hacerla más reutilizable y mantenible.

//Ejemplo de un custom hook que nos permite manejar el estado de un contador:
import { useState } from "react";

const useCounter = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return { count, increment, decrement };
};

export default useCounter;
