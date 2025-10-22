const { app, BrowserWindow } = require("electron");
const path = require("path");

function resolveFrontendPath() {
  if (!app.isPackaged) {
    return process.env.ELECTRON_START_URL || "http://localhost:5173";
  }

  return path.join(__dirname, "../frontend/dist/index.html");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    },
    backgroundColor: "#111"
  });

  const target = resolveFrontendPath();
  if (target.startsWith("http")) {
    win.loadURL(target);
  } else {
    win.loadFile(target);
  }

  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
