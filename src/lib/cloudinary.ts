import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryReady = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryReady) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadMedia(
  fileBuffer: Buffer,
  fileName: string,
  folder = "ranjith-portfolio",
  mimeType?: string
): Promise<string> {
  // 1. If Cloudinary credentials are provided, upload to Cloudinary
  if (isCloudinaryReady) {
    try {
      return await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error("Cloudinary upload failed"));
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (err) {
      console.warn("Cloudinary upload failed, checking local or data URL fallback:", err);
    }
  }

  // 2. Try saving to public/uploads (works on local machine with writable filesystem)
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const cleanExt = path.extname(fileName) || ".jpg";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${cleanExt}`;
    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(filePath, fileBuffer);
    return `/uploads/${uniqueName}`;
  } catch (fsErr) {
    console.warn("Local disk write unavailable (expected on serverless/Vercel):", fsErr);
  }

  // 3. Resilient Data URL Fallback:
  // Converts image directly into self-contained base64 Data URL.
  // Works 100% reliably in Vercel serverless environments with ZERO disk writes and ZERO external dependencies.
  const ext = path.extname(fileName).toLowerCase().replace(".", "");
  const mime =
    mimeType ||
    (ext === "png"
      ? "image/png"
      : ext === "webp"
      ? "image/webp"
      : ext === "svg"
      ? "image/svg+xml"
      : ext === "gif"
      ? "image/gif"
      : "image/jpeg");

  return `data:${mime};base64,${fileBuffer.toString("base64")}`;
}
