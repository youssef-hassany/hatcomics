import fs from "fs";
import path from "path";

export async function uploadImageToLocal(
  req: Request,
  folder: string
): Promise<{ fileUrl: string }> {
  const uploadDir = path.join(process.cwd(), "public/uploads", folder);
  fs.mkdirSync(uploadDir, { recursive: true });

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
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  const fileUrl = `/uploads/${folder}/${fileName}`;
  return { fileUrl };
}
