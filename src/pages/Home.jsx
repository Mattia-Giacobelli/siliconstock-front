import { useEffect, useState } from "react";
import axios from "axios";
import SingleCard from "../components/SingleCard";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import { useProducts } from "../contexts/ProductsContext";
import Chatbot from "../components/Chatbot";
import { useCart } from "../contexts/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [latestArrivals, setLatestArrivals] = useState([]);
  const [error, setError] = useState(null);
  const { loading, setLoading } = useProducts();
  const { added } = useCart();

  useEffect(() => {
    const categories = [
      "scheda-video",
      "processore",
      "ram",
      "ssd",
      "case",
      "scheda-madre",
    ];
    setLoading(true);

    Promise.all(
      categories.map((c) =>
        axios.get(`http://localhost:3000/api/products/category/${c}`),
      ),
    )
      /* mostra il primo prodotto di ogni categoria "prodotti in evidenza" */
      .then((res) => {
        const featured = res.map((r) => r.data[0]).filter(Boolean);
        setProducts(featured);

        /* mostra l'ultimo prodotto di ogni categoria "ultimi arrivi" */
        const latest = [];

        res.forEach((r) => {
          const arr = r.data;

          if (arr.length > 0) {
            latest.push(arr[arr.length - 1]);
          }
        });

        setLatestArrivals(latest);
      })
      .catch(() => setError("error load products"))
      .finally(() => setTimeout(setLoading(false), 1000));
  }, []);

  return (
    <>
      {added ? <span className="add-popup">Aggiunto al carrello</span> : ""}

      {loading ? (
        <div className="loader_div">
          <Quantum size="150" speed="1.75" color="rgba(28, 38, 48, 1)" />
        </div>
      ) : (
        <div className="mt-5">
          <section className="hero-image mb-3" aria-label="SiliconStock hero" />
          <div className="container">
            <section className="products">
              <h2>Prodotti in evidenza</h2>
              <div className="card-grid">
                {products.map((p) => (
                  <SingleCard key={p.id} todo={p} />
                ))}
              </div>
            </section>

            <section className="products mt-5">
              <h2>Ultimi arrivi</h2>
              <div className="card-grid">
                {latestArrivals.map((p) => (
                  <SingleCard key={p.id} todo={p} />
                ))}
              </div>
            </section>

            <Chatbot products={products} />
          </div>
        </div>
      )}
    </>
  );
}
