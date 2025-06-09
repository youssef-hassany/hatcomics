import formidable from "formidable";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function uploadImageToLocal(
  req: NextRequest,
  folder: string
): Promise<{ fileUrl: string }> {
  const uploadDir = path.join(process.cwd(), "public/uploads", folder);
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    keepExtensions: true,
    filename: (name: string, ext: string) => `${name}-${Date.now()}${ext}`,
  });

  const { files } = await new Promise<{ fields: any; files: any }>(
    (resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );

  const file = files.file[0] || files.file;
  const fileName = path.basename(file.filepath);
  const newFilePath = path.join(uploadDir, fileName);

  fs.renameSync(file.filepath, newFilePath);

  const fileUrl = `/uploads/${folder}/${fileName}`;
  return { fileUrl };
}
