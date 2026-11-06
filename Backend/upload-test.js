import "dotenv/config";
import crypto from "crypto";

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

const timestamp = Math.floor(Date.now() / 1000);
const signature = crypto
  .createHash("sha1")
  .update(`timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
  .digest("hex");

const form = new FormData();
form.append("file", "https://res.cloudinary.com/demo/image/upload/sample.jpg");
form.append("api_key", CLOUDINARY_API_KEY);
form.append("timestamp", String(timestamp));
form.append("signature", signature);

const res = await fetch(
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
  { method: "POST", body: form }
);

console.log("Status:", res.status);
console.log("X-Cld-Error:", res.headers.get("x-cld-error"));
console.log((await res.text()).slice(0, 400));