import { auth, type User } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { ApiError } from "./error";

/**
 * Get authenticated user from request headers
 * Returns null if not authenticated
 */
export async function getAuthUser(request: Request): Promise<User | null> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return null;
  }

  return session.user as User;
}

/**
 * Require authentication - throws ApiError if not authenticated
 *
 * OWNER_MODE: when OWNER_MODE=true, bypass session check and use OWNER_EMAIL account.
 * Useful for personal/self-hosted deployments where login is not desired.
 */
export async function requireAuth(request: Request): Promise<User> {
  if (process.env.OWNER_MODE === "true" && process.env.OWNER_EMAIL) {
    const [ownerUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, process.env.OWNER_EMAIL))
      .limit(1);
    if (ownerUser) {
      return ownerUser as User;
    }
  }

  const user = await getAuthUser(request);
  if (!user) {
    throw new ApiError("Unauthorized", 401);
  }
  return user;
}

/**
 * Require admin role - throws ApiError if not admin
 */
export async function requireAdmin(request: Request): Promise<User> {
  const user = await requireAuth(request);
  if (!user.isAdmin) {
    throw new ApiError("Forbidden", 403);
  }
  return user;
}
