import { NoUserError } from "@/lib/utils";
import { notificationService } from "@/services/notification.service";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const count = await notificationService.getUnreadCount(userId);
    return NextResponse.json(
      { status: "success", data: count },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: `Internal Server error: ${error}` },
      { status: 500 }
    );
  }
}
