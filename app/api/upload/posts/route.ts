import { uploadImageToR2 } from "@/lib/upload-media";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fileUrl } = await uploadImageToR2(req, "post-images");
    return Response.json({ fileUrl });
  } catch (error) {
    return Response.json({ error: `Upload failed ${error}` }, { status: 500 });
  }
}
