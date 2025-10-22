import Database from "better-sqlite3";

export const db = new Database("chatbot.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    response TEXT
  )
`).run();

export function getCommand(name) {
  return db.prepare("SELECT response FROM commands WHERE name = ?").get(name);
}

export function setCommand(name, response) {
  db.prepare("INSERT OR REPLACE INTO commands (name, response) VALUES (?, ?)").run(name, response);
}
