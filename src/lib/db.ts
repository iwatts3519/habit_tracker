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
  database.exec(schema);

  // Add user_id to existing goals table if missing
  if (!hasColumn(database, "goals", "user_id")) {
    database.exec(
      "ALTER TABLE goals ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default'"
    );
    database.exec("CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id)");
  }

  // Add user_id to existing conversations table if missing
  if (!hasColumn(database, "conversations", "user_id")) {
    database.exec(
      "ALTER TABLE conversations ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default'"
    );
    database.exec(
      "CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)"
    );
  }
}
