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
Die Electron-Shell startet automatisch das Node.js-Backend im Hintergrund und lädt im Entwicklungsmodus das Vite-Frontend unter `http://localhost:5173`. Während der Entwicklung kannst du auch das Vite-Dashboard separat im Browser nutzen.

## 💾 Windows-Installer (.exe) bauen
1. Stelle sicher, dass alle Abhängigkeiten installiert sind:
   ```bash
   npm --prefix backend install
   npm --prefix frontend install
   npm --prefix electron install
   ```
2. Erzeuge anschließend den Windows-Installer:
   ```bash
   npm --prefix electron run build:win
   ```

Der Befehl kompiliert das React-Frontend, installiert die Backend-Abhängigkeiten ohne Dev-Dependencies und verpackt alles mit `electron-builder` zu einer `.exe` (NSIS-Installer). Die Ausgabe findest du im Ordner `electron/dist`. Beim Start der Anwendung wird der Backend-Server automatisch mitgestartet und beim Beenden sauber beendet.

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
- Nach Änderungen am Frontend erstellt `npm --prefix electron run build:win` automatisch ein frisches Build. Für ein manuelles Frontend-Build genügt `npm --prefix frontend run build`.

Viel Spaß beim Experimentieren mit dem Lucifer Chatbot! 👾
