// services/callMasking.ts
//
// Masked calling via Exotel's Connect API. Flow:
//   1. Driver taps "Call Customer" in the app.
//   2. App calls our backend: POST /deliveries/:id/call
//   3. Backend asks Exotel to ring the DRIVER's phone first (using their
//      own registered number — no dialing UI needed on the driver's side).
//   4. When the driver picks up, Exotel automatically dials the CUSTOMER
//      and bridges both legs together.
//   5. Both sides see Exotel's virtual "Exophone" number on their caller ID
//      — never each other's real number.
//
// This means the customer's phone digits never have to leave the server,
// which is exactly what you want for the "driver shouldn't see the number"
// requirement — much stronger than just hiding it in the UI.
//
// Docs: https://developer.exotel.com/api/make-a-call-connect-two-parties
//
// Required env vars:
//   EXOTEL_SID        — your Exotel account SID
//   EXOTEL_API_KEY     — API key (Basic Auth username)
//   EXOTEL_API_TOKEN   — API token (Basic Auth password)
//   EXOTEL_CALLER_ID   — your purchased Exophone (virtual number), e.g. 08047xxxxx

const EXOTEL_SID = process.env.EXOTEL_SID ?? "";
const EXOTEL_API_KEY = process.env.EXOTEL_API_KEY ?? "";
const EXOTEL_API_TOKEN = process.env.EXOTEL_API_TOKEN ?? "";
const EXOTEL_CALLER_ID = process.env.EXOTEL_CALLER_ID ?? "";

export class CallMaskingConfigError extends Error {}
export class CallMaskingProviderError extends Error {}

function assertConfigured() {
  if (!EXOTEL_SID || !EXOTEL_API_KEY || !EXOTEL_API_TOKEN || !EXOTEL_CALLER_ID) {
    throw new CallMaskingConfigError(
      "Exotel is not configured. Set EXOTEL_SID, EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_CALLER_ID."
    );
  }
}

// Exotel expects 10-digit Indian numbers or E.164 — normalise loosely here.
// Adjust if your customer/driver numbers are stored in a different format.
function normalisePhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length === 10) return `0${digits}`; // Exotel commonly wants a leading 0 for domestic numbers
  return digits;
}

export interface MaskedCallResult {
  callSid: string | null;
  status: string | null;
  raw: any;
}

export async function initiateMaskedCall(params: {
  driverPhone: string;
  customerPhone: string;
  deliveryId: number;
}): Promise<MaskedCallResult> {
  assertConfigured();

  const { driverPhone, customerPhone, deliveryId } = params;

    const url = `https://api.exotel.com/v1/Accounts/${EXOTEL_SID}/Calls/connect.json`;

  const body = new URLSearchParams({
    From: normalisePhone(driverPhone), // rung first
    To: normalisePhone(customerPhone), // bridged in after driver answers
    CallerId: EXOTEL_CALLER_ID, // virtual number shown on both sides
    CallType: "trans",
    TimeLimit: "1800", // 30 min hard cap per call
    TimeOut: "30", // seconds to wait for driver to pick up
    CustomField: `delivery:${deliveryId}`,
  });

  const basicAuth = Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${basicAuth}`,
    },
    body: body.toString(),
  });

  const json: any = await res.json().catch(() => null);

  if (!res.ok) {
    throw new CallMaskingProviderError(
      json?.RestException?.Message ?? `Exotel call failed with status ${res.status}`
    );
  }

  return {
    callSid: json?.Call?.Sid ?? null,
    status: json?.Call?.Status ?? null,
    raw: json,
  };
}