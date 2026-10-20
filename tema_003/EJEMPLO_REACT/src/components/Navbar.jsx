import "../style/Navbar.css"
import { Fragment } from "react"

function Navbar(){

    const name = "Esto es un nombre ANTONIO"
    return(
        <nav className="navbar">
           <ul className="nav-list">
            <li className="nav-item">
                <a href="/" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
                <a href="/products" className="nav-link">Products</a>
            </li>
            <li className="nav-item">
                <Fragment>  
                <a href="/cart" className="nav-link">Cart</a>
                </Fragment>
            </li>
           </ul> 

           <p className="nav-name">{name}</p>
        </nav>
    )
}
export default Navbar