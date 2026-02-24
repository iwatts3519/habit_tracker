import { auth } from "@/lib/auth";
import { errorResponse } from "@/lib/apiResponse";
import type { NextResponse } from "next/server";

export async function getAuthUserId(): Promise<
  { userId: string } | { error: NextResponse }
> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: errorResponse("Unauthorized", 401) };
    }

    return { userId: session.user.id };
  } catch (err) {
    console.error("Auth error:", err);
    return { error: errorResponse("Authentication failed", 401) };
  }
}
