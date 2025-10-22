import tmi from "tmi.js";
import { getCommand, setCommand } from "./database.js";

export function initTwitchBot(io, notifyCommandChange) {
  const client = new tmi.Client({
    options: { debug: process.env.NODE_ENV !== "production" },
    connection: { reconnect: true, secure: true },
    identity: {
      username: process.env.TWITCH_BOT_USERNAME || "LuciferBot",
      password: process.env.TWITCH_BOT_TOKEN || "oauth:your_token_here"
    },
    channels: [process.env.TWITCH_CHANNEL || "lucifer11986"]
  });

  client.connect().catch(console.error);

  client.on("message", async (channel, userstate, message, self) => {
    if (self) return;

    const username = userstate["display-name"] || userstate.username;
    const trimmed = message.trim();
    console.log(`[${channel}] ${username}: ${trimmed}`);

    if (!trimmed.startsWith("!")) {
      io.emit("chatMessage", { user: username, message: trimmed });
      return;
    }

    const [commandName, ...args] = trimmed.slice(1).split(/\s+/);
    const payload = args.join(" ");

    if (commandName === "setcommand" && payload.includes("=")) {
      const [name, ...rest] = payload.split("=");
      const response = rest.join("=").trim();
      if (name && response) {
        const saved = setCommand(name.trim().toLowerCase(), response);
        notifyCommandChange?.();
        client.say(channel, `✅ Befehl !${saved.name} gespeichert.`);
      }
      return;
    }

    const command = getCommand(commandName.trim().toLowerCase());
    if (command?.response) {
      client.say(channel, command.response.replace(/{user}/gi, username));
    }

    io.emit("chatMessage", { user: username, message: trimmed });
  });

  return client;
}
