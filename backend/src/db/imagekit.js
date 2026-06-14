import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";
dotenv.config();
// console.log("Initializing ImageKit with config:", {
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? "****" : "MISSING",
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;