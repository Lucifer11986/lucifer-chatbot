const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  version: "1.0.0",
  name: "Lucifer Chatbot"
});
