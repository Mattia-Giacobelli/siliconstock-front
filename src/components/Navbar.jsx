import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext"
import { useEffect, useState } from "react";

export default function Navbar() {

    const { cart } = useCart();
    const [cartAmount, setCartAmount] = useState(0)


    console.log(cart);

    function getAmount() {
        let amount = 0
        cart.forEach(product => {
            amount += product.quantity

        });
        console.log(amount);

        setCartAmount(amount)

    }

    useEffect(getAmount, [cart])

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <img src="/content.png" alt="Logo" className="navbar-logo-img" />
                </Link>
                <Link to="/" className="navbar-link">Home</Link>
            </div>

            <div className="navbar-center">
                <img src="/immagine_2026-01-08_164056395-removebg-preview.png" alt="Silicon Stock" className="navbar-logo-text-img" />
            </div>

            <div className="navbar-right">
                <Link to="/products" className="navbar-link">Products</Link>
                <Link to="/cart" className="navbar-cart-link"><i className="bi bi-cart"></i></Link>
                <Link to="/cart" className="cart-amount" >{cartAmount}</Link>
            </div>
        </nav>
    );
}
