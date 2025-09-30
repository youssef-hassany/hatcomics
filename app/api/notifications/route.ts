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

    const notifications = await notificationService.getUserNotifications(
      userId
    );

    return NextResponse.json(
      { status: "success", data: notifications },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
