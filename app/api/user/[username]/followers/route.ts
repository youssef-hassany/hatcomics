import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { userId } = await auth();
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { status: "error", message: "Username is required" },
        { status: 400 }
      );
    }

    // Find the user by username
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    // Get logged in user ID for follow status check
    let loggedInUserId: string | null = null;
    if (userId) {
      const loggedInUser = await prisma.user.findFirst({
        where: { clerkId: userId },
        select: { id: true },
      });
      loggedInUserId = loggedInUser?.id || null;
    }

    // Get followers with their details
    const followers = await prisma.follow.findMany({
      where: {
        followingId: user.id, // People who follow this user
      },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            fullname: true,
            photo: true,
            points: true,
            role: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Check if logged in user follows each follower
    const followersWithStatus = await Promise.all(
      followers.map(async (follow) => {
        let isFollowed = false;

        if (loggedInUserId && loggedInUserId !== follow.follower.id) {
          const followRelation = await prisma.follow.findFirst({
            where: {
              followerId: loggedInUserId,
              followingId: follow.follower.id,
            },
          });
          isFollowed = !!followRelation;
        }

        return {
          ...follow.follower,
          isFollowed,
          isOwnProfile: loggedInUserId === follow.follower.id,
          followedAt: follow.createdAt,
        };
      })
    );

    return NextResponse.json(
      {
        status: "success",
        data: {
          followers: followersWithStatus,
          total: followersWithStatus.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
