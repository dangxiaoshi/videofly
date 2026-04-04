import dotenv from "dotenv";
import crypto from "node:crypto";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const baseUrl = process.env.AI_CALLBACK_URL;
const secret = process.env.CALLBACK_HMAC_SECRET;
const provider = process.argv[2] || "apimart";
const videoUuid = process.argv[3] || `vid_smoke_${Date.now()}`;
const timestamp = Date.now().toString();

if (!baseUrl || !secret) {
  console.error("Missing AI_CALLBACK_URL or CALLBACK_HMAC_SECRET");
  process.exit(1);
}

const sig = crypto
  .createHmac("sha256", secret)
  .update(`${videoUuid}:${timestamp}`)
  .digest("hex");

const url = new URL(`${baseUrl}/${provider}`);
url.searchParams.set("videoUuid", videoUuid);
url.searchParams.set("ts", timestamp);
url.searchParams.set("sig", sig);

console.log(
  JSON.stringify(
    {
      provider,
      videoUuid,
      timestamp,
      url: url.toString(),
    },
    null,
    2
  )
);
