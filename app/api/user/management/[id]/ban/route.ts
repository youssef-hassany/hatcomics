import { NoUserError } from "@/lib/utils";
import { commentService } from "@/services/comment.service";
import { postService } from "@/services/post.service";
import { reviewService } from "@/services/review.service";
import { roadmapService } from "@/services/roadmap.service";
import { userService } from "@/services/user.service";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Missing user id" },
        { status: 401 }
      );
    }

    const userToBan = await userService.getUserById(id);
    if (!userToBan) {
      NoUserError();
      return;
    }

    if (userToBan.role === "owner") {
      return NextResponse.json(
        { status: "error", message: "You can't ban me bro" },
        { status: 401 }
      );
    }

    const adminUser = await userService.getUserById(userId);
    if (!adminUser) {
      NoUserError();
      return;
    }

    if (adminUser.role !== "owner" && adminUser.role !== "admin") {
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to do this operation",
        },
        { status: 401 }
      );
    }

    await userService.banUser(id);
    await reviewService.deleteUserReviews(id);
    await postService.deleteUserPosts(id);
    await roadmapService.deleteUserRoadmaps(id);
    await commentService.deleteUserComments(id);

    return NextResponse.json(
      { status: "success", message: "User Banned Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        message: `Internal Server Error: ${error}`,
      },
      { status: 500 }
    );
  }
}
