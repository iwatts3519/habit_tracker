import { getDb } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const db = getDb();
    const row = db.prepare("SELECT 1 as ok").get() as { ok: number };

    return jsonResponse({
      status: "healthy",
      database: row.ok === 1 ? "connected" : "error",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return errorResponse("Database connection failed", 503);
  }
}
