import { NoUserError } from "@/lib/utils";
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

    const userToUnBan = await userService.getUserById(id);
    if (!userToUnBan) {
      NoUserError();
      return;
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

    await userService.unBanUser(id);

    return NextResponse.json(
      { status: "success", message: "User UnBanned Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: "error",
      message: `Internal Server Error: ${error}`,
    });
  }
}
