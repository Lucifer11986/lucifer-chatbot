import tmi from "tmi.js";
import { db } from "./database.js";

export function initTwitchBot(io) {
  const client = new tmi.Client({
    options: { debug: true },
    connection: { reconnect: true },
    identity: {
      username: process.env.TWITCH_BOT_USERNAME || "LuciferBot",
      password: process.env.TWITCH_BOT_TOKEN || "oauth:your_token_here"
    },
    channels: [process.env.TWITCH_CHANNEL || "lucifer11986"]
  });

  client.connect().catch(console.error);

  client.on("message", (channel, user, message, self) => {
    if (self) return;

    console.log(`[${channel}] ${user["display-name"]}: ${message}`);

    if (message.startsWith("!hello")) {
      client.say(channel, `👋 Hey ${user["display-name"]}!`);
    }

    io.emit("chatMessage", { user: user["display-name"], message });
  });

  return client;
}
