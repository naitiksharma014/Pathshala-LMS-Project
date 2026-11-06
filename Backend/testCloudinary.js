
const cloudName = process.env.CLOUDINARY_NAME;
const response = await fetch(
  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  { method: "POST" }
);

console.log("Status:", response.status);
console.log("X-Cld-Error:", response.headers.get("x-cld-error"));
console.log("Response:", (await response.text()).slice(0, 1000));
