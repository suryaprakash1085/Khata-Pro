// artifacts/api-server/src/routes/customer-uploads.ts
//
// Customer photo/video upload (used for return evidence).
// Client sends multipart/form-data with a single "file" field; the server
// stores it in Supabase Storage and returns a public URL.
//
// Setup:
//   1) pnpm add multer @supabase/supabase-js         (in artifacts/api-server)
//      pnpm add -D @types/multer
//   2) Supabase dashboard -> Storage -> New bucket "order-returns" (Public)
//   3) .env of api-server:
//        SUPABASE_URL=https://<project>.supabase.co
//        SUPABASE_SERVICE_ROLE_KEY=<service role key>   (server only, never in the app)
//        SUPABASE_RETURNS_BUCKET=order-returns          (optional, this is the default)

import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import crypto from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireCustomerAuth } from "../middlewares/customerAuth"; // adjust filename if different

const router: IRouter = Router();

const BUCKET = process.env.SUPABASE_RETURNS_BUCKET ?? "order-returns";
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
  "video/x-matroska": "mkv",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VIDEO_BYTES, files: 1 },
});

let client: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

// POST /customers/me/uploads   (multipart, field name: "file")
router.post("/customers/me/uploads", requireCustomerAuth, (req: Request, res: Response): void => {
  upload.single("file")(req, res, async (err: any) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "File is too large (photos up to 8 MB, videos up to 50 MB)." });
      } else {
        res.status(400).json({ error: err.message ?? "Upload failed" });
      }
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file received. Send it in the 'file' field." });
      return;
    }

    const isPhoto = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    if (!isPhoto && !isVideo) {
      res.status(400).json({ error: "Only photos and videos can be uploaded." });
      return;
    }
    if (isPhoto && file.size > MAX_PHOTO_BYTES) {
      res.status(413).json({ error: "Photo is too large (max 8 MB)." });
      return;
    }

    const { customerId } = (req as any).customer as { customerId: number };
    const ext = EXT_BY_MIME[file.mimetype] ?? (isPhoto ? "jpg" : "mp4");
    const path = `returns/${customerId}/${crypto.randomUUID()}.${ext}`;

    try {
      const supabase = getSupabase();
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

      if (error) {
        console.error("[uploads] supabase upload failed:", error.message);
        res.status(502).json({ error: "Could not store the file. Please try again." });
        return;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      res.status(201).json({ type: isPhoto ? "photo" : "video", url: data.publicUrl });
    } catch (e: any) {
      console.error("[uploads] unexpected error:", e?.message ?? e);
      res.status(500).json({ error: "Upload is not configured. Contact support." });
    }
  });
});

export default router;