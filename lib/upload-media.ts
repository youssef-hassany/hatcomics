import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2Client";
import path from "path";
import sharp from "sharp";

// Configuration for image compression
const COMPRESSION_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 85,
  maxFileSizeMB: 2, // Target max file size after compression
};

async function compressImage(
  buffer: Buffer,
  originalType: string
): Promise<{ buffer: Buffer; contentType: string }> {
  try {
    let sharpInstance = sharp(buffer);

    // Get image metadata to check dimensions
    const metadata = await sharpInstance.metadata();

    // Resize if image is too large
    if (
      (metadata.width && metadata.width > COMPRESSION_CONFIG.maxWidth) ||
      (metadata.height && metadata.height > COMPRESSION_CONFIG.maxHeight)
    ) {
      sharpInstance = sharpInstance.resize(
        COMPRESSION_CONFIG.maxWidth,
        COMPRESSION_CONFIG.maxHeight,
        { fit: "inside", withoutEnlargement: true }
      );
    }

    // Convert and compress based on original type or default to WebP for best compression
    let compressedBuffer: Buffer;
    let contentType: string;

    if (originalType.includes("png")) {
      // For PNG, try WebP first (better compression), fallback to PNG
      compressedBuffer = await sharpInstance
        .webp({ quality: COMPRESSION_CONFIG.quality, effort: 6 })
        .toBuffer();
      contentType = "image/webp";

      // If WebP is still too large, try PNG with compression
      if (
        compressedBuffer.length >
        COMPRESSION_CONFIG.maxFileSizeMB * 1024 * 1024
      ) {
        compressedBuffer = await sharp(buffer)
          .resize(COMPRESSION_CONFIG.maxWidth, COMPRESSION_CONFIG.maxHeight, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .png({ quality: COMPRESSION_CONFIG.quality, compressionLevel: 9 })
          .toBuffer();
        contentType = "image/png";
      }
    } else {
      // For JPEG and other formats, use WebP for best compression
      compressedBuffer = await sharpInstance
        .webp({ quality: COMPRESSION_CONFIG.quality, effort: 6 })
        .toBuffer();
      contentType = "image/webp";

      // If WebP is still too large, try JPEG
      if (
        compressedBuffer.length >
        COMPRESSION_CONFIG.maxFileSizeMB * 1024 * 1024
      ) {
        compressedBuffer = await sharp(buffer)
          .resize(COMPRESSION_CONFIG.maxWidth, COMPRESSION_CONFIG.maxHeight, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: Math.max(60, COMPRESSION_CONFIG.quality - 20) })
          .toBuffer();
        contentType = "image/jpeg";
      }
    }

    console.log(
      `Image compressed: ${buffer.length} bytes → ${
        compressedBuffer.length
      } bytes (${((1 - compressedBuffer.length / buffer.length) * 100).toFixed(
        1
      )}% reduction)`
    );

    return { buffer: compressedBuffer, contentType };
  } catch (error) {
    console.error("Image compression failed, using original:", error);
    // Fallback to original if compression fails
    return { buffer, contentType: originalType };
  }
}

export async function uploadImageToR2(
  req: Request,
  folder: string
): Promise<{ fileUrl: string }> {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file uploaded");

  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  // Check original file size (optional: reject if too large before processing)
  const maxOriginalSizeMB = 50; // 50MB max original size
  if (file.size > maxOriginalSizeMB * 1024 * 1024) {
    throw new Error(`File too large. Maximum size is ${maxOriginalSizeMB}MB`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const originalBuffer = Buffer.from(arrayBuffer);

  // Compress the image
  const { buffer: compressedBuffer, contentType } = await compressImage(
    originalBuffer,
    file.type
  );

  // Generate a unique filename
  const timestamp = Date.now();
  const originalName = file.name || "upload";
  const baseName = path.basename(originalName, path.extname(originalName));

  // Use appropriate extension based on final content type
  let ext = ".webp"; // Default to webp
  if (contentType === "image/jpeg") ext = ".jpg";
  else if (contentType === "image/png") ext = ".png";

  const fileName = `${baseName}-${timestamp}${ext}`;
  const key = `${folder}/${fileName}`;

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: compressedBuffer,
    ContentType: contentType,
    // Optional: Add cache control headers
    CacheControl: "public, max-age=31536000", // 1 year cache
  });

  await r2.send(command);

  // Construct the public URL
  const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  return { fileUrl };
}

export async function uploadImageToR2FromServer(
  file: File,
  folder: string
): Promise<{ fileUrl: string }> {
  if (!file) throw new Error("No file uploaded");

  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  // Check original file size
  const maxOriginalSizeMB = 50; // 50MB max original size
  if (file.size > maxOriginalSizeMB * 1024 * 1024) {
    throw new Error(`File too large. Maximum size is ${maxOriginalSizeMB}MB`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const originalBuffer = Buffer.from(arrayBuffer);

  // Compress the image
  const { buffer: compressedBuffer, contentType } = await compressImage(
    originalBuffer,
    file.type
  );

  // Generate a unique filename
  const timestamp = Date.now();
  const originalName = file.name || "upload";
  const baseName = path.basename(originalName, path.extname(originalName));

  // Use appropriate extension based on final content type
  let ext = ".webp"; // Default to webp
  if (contentType === "image/jpeg") ext = ".jpg";
  else if (contentType === "image/png") ext = ".png";

  const fileName = `${baseName}-${timestamp}${ext}`;
  const key = `${folder}/${fileName}`;

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: compressedBuffer,
    ContentType: contentType,
    // Optional: Add cache control headers
    CacheControl: "public, max-age=31536000", // 1 year cache
  });

  await r2.send(command);

  // Construct the public URL
  const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  return { fileUrl };
}
