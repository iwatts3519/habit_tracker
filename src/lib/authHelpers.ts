import { auth } from "@/lib/auth";
import { errorResponse } from "@/lib/apiResponse";
import type { NextResponse } from "next/server";

export async function getAuthUserId(): Promise<
  { userId: string } | { error: NextResponse }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: errorResponse("Unauthorized", 401) };
  }

  return { userId: session.user.id };
}
