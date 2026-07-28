import { useState, useEffect } from "react";
import { useProducts } from "../contexts/ProductsContext";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

export default function Chatbot({ products }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { chatOpen, setChatOpen } = useProducts();
  const chat = [];
  const parser = new DOMParser();
  const [chatLoader, setChatLoader] = useState(false);

  async function getResponse() {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
      products,
    });
    const data = await response.json();
    console.log(data.reply);
    chat.push({
      author: "ai",
      time: new Date().toLocaleTimeString(),
      text: data.reply,
    });
    setMessages(chat);
    console.log(messages);
    setChatLoader(false);

  }

  function handleSubmit(e) {
    e.preventDefault();
    setChatLoader(true);
    getResponse();
    chat.push({
      author: "user",
      time: new Date().toLocaleTimeString(),
      text: message,
    });
  }

  function handleChatOpen() {
    if (chatOpen) {
      setChatOpen(false);
    } else {
      setChatOpen(true);
    }
  }

  useEffect(() => {
    setMessage('')
  }, [messages])

  return (
    <>
      <div className="fixed-bottom chat-container z-3">
        <div
          className={`card chat-card-spacing z-3 ${chatOpen ? "" : "d-none"} mt-4 p-0`}
        >
          <div className="card-header chat-name">
            Parla con Fabrizio, <br /> il tuo agente segreto
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <div id="chat-messages">
              {chatLoader ? (
                <div className="loader_div">
                  <Quantum size="150" speed="1.75" color="rgb(31, 135, 239)" />
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`chat-bubble ${
                      msg.author === "user" ? "user" : "ai"
                    }`}
                  >
                    <div className="chat-meta">
                      <span
                        className={`chat-author ${
                          msg.author === "user" ? "user" : "ai"
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
                ))
              )}
            </div>
          </div>
          <div className={`d-flex mt-3 ${chatOpen ? "d-flex" : "d-none"}`}>
            <form
              type="submit"
              className="chat-form d-flex p-0 ps-3 mb-3"
              onSubmit={handleSubmit}
            >
              <textarea
                id="input-chat"
                className="form-control rounded-pill chat-select w-75 "
                placeholder="Chat"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button
                id="button-chat"
                className="btn btn-primary"
                type="submit"
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
            onClick={() => handleChatOpen()}
          >
            <i className="bi bi-robot"></i>
          </button>
        </div>
      </div>
    </>
  );
}
