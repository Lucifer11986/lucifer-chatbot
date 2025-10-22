import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { initTwitchBot } from "./twitch.js";
import { listCommands, setCommand, deleteCommand, getCommand } from "./database.js";

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())
  : ["*"];

const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "DELETE"]
  }
});

function emitCommands() {
  io.emit("commands", listCommands());
}

app.get("/", (req, res) => {
  res.json({ status: "Lucifer Chatbot Backend running", commands: listCommands() });
});

app.get("/commands", (req, res) => {
  res.json({ commands: listCommands() });
});

app.get("/commands/:name", (req, res) => {
  const command = getCommand(req.params.name);
  if (!command) {
    return res.status(404).json({ error: "Command not found" });
  }
  res.json({ command });
});

app.post("/commands", (req, res) => {
  const { name, response } = req.body;
  if (!name || !response) {
    return res.status(400).json({ error: "name and response are required" });
  }

  const saved = setCommand(name.trim().toLowerCase(), response.trim());
  emitCommands();
  res.status(201).json({ command: saved });
});

app.delete("/commands/:name", (req, res) => {
  const result = deleteCommand(req.params.name.trim().toLowerCase());
  if (result.changes === 0) {
    return res.status(404).json({ error: "Command not found" });
  }
  emitCommands();
  res.status(204).end();
});

io.on("connection", socket => {
  console.log("Client connected");
  socket.emit("commands", listCommands());
});

const twitchBot = initTwitchBot(io, emitCommands);

const PORT = Number(process.env.PORT) || 3001;
server.listen(PORT, () => console.log(`🔥 Backend running on port ${PORT}`));

process.on("SIGINT", () => {
  twitchBot?.disconnect?.();
  server.close(() => process.exit(0));
});
