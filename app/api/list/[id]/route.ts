import { uploadImageToR2FromServer } from "@/lib/upload-media";
import { NoUserError } from "@/lib/utils";
import { listService } from "@/services/list.service";
import { auth } from "@clerk/nextjs/server";
import { ListType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listId } = await params;

    const data = await listService.getList(listId);

    return NextResponse.json({ status: "success", data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const { id } = await params;

    listService.deleteList(id, userId);

    return NextResponse.json(
      { status: "success", message: "List Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const { id: listId } = await params;

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const type = formData.get("type") as ListType;
    const image = formData.get("image") as File;

    let imgUrl;
    if (image) {
      const { fileUrl } = await uploadImageToR2FromServer(image, "lists");
      imgUrl = fileUrl;
    }

    await listService.updateList({
      title,
      image: imgUrl,
      listId,
      userId,
      type,
    });

    return NextResponse.json(
      {
        status: "success",
        message: "List Updated Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
