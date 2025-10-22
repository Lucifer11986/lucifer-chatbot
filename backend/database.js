import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultPath = path.resolve(__dirname, "chatbot.db");
const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : defaultPath;

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.prepare(`
  CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    response TEXT
  )
`).run();

export function listCommands() {
  return db.prepare("SELECT id, name, response FROM commands ORDER BY name ASC").all();
}

export function getCommand(name) {
  return db.prepare("SELECT id, name, response FROM commands WHERE name = ?").get(name);
}

export function setCommand(name, response) {
  db.prepare(
    "INSERT INTO commands (name, response) VALUES (?, ?) " +
      "ON CONFLICT(name) DO UPDATE SET response = excluded.response"
  ).run(name, response);

  return getCommand(name);
}

export function deleteCommand(name) {
  return db.prepare("DELETE FROM commands WHERE name = ?").run(name);
}
