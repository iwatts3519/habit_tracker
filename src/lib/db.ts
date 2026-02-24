import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "habit-tracker.db");
const SCHEMA_PATH = path.join(process.cwd(), "src", "lib", "schema.sql");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    runMigrations(db);
  }
  return db;
}

function hasColumn(
  database: Database.Database,
  table: string,
  column: string
): boolean {
  const cols = database
    .prepare(`PRAGMA table_info(${table})`)
    .all() as { name: string }[];
  return cols.some((c) => c.name === column);
}

function runMigrations(database: Database.Database): void {
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");

  const tableStatements: string[] = [];
  const indexStatements: string[] = [];

  for (const stmt of schema.split(";")) {
    const trimmed = stmt.trim();
    if (!trimmed) continue;
    if (trimmed.toUpperCase().startsWith("CREATE INDEX")) {
      indexStatements.push(trimmed + ";");
    } else {
      tableStatements.push(trimmed + ";");
    }
  }

  database.exec(tableStatements.join("\n"));

  if (!hasColumn(database, "goals", "user_id")) {
    database.exec(
      "ALTER TABLE goals ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default'"
    );
  }

  if (!hasColumn(database, "conversations", "user_id")) {
    database.exec(
      "ALTER TABLE conversations ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default'"
    );
  }

  if (!hasColumn(database, "habits", "frequency_days")) {
    database.exec(
      "ALTER TABLE habits ADD COLUMN frequency_days TEXT NOT NULL DEFAULT '[]'"
    );
  }

  database.exec(indexStatements.join("\n"));
}
