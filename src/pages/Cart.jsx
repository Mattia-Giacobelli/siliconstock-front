import { Link } from "react-router";
import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {

  const { cart, addProd, removeProd, reduceProd, setDiscountCodeId } = useCart();

  const [discountCode, setDiscountCode] = useState('')
  const [discountValue, setDiscountValue] = useState(0)
  const [discountedTotal, setDisconutedTotal] = useState(cart.reduce((tot, p) => tot + p.price * p.quantity, 0).toFixed(2))

  let total

  async function handleSubmit(e) {
    e.preventDefault()

    console.log(discountCode.toUpperCase());

    let localDiscountId

    if (discountCode.toUpperCase() === 'TECH10') {
      setDiscountCodeId(1)
      localDiscountId = 1
    } else if (discountCode.toUpperCase() === 'SPRING25') {
      setDiscountCodeId(2)
      localDiscountId = 2
    } else if (discountCode.toUpperCase() === 'MEGA50') {
      setDiscountCodeId(3)
      localDiscountId = 3
    }

    await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/discount-code?id=${localDiscountId}`)
      .then(res => {
        console.log(res.data.discount_value);
        console.log(res.data);

        setDiscountValue(res.data.discount_value)

      })

    total = cart.reduce((tot, p) => tot + p.price * p.quantity, 0).toFixed(2)

    console.log(total);



  }


  useEffect(() => {
    total = cart.reduce((tot, p) => tot + p.price * p.quantity, 0).toFixed(2)

    if (discountValue !== 0) setDisconutedTotal(Number(total) - (Number(total) * Number(discountValue) / 100))
    if (discountValue === 0) setDisconutedTotal(total)
  }, [discountValue, cart])


  useEffect(() => {
    localStorage.removeItem("order");
  }, []);

  return (
    <>
      <h1 className="text-primary text-center">CART PAGE</h1>
      <div className="container cart-size rounded-3 p-5">
        {cart.length === 0 ? (
          <h1 className="text-center text-color">CARRELLO VUOTO</h1>
        ) : (
          cart.map((product) => (
            <div
              key={product.id}
              className="align-items-center justify-content-between py-3 border-bottom row"
            >
              <div id="cart-section" className="flex-grow-1 d-flex justify-content-between col-sm-12 col-md-4">
                <div className="me-5 mb-3 cart-image">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${product.img}`}
                    alt=""
                  />
                </div>

                <div className="text-centering">

                  <h4 className="fw-semibold text-white mb-3">
                    {product.product_name || product.name}
                  </h4>

                  {(() => {
                    const price = Number(product.price);
                    const qty = Number(product.quantity) || 0;
                    const hasValidPrice = Number.isFinite(price);

                    return (
                      <>
                        <small className="text-white d-block mb-2">
                          Totale: {hasValidPrice ? `${(price * qty).toFixed(2)}€` : "N/D"}
                        </small>
                      </>
                    );
                  })()}

                  <div>

                    <button
                      className="btn btn-outline-light cart-btn"
                      onClick={() => reduceProd(product)}
                    >
                      <i className="bi bi-cart-dash cart-icon" />
                    </button>

                    <small className="text-white mx-2">
                      Quantità: {product.quantity}
                    </small>

                    <button
                      className="btn btn-outline-light cart-btn"
                      onClick={() => addProd(product)}
                    >
                      <i className="bi bi-cart-plus cart-icon" />
                    </button>

                  </div>

                </div>


                <div className="align-self-center ms-3">
                  <button
                    className="btn btn-danger btn-remove btn-position"
                    onClick={() => removeProd(product)}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <div className="mt-4 d-flex justify-content-between align-items-start recap">

            {/* SINISTRA: totale + sconto */}
            <div>
              <h4 className="text-white mb-3">
                Totale: {discountedTotal}€
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="input-group d-flex">
                  <input
                    className="discount-code form-control"
                    type="text"
                    placeholder="Codice sconto"
                    onChange={e => setDiscountCode(e.target.value)}
                  />
                  <button type="submit" className="btn-discount">
                    <i className="bi bi-bag-check"></i>
                  </button>
                </div>
              </form>
            </div>

            {/* DESTRA: checkout */}
            <div className="align-self-center">
              <Link to="/checkout" className="btn btn-light">
                Procedi al checkout
              </Link>
            </div>

          </div>
        )}

      </div>
    </>
  );
}
