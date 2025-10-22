import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { initTwitchBot } from "./twitch.js";
import { db } from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  res.json({ status: "Lucifer Chatbot Backend running" });
});

io.on("connection", socket => {
  console.log("Client connected");
});

initTwitchBot(io);

const PORT = 3001;
server.listen(PORT, () => console.log(`🔥 Backend running on port ${PORT}`));
