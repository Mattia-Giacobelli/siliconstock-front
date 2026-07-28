import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate, Navigate } from "react-router";
import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';
import { useProducts } from "../contexts/ProductsContext";
import Chatbot from "../components/Chatbot";
import { useCart } from "../contexts/CartContext";
import NotFound from "./NotFound";

export default function DetailPage() {
  const { slug } = useParams();
  const { loading, setLoading } = useProducts();
  const [product, setProduct] = useState({});
  const { addProd, added } = useCart();
  const navigate = useNavigate();



  function fetchProduct() {
    setLoading(true)

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/${slug}`)
      .then((res) => {
        setProduct(res.data)
        console.log(res.data);

      }).catch(() => setProduct(undefined))
      .finally(() => setTimeout(setLoading(false), 1000))
  }


  useEffect(fetchProduct, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  console.log(product);

  if (product === undefined) {
    return <Navigate to="*" />
  }

  return (
    <>
      <div className="container mt-5">

        {/* bottone per tornare indietro */}
        <div className="mt-4 mb-5">
          <button
            type="button"
            className="btn btn-primary btn-sm px-2 btn-custom"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-bar-left"></i> Torna indietro
          </button>
        </div>

        {loading
          ?
          <div className="loader_div">
            <Quantum
              size="150"
              speed="1.75"
              color="rgba(28, 38, 48, 1)"
            />
          </div>
          :

          <div className="card flex-row detail-card">
            <div className="detail-image">
              <img src={`http://localhost:3000/${product.img}`} alt="product image" />
            </div>
            <div className="d-flex flex-column justify-content-around details">
              <h5 className="title">{product.product_name}</h5>
              <p className="description">{product.description}</p>

              <span>{product.price}€</span>
              <div className="add-container" >
                {added ? <span className="add-popup" >Aggiunto al carrello</span> : ''}

                <button onClick={() => addProd(product)} className="btn btn-primary btn-add-custom">
                  Aggiungi al carrello
                </button>
              </div>

              <p>specifiche tecniche: {product.technical_specs}</p>
            </div>
          </div>}
        <Chatbot
          products={product}
        />

      </div>
    </>
  );
}
