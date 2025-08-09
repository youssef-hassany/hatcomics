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

    // Find the user by username with follower/following counts
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        bio: true,
        photo: true,
        points: true,
        role: true,
        _count: {
          select: {
            followers: true, // Count of users following this user
            following: true, // Count of users this user is following
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    let isFollowed = false;

    // Only check follow status if someone is logged in
    if (userId) {
      const loggedInUser = await prisma.user.findFirst({
        where: {
          clerkId: userId,
        },
        select: {
          id: true,
        },
      });

      // Only check if logged in user exists and is not the same as the profile user
      if (loggedInUser && loggedInUser.id !== user.id) {
        const followRelation = await prisma.follow.findFirst({
          where: {
            followerId: loggedInUser.id,
            followingId: user.id,
          },
        });
        isFollowed = !!followRelation;
      }
    }

    return NextResponse.json(
      {
        status: "success",
        data: {
          ...user,
          followersCount: user._count.followers,
          followingCount: user._count.following,
          isFollowed,
          isOwnProfile: userId
            ? await checkIfOwnProfile(userId, user.id)
            : false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to check if viewing own profile
async function checkIfOwnProfile(
  clerkId: string,
  profileUserId: string
): Promise<boolean> {
  const loggedInUser = await prisma.user.findFirst({
    where: { clerkId },
    select: { id: true },
  });
  return loggedInUser?.id === profileUserId;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { newUsername, bio, fullName } = await request.json();

    const { userId } = await auth();

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (userId !== user?.id) {
      return NextResponse.json(
        {
          status: "error",
          message: "Access Denied",
        },
        { status: 403 }
      );
    }

    const usernameRegex = /^[a-zA-Z0-9._]{1,20}$/;

    if (!usernameRegex.test(newUsername)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Username must only contain letters, numbers, '.' and '_'",
        },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        username,
      },
      data: {
        username: newUsername,
        bio,
        fullname: fullName,
      },
    });

    return NextResponse.json(
      { status: "success", message: "User data updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
