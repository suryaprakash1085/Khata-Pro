import { initializeApp, cert, getApps, getApp, type App } from "firebase-admin/app";

let app: App | null = null;

export function getFirebaseApp(): App | null {
  if (app) return app;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.warn("[firebase] FIREBASE_SERVICE_ACCOUNT_JSON is not set - push disabled");
    return null;
  }

  try {
    // Render-la base64 text-ah vachirukkom; plain JSON irundhaalum work aagum
    const json = raw.trim().startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");

    app = getApps().length
      ? getApp()
      : initializeApp({ credential: cert(JSON.parse(json)) });

    return app;
  } catch (err) {
    console.error("[firebase] Failed to initialise Firebase Admin:", err);
    return null;
  }
}