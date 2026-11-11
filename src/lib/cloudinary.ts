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

export async function uploadMedia(fileBuffer: Buffer, fileName: string, folder = "ranjith-portfolio"): Promise<string> {
  // If Cloudinary is configured, upload to Cloudinary
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
      console.warn("Cloudinary upload failed, falling back to local storage:", err);
    }
  }

  // Fallback: save to public/uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const cleanExt = path.extname(fileName) || ".jpg";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${cleanExt}`;
  const filePath = path.join(uploadDir, uniqueName);

  fs.writeFileSync(filePath, fileBuffer);
  return `/uploads/${uniqueName}`;
}

