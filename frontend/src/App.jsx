import React, { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3001";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [commands, setCommands] = useState([]);
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("offline");
  const [error, setError] = useState("");

  const sortedCommands = useMemo(
    () => [...commands].sort((a, b) => a.name.localeCompare(b.name)),
    [commands]
  );

  const loadCommands = useCallback(async () => {
    setError("");
    try {
      const res = await fetch(`${backendUrl}/commands`);
      if (!res.ok) throw new Error("Fehler beim Laden der Befehle");
      const data = await res.json();
      setCommands(data.commands ?? []);
    } catch (err) {
      setError(err.message);
    }
  }, [backendUrl]);

  useEffect(() => {
    loadCommands();
  }, [loadCommands]);

  useEffect(() => {
    const socket = io(backendUrl, { transports: ["websocket", "polling"] });
    setStatus("connecting");

    socket.on("connect", () => setStatus("online"));
    socket.on("disconnect", () => setStatus("offline"));

    socket.on("chatMessage", msg => {
      setMessages(prev => [...prev.slice(-99), msg]);
    });

    socket.on("commands", items => {
      setCommands(Array.isArray(items) ? items : []);
    });

    return () => {
      socket.disconnect();
    };
  }, [backendUrl]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedResponse = response.trim();

    if (!trimmedName || !trimmedResponse) {
      setError("Name und Antwort dürfen nicht leer sein.");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/commands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, response: trimmedResponse })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Befehl konnte nicht gespeichert werden");
      }

      setName("");
      setResponse("");
      const { command } = await res.json();
      if (command) {
        setCommands(prev => {
          const existing = prev.filter(item => item.name !== command.name);
          return [...existing, command];
        });
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(commandName) {
    setError("");
    try {
      const res = await fetch(`${backendUrl}/commands/${commandName}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error("Befehl konnte nicht gelöscht werden");
      }
      setCommands(prev => prev.filter(cmd => cmd.name !== commandName));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      style={{
        background: "#0b0b0f",
        color: "#f5f5f5",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Inter, system-ui, sans-serif"
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🔥 Lucifer Chatbot</h1>
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            background: status === "online" ? "#16a34a" : status === "connecting" ? "#f59e0b" : "#dc2626",
            fontSize: "0.875rem",
            fontWeight: 600
          }}
        >
          {status === "online" ? "Verbunden" : status === "connecting" ? "Verbinde…" : "Offline"}
        </span>
      </header>

      {error && (
        <p style={{ marginTop: "1rem", color: "#f87171" }}>⚠️ {error}</p>
      )}

      <main style={{ display: "grid", gap: "2rem", marginTop: "2rem" }}>
        <section>
          <h2>Live-Chat</h2>
          <div
            style={{
              background: "#161622",
              borderRadius: "0.75rem",
              padding: "1rem",
              maxHeight: "50vh",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.25)"
            }}
          >
            {messages.length === 0 ? (
              <p style={{ opacity: 0.7 }}>Noch keine Nachrichten empfangen.</p>
            ) : (
              messages.map((m, i) => (
                <div key={`${m.user}-${i}`} style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#60a5fa" }}>{m.user}</strong>
                  <span style={{ opacity: 0.8 }}>:</span> {m.message}
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2>Befehle verwalten</h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "0.75rem",
              background: "#161622",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.25)"
            }}
          >
            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span style={{ fontWeight: 600 }}>Befehlsname</span>
              <input
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="z.B. hello"
                required
                style={{
                  background: "#0f172a",
                  border: "1px solid #1f2937",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  color: "inherit"
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span style={{ fontWeight: 600 }}>Antwort</span>
              <textarea
                value={response}
                onChange={event => setResponse(event.target.value)}
                placeholder="Antwort mit {user} für den Namen"
                required
                rows={3}
                style={{
                  background: "#0f172a",
                  border: "1px solid #1f2937",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  color: "inherit",
                  resize: "vertical"
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                justifySelf: "start",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: "999px",
                padding: "0.75rem 1.5rem",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.15s ease"
              }}
            >
              Speichern
            </button>
          </form>

          <div style={{ marginTop: "1.5rem" }}>
            <h3>Aktive Befehle</h3>
            {sortedCommands.length === 0 ? (
              <p style={{ opacity: 0.7 }}>Keine Befehle angelegt.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
                {sortedCommands.map(cmd => (
                  <li
                    key={cmd.id}
                    style={{
                      background: "#161622",
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem"
                    }}
                  >
                    <div>
                      <strong style={{ color: "#fbbf24" }}>!{cmd.name}</strong>
                      <p style={{ margin: "0.5rem 0 0", opacity: 0.9 }}>{cmd.response}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(cmd.name)}
                      style={{
                        background: "transparent",
                        border: "1px solid #ef4444",
                        color: "#fca5a5",
                        borderRadius: "999px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer"
                      }}
                    >
                      Löschen
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
