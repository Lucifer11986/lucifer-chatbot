const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const isDev = !app.isPackaged;
let backendProcess;
let isQuitting = false;

function resolveBackendPaths() {
  const backendDir = isDev
    ? path.resolve(__dirname, "../backend")
    : path.resolve(process.resourcesPath, "backend");
  const entryPoint = path.join(backendDir, "server.js");

  if (!fs.existsSync(entryPoint)) {
    throw new Error(`Backend entry point not found at ${entryPoint}`);
  }

  return { backendDir, entryPoint };
}

function startBackend() {
  try {
    const { backendDir, entryPoint } = resolveBackendPaths();

    const env = {
      ...process.env,
      NODE_ENV: isDev ? "development" : "production",
      ELECTRON_RUN_AS_NODE: "1",
      PORT: process.env.PORT || "3001"
    };

    backendProcess = spawn(process.execPath, [entryPoint], {
      cwd: backendDir,
      env,
      stdio: "pipe"
    });

    backendProcess.stdout?.on("data", data => {
      const message = data.toString().trim();
      if (message) {
        console.log(`[backend] ${message}`);
      }
    });

    backendProcess.stderr?.on("data", data => {
      const message = data.toString().trim();
      if (message) {
        console.error(`[backend] ${message}`);
      }
    });

    backendProcess.on("exit", code => {
      backendProcess = undefined;
      if (!isQuitting && code !== 0) {
        dialog.showErrorBox(
          "Backend gestoppt",
          `Der Backend-Prozess wurde unerwartet beendet (Code ${code}). Bitte prüfe die Logs.`
        );
      }
    });

    backendProcess.on("error", error => {
      console.error("Fehler beim Start des Backends", error);
      dialog.showErrorBox(
        "Backend konnte nicht gestartet werden",
        `Der Backend-Prozess konnte nicht gestartet werden.\n${error.message}`
      );
    });
  } catch (error) {
    console.error("Backend-Initialisierung fehlgeschlagen", error);
    dialog.showErrorBox(
      "Backend fehlt",
      "Der Backend-Ordner konnte nicht gefunden werden. Stelle sicher, dass das Projekt vollständig gebaut wurde."
    );
  }
}

function resolveFrontendPath() {
  if (isDev) {
    return process.env.ELECTRON_START_URL || "http://localhost:5173";
  }

  const packagedIndex = path.join(process.resourcesPath, "frontend", "dist", "index.html");

  if (fs.existsSync(packagedIndex)) {
    return packagedIndex;
  }

=======
=======
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
  startBackend();
 codex/update-project-structure-and-dependencies



  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  isQuitting = true;
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill("SIGTERM");
  }
});

