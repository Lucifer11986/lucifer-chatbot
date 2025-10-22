# Lucifer Chatbot

Ein moderner, modularer Twitch-Chatbot – eine Mischung aus der Einfachheit von Streamlabs Chatbot und der Mächtigkeit von Streamer.bot. Dieses Repository ist in drei Bereiche unterteilt:

```
lucifer-chatbot/
├─ backend/      # REST & Socket.IO API, Twitch-Bot, SQLite Datenbank
├─ frontend/     # Vite + React Dashboard zur Verwaltung der Befehle
├─ electron/     # Elektronische Desktop-Hülle für das Dashboard
└─ README.md
```

## 🚀 Schnellstart

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Der Backend-Server lauscht standardmäßig auf `http://localhost:3001` und stellt eine REST-API sowie einen Socket.IO-Endpunkt bereit. Befehle werden in einer lokalen `chatbot.db` (SQLite) gespeichert.

### 2. Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
Das Dashboard ist anschließend unter `http://localhost:5173` erreichbar und verbindet sich automatisch mit dem Backend. Über die Oberfläche kannst du Befehle anlegen, aktualisieren und löschen.

### 3. Electron (optional)
```bash
cd electron
npm install
npm run dev
```
Die Electron-Shell lädt das gebaute Frontend (`frontend/dist`). Führe zuvor `npm run build` im Frontend-Ordner aus. Während der Entwicklung kannst du auch das Vite-Dashboard separat im Browser nutzen.

## 🔧 Umgebungsvariablen
Lege im jeweiligen Projektordner eine `.env`-Datei an (siehe `.env.example`, wenn vorhanden):

| Variable | Beschreibung | Standard |
| --- | --- | --- |
| `PORT` | Port des Backend-Servers | `3001` |
| `CORS_ORIGIN` | Erlaubte Ursprünge (kommasepariert) | `*` |
| `TWITCH_CHANNEL` | Twitch-Kanal, den der Bot betritt | `lucifer11986` |
| `TWITCH_BOT_USERNAME` | Benutzername des Bots | `LuciferBot` |
| `TWITCH_BOT_TOKEN` | OAuth-Token im Format `oauth:xxxxxxxx` | – |
| `DB_PATH` | Pfad zur SQLite-Datei | `backend/chatbot.db` |
| `VITE_BACKEND_URL` | (Frontend) URL zum Backend | `http://localhost:3001` |

## 🌐 REST & Socket.IO
- `GET /commands` – Alle Befehle
- `GET /commands/:name` – Einzelnen Befehl abrufen
- `POST /commands` – `{ "name": "hello", "response": "Hallo {user}!" }`
- `DELETE /commands/:name` – Befehl löschen

Der Twitch-Bot reagiert auf gespeicherte Befehle (`!hello`) sowie auf `!setcommand name=Antwort`, um Befehle direkt aus dem Chat heraus anzulegen/zu aktualisieren.

## 🛠️ Entwicklungstipps
- Node.js ≥ 18 wird empfohlen.
- Datenbankdateien und `node_modules` sind per `.gitignore` ausgenommen.
- Nach Änderungen am Frontend `npm run build` ausführen, bevor du Electron packst (`npm run build` im electron-Ordner benutzt `electron-builder`).

Viel Spaß beim Experimentieren mit dem Lucifer Chatbot! 👾
