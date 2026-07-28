import axios from "axios";
import { createContext, useContext, useState } from "react";

const ProductsContext = createContext();

function ProductsProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  //Set loader
  function showLoader() {
    setLoading(false);
  }

  return (
    <ProductsContext.Provider
      value={{
        loading,
        setLoading,
        chatOpen,
        setChatOpen,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

function useProducts() {
  const context = useContext(ProductsContext);
  return context;
}

export { ProductsProvider, useProducts };
