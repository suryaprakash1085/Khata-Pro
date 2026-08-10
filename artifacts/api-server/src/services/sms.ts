/**
 * sms.ts
 * -----------------------------------------------------------------------
 * OTP SMS sending via MSG91.
 *
 * SETUP:
 *   1. Sign up at https://msg91.com, get your Auth Key from the dashboard.
 *   2. Add to api-server's .env:
 *        MSG91_AUTH_KEY=your_auth_key_here
 *        MSG91_SENDER_ID=your_6_char_sender_id   (MSG91 assigns/lets you pick one)
 *        MSG91_OTP_TEMPLATE_ID=your_dlt_template_id  (created in MSG91 dashboard,
 *                                                      required for India DLT compliance)
 *   3. Your OTP template text on MSG91's dashboard should contain a `##OTP##`
 *      placeholder, e.g.: "Your Green Cart driver login OTP is ##OTP##. Valid for 5 min."
 *
 * If you switch providers later (Fast2SMS, Twilio, etc.), only this file
 * needs to change — callers just use `sendOtpSms(phone, otp)`.
 * -----------------------------------------------------------------------
 */

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY ?? "";
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID ?? "";
const MSG91_OTP_TEMPLATE_ID = process.env.MSG91_OTP_TEMPLATE_ID ?? "";

export class SmsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmsError";
  }
}

/**
 * Sends a 6-digit OTP to an Indian phone number via MSG91.
 * `phone` should be the 10-digit number (no country code) — we prefix 91.
 */
export async function sendOtpSms(phone: string, otp: string): Promise<void> {
  if (!MSG91_AUTH_KEY) {
    // Dev fallback so local testing doesn't require a real MSG91 account yet.
    console.warn(`[sms] MSG91_AUTH_KEY not set — would have sent OTP ${otp} to ${phone}`);
    return;
  }

  const url = "https://control.msg91.com/api/v5/otp";
  const params = new URLSearchParams({
    authkey: MSG91_AUTH_KEY,
    mobile: `91${phone}`,
    otp,
    sender: MSG91_SENDER_ID,
    template_id: MSG91_OTP_TEMPLATE_ID,
  });

  const res = await fetch(`${url}?${params.toString()}`, { method: "POST" });
  const body = await res.json().catch(() => ({}));

  if (!res.ok || (body as any).type === "error") {
    throw new SmsError(`MSG91 send failed: ${JSON.stringify(body)}`);
  }
}

export function generateOtp(): string {
  // !! TESTING ONLY — fixed OTP so you can test the login flow without
  // waiting for real SMS / MSG91 setup. Every driver login will accept "12345".
  // Before going live, delete this line and uncomment the real one below.
  return "12345";

  // return Math.floor(100000 + Math.random() * 900000).toString();
}