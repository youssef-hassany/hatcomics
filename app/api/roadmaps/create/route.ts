import { prisma } from "@/lib/db";
import { uploadImageToR2FromServer } from "@/lib/upload-media";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;

    if (!description || !title) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing reuired fields: description or title",
        },
        { status: 401 }
      );
    }

    let uploadedImage;
    if (image) {
      const { fileUrl } = await uploadImageToR2FromServer(image, "roadmaps");
      uploadedImage = fileUrl;
    }

    await prisma.roadmap.create({
      data: {
        title,
        description,
        image: uploadedImage,
        createdBy: userId,
      },
    });

    return NextResponse.json(
      { status: "success", message: "Roadmap Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
