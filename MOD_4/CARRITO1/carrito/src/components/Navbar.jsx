import "./style/Navbar.css"

function Navbar(){
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
                <a href="/cart" className="nav-link">Cart</a>
            </li>
           </ul> 
        </nav>
    )
}
export default Navbar