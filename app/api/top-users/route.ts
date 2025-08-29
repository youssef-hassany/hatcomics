import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          role: "owner",
        },
      },
      orderBy: {
        points: "desc",
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        photo: true,
        points: true,
        role: true,
      },
    });

    return NextResponse.json(
      { status: "success", data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
