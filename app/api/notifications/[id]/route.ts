import { NoUserError } from "@/lib/utils";
import { notificationService } from "@/services/notification.service";
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
        { status: "error", message: "Missing Notification Id" },
        { status: 401 }
      );
    }

    const { notificationType } = await request.json();

    if (notificationType === "user") {
      await notificationService.markNotificationAsRead(userId, id);
    }

    if (notificationType === "broadcast") {
      await notificationService.markBroadcastAsRead(userId, id);
    }

    return NextResponse.json(
      { status: "success", message: "Notification marked as read" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: `Internal Server error: ${error}` },
      { status: 500 }
    );
  }
}
