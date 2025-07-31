import { prisma } from "@/lib/db";
import { APIError, NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) NoUserError();

    const user = await prisma.user.findFirst({
      where: { id: userId! },
    });

    const drafts = await prisma.post.findMany({
      where: {
        userId: user?.id,
        isDraft: true,
      },
    });

    return NextResponse.json(
      { status: "success", data: drafts },
      { status: 200 }
    );
  } catch (error) {
    APIError(`${error}`);
  }
}
