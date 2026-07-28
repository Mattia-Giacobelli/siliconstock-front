import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

function CartProvider({ children }) {

    const [added, setAdded] = useState(false)

    const [discountCodeId, setDiscountCodeId] = useState(0)

    const [order, setOrder] = useState(() => {

        const savedOrder = localStorage.getItem("order")

        return savedOrder ? JSON.parse(savedOrder) : {}
    })

    const [cart, setCart] = useState(() => {

        const savedCart = localStorage.getItem("cart")

        return savedCart ? JSON.parse(savedCart) : []
    });

    useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)) }, [cart])
    useEffect(() => { localStorage.setItem("order", JSON.stringify(order)) }, [order])

    function reduceProd(product) {
        setCart((prevProds) => {
            const checkProduct = prevProds.find((item) => item.id === product.id);

            if (!checkProduct) {
                return prevProds;
            }

            if (checkProduct.quantity === 1) {
                return prevProds.filter((item) => item.id !== product.id);
            }

            return prevProds.map((item) => {
                if (item.id === product.id) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
        });
    }

    function removeProd(product) {

        setCart((prevProds) => prevProds.filter((item) => item.id !== product.id))

    }

    function addProd(product) {
        setAdded(true)
        setCart((prevProds) => {
            const existingProduct = prevProds.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {
                return prevProds.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevProds, { ...product, quantity: 1 }];
        });
        setTimeout(() => {
            setAdded(false)
        }, 2500);
    }


    return (

        <CartContext.Provider
            value={{
                cart,
                setCart,
                order,
                setOrder,
                addProd,
                removeProd,
                reduceProd,
                added,
                setAdded,
                discountCodeId,
                setDiscountCodeId
            }}>
            {children}
        </CartContext.Provider>
    );
}

function useCart() {

    const context = useContext(CartContext);

    return context
}

export { CartProvider, useCart };