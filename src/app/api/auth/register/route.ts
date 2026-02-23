import { NextRequest } from "next/server";
import { z } from "zod";
import { getUserByEmail, createUser } from "@/lib/queries/users";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = parseBody(registerSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const existing = getUserByEmail(parsed.data.email.toLowerCase());
  if (existing) {
    return errorResponse("An account with this email already exists", 409);
  }

  const user = await createUser(parsed.data);
  return jsonResponse(
    { id: user.id, email: user.email, name: user.name },
    201
  );
}
