/**
 * twoFactor.ts
 * -----------------------------------------------------------------------
 * OTP SMS sending + verification via 2Factor.in.
 *
 * SETUP:
 *   1. Sign up at https://2factor.in, get your API key from the dashboard.
 *   2. Add to api-server's .env:
 *        TWO_FACTOR_API_KEY=your_api_key_here
 *
 * Unlike MSG91, 2Factor GENERATES the OTP for you and manages verification
 * server-side. You get back a `session_id` from AUTOGEN, and pass that +
 * the user's entered code to VERIFY. There's no OTP value to store/compare
 * on our side anymore — just the session_id, temporarily, between send and verify.
 * -----------------------------------------------------------------------
 */

const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY ?? "";
const TWO_FACTOR_BASE_URL = "https://2factor.in/API/V1";

export class SmsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmsError";
  }
}

// Temporary in-memory store: normalizedPhone -> { sessionId, expiresAt }
// NOTE: this resets on server restart and won't work across multiple
// instances. Fine for now since there was no persistence before either,
// but move this to a DB table (or Redis) before scaling horizontally.
const otpSessions = new Map<string, { sessionId: string; expiresAt: number }>();

const OTP_SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Triggers 2Factor to generate + send an OTP to a 10-digit Indian phone number.
 * Stores the returned session_id against the phone for later verification.
 */
export async function sendOtpSms(phone: string): Promise<void> {
  if (!TWO_FACTOR_API_KEY) {
    // Dev fallback so local testing doesn't require a real 2Factor account yet.
    console.warn(`[sms] TWO_FACTOR_API_KEY not set — would have sent OTP to ${phone}`);
    otpSessions.set(phone, { sessionId: "DEV-SESSION", expiresAt: Date.now() + OTP_SESSION_TTL_MS });
    return;
  }

  const url = `${TWO_FACTOR_BASE_URL}/${TWO_FACTOR_API_KEY}/SMS/+91${phone}/AUTOGEN`;
  const res = await fetch(url, { method: "GET" });
  const body = (await res.json().catch(() => ({}))) as { Status?: string; Details?: string };

  if (!res.ok || body.Status !== "Success" || !body.Details) {
    throw new SmsError(`2Factor send failed: ${JSON.stringify(body)}`);
  }

  otpSessions.set(phone, { sessionId: body.Details, expiresAt: Date.now() + OTP_SESSION_TTL_MS });
}

/**
 * Verifies the OTP entered by the user against the stored session for that phone.
 * Returns true if matched, false otherwise (invalid, expired, or no session found).
 */
export async function verifyOtpSms(phone: string, otp: string): Promise<boolean> {
  const session = otpSessions.get(phone);
  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    otpSessions.delete(phone);
    return false;
  }

  if (!TWO_FACTOR_API_KEY) {
    // Dev fallback — accept a fixed code when no real API key is configured.
    const ok = otp === "123456";
    if (ok) otpSessions.delete(phone);
    return ok;
  }

  const url = `${TWO_FACTOR_BASE_URL}/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${session.sessionId}/${otp}`;
  const res = await fetch(url, { method: "GET" });
  const body = (await res.json().catch(() => ({}))) as { Status?: string; Details?: string };

  const ok = res.ok && body.Status === "Success";
  if (ok) otpSessions.delete(phone); // one-time use
  return ok;
}

/**
 * Sends a PRE-GENERATED OTP via 2Factor SMS — used when the caller (not
 * 2Factor) owns the OTP value, hashing, expiry and verification logic.
 * E.g. delivery confirmation OTPs, where we bcrypt-hash and store our own
 * code in the DB. Unlike sendOtpSms()/verifyOtpSms() (2Factor's AUTOGEN +
 * session_id flow, used for driver login), this is fire-and-forget delivery only.
 */
export async function sendCustomOtpSms(phone: string, otp: string): Promise<void> {
  if (!TWO_FACTOR_API_KEY) {
    console.warn(`[sms] TWO_FACTOR_API_KEY not set — would have sent OTP ${otp} to ${phone}`);
    return;
  }

  const url = `${TWO_FACTOR_BASE_URL}/${TWO_FACTOR_API_KEY}/SMS/${phone}/${otp}`;
  const res = await fetch(url, { method: "GET" });
  const body = (await res.json().catch(() => ({}))) as { Status?: string };

  if (!res.ok || body.Status !== "Success") {
    throw new SmsError(`2Factor custom OTP send failed: ${JSON.stringify(body)}`);
  }
}
