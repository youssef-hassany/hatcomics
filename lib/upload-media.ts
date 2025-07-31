import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2Client";
import path from "path";

export async function uploadImageToR2(
  req: Request,
  folder: string
): Promise<{ fileUrl: string }> {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file uploaded");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate a unique filename
  const timestamp = Date.now();
  const originalName = file.name || "upload";
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const fileName = `${base}-${timestamp}${ext}`;
  const key = `${folder}/${fileName}`;

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: file.type || "application/octet-stream",
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

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate a unique filename
  const timestamp = Date.now();
  const originalName = file.name || "upload";
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const fileName = `${base}-${timestamp}${ext}`;
  const key = `${folder}/${fileName}`;

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: file.type || "application/octet-stream",
  });

  await r2.send(command);

  // Construct the public URL
  const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  return { fileUrl };
}
