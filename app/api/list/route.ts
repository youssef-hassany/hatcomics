import { uploadImageToR2FromServer } from "@/lib/upload-media";
import { NoUserError } from "@/lib/utils";
import { listService } from "@/services/list.service";
import { notificationService } from "@/services/notification.service";
import { auth } from "@clerk/nextjs/server";
import { ListType } from "@prisma/client";
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
    const image = formData.get("image") as File;
    const type = formData.get("type") as ListType;

    const { fileUrl } = await uploadImageToR2FromServer(image, "lists");

    const uploadedList = await listService.createList({
      title,
      userId,
      image: fileUrl,
      type,
    });

    // notify the user followers of the new uploaded list
    await notificationService.notifyFollowersOfNewList(
      userId,
      uploadedList.id,
      `/lists/${uploadedList.id}`
    );

    return NextResponse.json(
      {
        status: "success",
        message: "List Created Successfully",
        data: uploadedList,
      },
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

export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get("page");
  const page = Math.max(1, Number(pageParam) || 1);
  const filter = request.nextUrl.searchParams.get("filter") || undefined;

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "Missing User ID" },
        { status: 401 }
      );
    }

    const { data, meta } = await listService.getAllLists(page, filter);
    const { hasNextPage, totalPages } = meta;

    return NextResponse.json(
      {
        status: "success",
        currentPage: page,
        hasNextPage,
        totalPages,
        data,
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
