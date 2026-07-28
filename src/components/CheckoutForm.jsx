import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useCart } from "../contexts/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  //toggle form show
  const [showForm, setShowForm] = useState('user-data')

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:5173/complete",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
    setShowForm('user-data')
  };

  const paymentElementOptions = {
    layout: "accordion"
  }

  //User data form logic

  const { cart, order, setOrder, discountCodeId } = useCart();

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [shipping_address, setShippingAddress] = useState('')
  const [discountValue, setDiscountValue] = useState(0)

  const [formError, setFormError] = useState('')



  console.log(cart);

  function saveOrder(order) {
    setOrder(order)
    axios.post('http://localhost:3000/api/orders/newOrder', { order })
      .then(res => {
        console.log(res.data)
        console.log(res.data.status);


        if (res.data.status === 400) {
          setShowForm('user-data')
          setFormError(res.data.error)
        } else if (res.data.request === 'received') {
          setShowForm('payment')
          setFormError('')
          console.log('success');
          setFirstName(''),
            setLastName(''),
            setPhone(''),
            setEmail(''),
            setShippingAddress('')

        }
      })
      .catch(err => {

        console.log(err)
      })


  }

  async function handleUserDataSubmit(e) {
    e.preventDefault();

    if (!acceptTerms) {
      setFormError("Devi accettare i termini e condizioni per continuare.");
      return;
    }

    let total = 0

    cart.forEach(item => {

      total += Number(item.price)
      console.log(item.price);

    })

    console.log(discountCodeId);

    let discountValueLocal

    let newOrder

    if (discountCodeId !== 0) {
      await axios.get(`http://localhost:3000/api/orders/discount-code?id=${discountCodeId}`)
        .then(res => {
          console.log(res.data);
          setDiscountValue(res.data)
          discountValueLocal = res.data
        })

      newOrder = {
        id: Date.now(),
        first_name,
        last_name,
        phone,
        email,
        shipping_address,
        total_amount: total - (total * discountValueLocal[0].discount_value / 100),
        products: cart,
        discount_code_id: discountCodeId
      }
    } else if (discountCodeId === 0) {

      newOrder = {
        id: Date.now(),
        first_name,
        last_name,
        phone,
        email,
        shipping_address,
        total_amount: total,
        products: cart
      }
    }



    // console.log(total);
    console.log(order);

    saveOrder(newOrder)

    console.log(order);


  }

  return (
    <>

      {/* button to turn prevous page */}
      <div className="mt-4 ms-5 d-inline-block">
        <button
          type="button"
          className="btn btn-primary btn-sm px-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-bar-left"></i> Torna indietro
        </button>
      </div>

      <div className="container">

        <div className="row justify-content-between align-items-start">

          <div className="d-flex justify-content-center align-items-center col-md-12 col-sm-12">
            {showForm === 'user-data' &&
              <div>
                <form className="user-form " onSubmit={handleUserDataSubmit}>
                  <span>I campi che presentano * sono obbligatori</span>
                  {formError !== '' && <p >{formError}</p>}
                  <div className="mb-3 mt-4">
                    <label htmlFor="name" className="form-label">Nome *</label>
                    <input type="text" className="form-control" id="name"
                      value={first_name} onChange={e => setFirstName(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="surname" className="form-label">Cognome *</label>
                    <input type="text" className="form-control" id="surname"
                      value={last_name} onChange={e => setLastName(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="phone">Numero di telefono *</label>
                    <input type="text" className="form-control" id="phone"
                      value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input type="email" className="form-control" id="email"
                      value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="shipping-address" className="form-label">Indirizzo di spedizione *</label>
                    <input type="text" className="form-control" id="shipping-address"
                      value={shipping_address} onChange={e => setShippingAddress(e.target.value)} />
                  </div>

                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <label className="form-check-label text-white" htmlFor="acceptTerms">
                      <a>Accetto i termini e condizioni *</a>
                    </label>
                  </div>


                  <button type="submit" className="btn btn-primary" disabled={!acceptTerms}>Conferma</button>
                </form>
              </div>}
            {showForm === 'payment' &&
              <form id="payment-form" onSubmit={handleSubmit}>

                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <button disabled={isLoading || !stripe || !elements} id="submit">
                  <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                  </span>
                </button>
                {/* Show any error or success messages */}
                {message && <div id="payment-message">{message}</div>}
              </form>}
          </div>

          <div className="container mt-5 mx-auto col-md-12 col-sm-12 card bg-transparent py-2">
            {cart.map((product) => (
              <div
                key={product.id}
                className="d-flex align-items-center justify-content-between py-3 border-bottom"
              >
                <div className="flex-grow-1 d-flex">


                  <div className="me-5 cart-image">
                    <img src={`http://localhost:3000/${product.img}`} alt="" height={100} />
                  </div>

                  <div>

                    <h4 className="fw-semibold text-white mb-3">
                      {product.product_name || product.name}
                    </h4>



                    <small className="text-white mx-2">
                      Quantità: {product.quantity}
                    </small>


                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      </div>




    </>
  );
}