import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_creative_portfolio_jwt_key_ranjith_2026_xyz";
const COOKIE_NAME = "admin_token";

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getAdminFromCookies(): TokenPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function getAdminFromRequest(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyAdminToken(token);
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    return verifyAdminToken(token);
  }

  return null;
}

