import CheckoutForm from "../components/CheckoutForm";
import { useCart } from "../contexts/CartContext"



export default function CheckoutPage() {

    const { cart } = useCart();
    console.log(cart);



    if (!clientSecret) return null; // oppure loader

    return (
        <>
            <CheckoutForm />

            <p>ciao</p>
        </>
    );
}