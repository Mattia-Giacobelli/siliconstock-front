import { useState, useEffect } from "react";
import axios from "axios";
import SingleCard from "../components/SingleCard";
import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';
import { useProducts } from "../contexts/ProductsContext";
import Chatbot from "../components/Chatbot";
import { useSearchParams } from "react-router";
import { useCart } from "../contexts/CartContext";

export default function Products() {

  const [searchParams, setSearchParams] = useSearchParams()

  const [todos, setTodos] = useState([]);
  const { loading, setLoading } = useProducts();
  const [searchValue, setSearchValue] = useState(searchParams?.get('searchValue') || '')
  const [filter, setFilter] = useState(searchParams?.get('filter') || '')
  const { added } = useCart();


  function fetchTodos() {

    console.log(filter);

    setSearchParams({ searchValue, filter })

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products?searchValue=${searchValue}&filter=${filter}`)
      .then((res) => setTodos(res.data))
      .finally(() => setTimeout(setLoading(false), 1000))
  }

  useEffect(fetchTodos, [searchValue, filter]);
  useEffect(() => { setLoading(true) }, [])

  return (

    <div className="container mt-4">

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
        <>
          <div className="d-flex justify-content-around">
            <div className="input-group w-50">
              <input
                value={searchValue} onChange={e => setSearchValue(e.target.value)}
                type="search" className="form-control w-50"
                placeholder="Cerca" aria-label="Search"
                aria-describedby="basic-addon2" />
              <button className="btn btn-outline-secondary btn-search" type="button" id="button-addon2"
                onClick={fetchTodos}>
                <i className="bi bi-search"></i>
              </button>
            </div>
            <select class="form-select w-25" aria-label="Select filter"
              onChange={e => setFilter(e.target.value)}>
              <option value='' >Ordina per</option>
              <option value="asc">Prezzo crescente</option>
              <option value="desc">Prezzo decrescente</option>
              <option value="name-asc">Per nome A-Z</option>
              <option value="name-desc">Per nome Z-A</option>
              <option value="new">Più recente</option>
              <option value="old">Meno Recente</option>
            </select>
          </div>

          {added ? <span className="add-popup" >Aggiunto al carrello</span> : ''}
          {/* <span className="add-popup" >Aggiunto al carrello</span> */}

          <div>
            <h1 className="text-uppercase my-3 text-light">products</h1>
            {
              todos.length === 0 ? (
                <div className="text-center">
                  <h3 className="text-light">Nessun prodotto trovato</h3>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
                  {todos.map((item) => (
                    <div key={item.id} className="col mb-3">
                      <SingleCard todo={item} />
                    </div>
                  ))}
                </div>
              )
            }
          </div>

        </>}
      <Chatbot
        products={todos}
      />
    </div>
  );
}
