import { Outlet } from "react-router-dom";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY

const stripePromise = loadStripe(stripeKey);

export default function PaymentLayout() {

    const { cart } = useCart();




    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {

        if (!cart.length) return;

        // Create PaymentIntent as soon as the page loads
        fetch("http://localhost:3000/api/orders/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: cart }),
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret)

            })

            ;
    }, [cart]);

    const appearance = {
        theme: 'stripe',
    };
    // Enable the skeleton loader UI for optimal loading.
    const loader = 'auto';

    if (!clientSecret) {
        return <div className="loader_div">
            <Quantum
                size="150"
                speed="1.75"
                color="rgba(28, 38, 48, 1)"
            />
        </div>
    }



    return (
        <>

            <Elements
                key={clientSecret}
                stripe={stripePromise}
                options={{ clientSecret, appearance, loader }}
            >
                <Outlet />
            </Elements>

        </>
    );
}
