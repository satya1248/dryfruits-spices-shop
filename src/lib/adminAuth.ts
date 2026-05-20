import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { AdminSession } from "@/lib/models/AdminSession";
import { AdminUser } from "@/lib/models/AdminUser";

const COOKIE_NAME = "admin_session";
const SESSION_DAYS = 7;

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function ensureDefaultAdminUser() {
  // Creates a default admin user if none exists.
  // Uses env vars so you don't need an extra setup UI.
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) return;

  await connectDB();
  const existing = await AdminUser.findOne().lean();
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({ email, passwordHash, isActive: true });
}

export async function loginAdmin(email: string, password: string) {
  await ensureDefaultAdminUser();
  await connectDB();

  const user = await AdminUser.findOne({ email: email.trim().toLowerCase(), isActive: true });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new Error("Invalid email or password");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await AdminSession.create({
    adminUser: user._id,
    tokenHash,
    expiresAt,
  });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return { email: user.email };
}

export async function logoutAdmin() {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return;

  await connectDB();
  await AdminSession.deleteOne({ tokenHash: sha256(token) });

  c.set(COOKIE_NAME, "", { httpOnly: true, path: "/", expires: new Date(0) });
}

export async function requireAdmin() {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;

  if (!token) return null;

  await connectDB();
  const session = await AdminSession.findOne({
    tokenHash: sha256(token),
    expiresAt: { $gt: new Date() },
  }).populate("adminUser");

  if (!session) return null;

  const admin = session.adminUser as unknown as { _id: unknown; email: string; isActive: boolean };
  if (!admin?.isActive) return null;

  return { email: admin.email };
}

