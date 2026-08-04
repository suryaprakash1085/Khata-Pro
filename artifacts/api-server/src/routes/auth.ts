import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth, AuthPayload } from "../middlewares/auth";
import {
  LoginBody,
  LoginResponse,
  RegisterBody,
  SendOtpBody,
  VerifyOtpBody,
  GetMeResponse,
  LogoutResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// POST /auth/login — email + password for admin/staff
router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user || !user.passwordHash) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signToken({ userId: Number(user.id), role: user.role });
  res.json(LoginResponse.parse({
    token,
    user: {
      id: Number(user.id),
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      profile_image: user.profileImage,
      is_active: user.isActive,
      language_pref: user.languagePref,
      created_at: user.createdAt,
    },
  }));
});

// POST /auth/register — create a new admin/staff account with email + password
router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { name, phone, email, password } = parsed.data;

  const [existingByEmail] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existingByEmail) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }
  const [existingByPhone] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
  if (existingByPhone) {
    res.status(409).json({ error: "Phone number already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db.insert(usersTable).values({
    name,
    phone,
    email,
    passwordHash,
    role: "admin",
    languagePref: "en",
  }).returning();

  const token = signToken({ userId: Number(user.id), role: user.role });
  res.status(201).json(LoginResponse.parse({
    token,
    user: {
      id: Number(user.id),
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      profile_image: user.profileImage,
      is_active: user.isActive,
      language_pref: user.languagePref,
      created_at: user.createdAt,
    },
  }));
});

// POST /auth/send-otp
router.post("/auth/send-otp", async (req, res): Promise<void> => {
  const parsed = SendOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  // In production this would send a real OTP via SMS
  req.log.info({ phone: parsed.data.phone }, "OTP requested");
  res.json({ message: "OTP sent successfully" });
});

// POST /auth/verify-otp
router.post("/auth/verify-otp", async (req, res): Promise<void> => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { phone, otp } = parsed.data;
  // In dev mode accept otp "123456"
  if (otp !== "123456") {
    res.status(400).json({ error: "Invalid OTP" });
    return;
  }
  let [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
  if (!user) {
    // Create new user on first login
    const [newUser] = await db.insert(usersTable).values({
      name: "New User",
      phone,
      role: "owner",
    }).returning();
    user = newUser;
  }
  const token = signToken({ userId: Number(user.id), role: user.role });
  res.json({
    token,
    user: {
      id: Number(user.id),
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      profile_image: user.profileImage,
      is_active: user.isActive,
      language_pref: user.languagePref,
      created_at: user.createdAt,
    },
  });
});

// GET /auth/me
router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(GetMeResponse.parse({
    id: Number(user.id),
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    profile_image: user.profileImage,
    is_active: user.isActive,
    language_pref: user.languagePref,
    created_at: user.createdAt,
  }));
});

// POST /auth/logout
router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.json({ message: "Logged out" });
});

export default router;