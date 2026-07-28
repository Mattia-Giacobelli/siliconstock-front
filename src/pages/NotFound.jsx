import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { Link } from "react-router";

export default function NotFound() {
  const [animation, setAnimation] = useState(null);
  useEffect(() => {
    fetch("/404-notFound.json")
      .then((res) => res.json())
      .then((data) => setAnimation(data))
      .catch((err) =>
        console.error("Errore nel caricamento dell'animazione:", err),
      );
  }, []);
  return (
    <>
      <div className="text-white" id="animation">
        <Lottie
          animationData={animation}
          loop={true}
          style={{ height: "500px", width: "500px" }}
        />
        <h1>404 - Pagina non trovata</h1>
        <p>Spiacenti, la pagina che cerchi non esiste.</p>
        <Link className="btn btn-primary" to="/">Torna alla Home</Link>
      </div>
    </>
  );
}
