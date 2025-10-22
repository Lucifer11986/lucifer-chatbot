import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chatMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });
  }, []);

  return (
    <div style={{ background: "#111", color: "#fff", height: "100vh", padding: "1rem" }}>
      <h1>🔥 Lucifer Chatbot</h1>
      <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.user}:</strong> {m.message}
          </div>
        ))}
      </div>
    </div>
  );
}
