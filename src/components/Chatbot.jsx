import { useState } from "react";
import { useProducts } from "../contexts/ProductsContext";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

export default function Chatbot({ products }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { chatOpen, setChatOpen } = useProducts();
  const [chatLoader, setChatLoader] = useState(false);


  async function getResponse(userMessageText) {
    setChatLoader(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessageText,
          products: products, // <-- Inserito correttamente nel body del JSON
        }),
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        author: "ai",
        time: new Date().toLocaleTimeString(),
        text: data.reply,
      };

      // Aggiunge la risposta dell'AI alla chat esistente
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Errore durante la chiamata al chatbot:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          author: "ai",
          time: new Date().toLocaleTimeString(),
          text: "Si è verificato un errore di connessione. Riprova più tardi.",
        },
      ]);
    } finally {
      setChatLoader(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || chatLoader) return;

    const userMessageText = message;
    const userMessage = {
      author: "user",
      time: new Date().toLocaleTimeString(),
      text: userMessageText,
    };

    // 1. Mostra subito il messaggio dell'utente nella chat
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // 2. Pulisce subito la casella di testo
    setMessage("");

    // 3. Avvia la richiesta al backend
    getResponse(userMessageText);
  }

  function handleChatOpen() {
    setChatOpen(!chatOpen);
  }

  return (
    <>
      <div className="fixed-bottom chat-container z-3">
        <div
          className={`card chat-card-spacing z-3 ${chatOpen ? "" : "d-none"
            } mt-4 p-0`}
        >
          <div className="card-header chat-name">
            Parla con Fabrizio, <br /> il tuo agente segreto
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <div id="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-bubble ${msg.author === "user" ? "user" : "ai"
                    }`}
                >
                  <div className="chat-meta">
                    <span
                      className={`chat-author ${msg.author === "user" ? "user" : "ai"
                        }`}
                    >
                      {msg.author === "user" ? "Tu" : "FABRIZIO"}
                    </span>
                    <span className="chat-timestamp">{msg.time}</span>
                  </div>
                  <div
                    className="chat-texts"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  ></div>
                </div>
              ))}

              {/* Loader visibile in coda ai messaggi mentre Fabrizio risponde */}
              {chatLoader && (
                <div className="loader_div d-flex justify-content-center my-3">
                  <Quantum size="80" speed="1.75" color="rgb(31, 135, 239)" />
                </div>
              )}
            </div>
          </div>
          <div className={`d-flex mt-3 ${chatOpen ? "d-flex" : "d-none"}`}>
            <form
              className="chat-form d-flex p-0 ps-3 mb-3 w-100"
              onSubmit={handleSubmit}
            >
              <textarea
                id="input-chat"
                className="form-control rounded-pill chat-select w-75"
                placeholder="Scrivi un messaggio..."
                value={message}
                disabled={chatLoader}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                id="button-chat"
                className="btn btn-primary ms-2"
                type="submit"
                disabled={chatLoader}
              >
                Invia
              </button>
            </form>
          </div>
        </div>

        <div className="chat-button-spacing z-3">
          <button
            type="button"
            style={{ width: "80px", height: "80px" }}
            className="btn-open-chat rounded-circle"
            onClick={handleChatOpen}
          >
            <i className="bi bi-robot"></i>
          </button>
        </div>
      </div>
    </>
  );
}