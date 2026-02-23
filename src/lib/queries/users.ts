import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export type SafeUser = Omit<User, "password_hash">;

export function getUserByEmail(email: string): User | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | User
    | undefined;
}

export function getUserById(id: string): User | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | User
    | undefined;
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
}): Promise<SafeUser> {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(data.password, 12);

  db.prepare(
    `INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, data.email.toLowerCase(), data.name, passwordHash, now, now);

  const user = getUserById(id)!;
  return toSafeUser(user);
}

export async function verifyPassword(
  user: User,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash);
}

export function toSafeUser(user: User): SafeUser {
  const { password_hash: _, ...safe } = user;
  return safe;
}
