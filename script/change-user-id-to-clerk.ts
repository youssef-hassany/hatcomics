"use server";

import { prisma } from "@/lib/db";

export async function migrateUserIdsToClerkIds() {
  try {
    console.log("Starting migration of user IDs to Clerk IDs...");

    // Get all users with their current UUID and Clerk ID
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
      },
    });

    console.log(`Found ${users.length} users to migrate`);

    // Create a mapping of old ID to new ID for reference
    const idMapping = new Map<string, string>();
    users.forEach((user) => {
      idMapping.set(user.id, user.clerkId);
    });

    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Step 1: Create new user records with Clerk IDs
      console.log("Creating new user records with Clerk IDs...");

      for (const user of users) {
        const userData = await tx.user.findUnique({
          where: { id: user.id },
        });

        if (userData && userData.id !== userData.clerkId) {
          // Create new user record with Clerk ID as the primary key
          await tx.user.create({
            data: {
              id: userData.clerkId,
              clerkId: userData.clerkId,
              username: userData.username + "_temp", // Temporary to avoid unique constraint
              fullname: userData.fullname,
              email: userData.email + "_temp", // Temporary to avoid unique constraint
              photo: userData.photo,
              points: userData.points,
              bio: userData.bio,
              role: userData.role,
              provider: userData.provider,
              providerId: userData.providerId,
              lastLoginAt: userData.lastLoginAt,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
            },
          });
        }
      }

      // Step 2: Update all foreign key references
      console.log("Updating foreign key references...");

      for (const user of users) {
        const oldId = user.id;
        const newId = user.clerkId;

        if (oldId === newId) continue; // Skip if already correct

        console.log(`Updating references from ${oldId} to ${newId}`);

        // Update Posts
        await tx.post.updateMany({
          where: { userId: oldId },
          data: { userId: newId },
        });

        // Update Comments
        await tx.comment.updateMany({
          where: { userId: oldId },
          data: { userId: newId },
        });

        // Update Likes
        await tx.like.updateMany({
          where: { userId: oldId },
          data: { userId: newId },
        });

        // Update Follow relationships (both as follower and following)
        await tx.follow.updateMany({
          where: { followerId: oldId },
          data: { followerId: newId },
        });

        await tx.follow.updateMany({
          where: { followingId: oldId },
          data: { followingId: newId },
        });

        // Update Comics (addedById)
        await tx.comic.updateMany({
          where: { addedById: oldId },
          data: { addedById: newId },
        });

        // Update Reviews
        await tx.review.updateMany({
          where: { userId: oldId },
          data: { userId: newId },
        });
      }

      // Step 3: Fix the temporary unique constraints and delete old records
      console.log("Cleaning up old records and fixing unique constraints...");

      for (const user of users) {
        const oldId = user.id;
        const newId = user.clerkId;

        if (oldId === newId) continue; // Skip if already correct

        // Get the original user data for the correct username and email
        const originalUser = await tx.user.findUnique({
          where: { id: oldId },
        });

        if (originalUser) {
          // Update the new record with correct username and email
          await tx.user.update({
            where: { id: newId },
            data: {
              username: originalUser.username,
              email: originalUser.email,
            },
          });

          // Delete the old user record
          await tx.user.delete({
            where: { id: oldId },
          });
        }

        console.log(`Successfully migrated user ${oldId} to ${newId}`);
      }
    });

    console.log("Migration completed successfully!");
    return { success: true, migratedCount: users.length };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Alternative approach using raw SQL (more efficient and handles constraints properly)
export async function migrateUserIdsToClerkIdsWithRawSQL() {
  try {
    console.log("Starting migration with raw SQL...");

    await prisma.$transaction(async (tx) => {
      // First, check if there are any users that need migration
      const usersToMigrate = await tx.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*) as count FROM "User" WHERE id != "clerkId"
      `;

      if (usersToMigrate[0].count === 0) {
        console.log(
          "No users need migration - all IDs already match Clerk IDs"
        );
        return { success: true, migratedCount: 0 };
      }

      console.log(`Found ${usersToMigrate[0].count} users to migrate`);

      // Step 1: Create a temporary mapping table
      await tx.$executeRaw`
        CREATE TEMP TABLE user_id_mapping AS 
        SELECT id as old_id, "clerkId" as new_id FROM "User" WHERE id != "clerkId"
      `;

      // Step 2: Temporarily disable foreign key constraints
      await tx.$executeRaw`ALTER TABLE "Post" DISABLE TRIGGER ALL;`;
      await tx.$executeRaw`ALTER TABLE "Comment" DISABLE TRIGGER ALL;`;
      await tx.$executeRaw`ALTER TABLE "Like" DISABLE TRIGGER ALL;`;
      await tx.$executeRaw`ALTER TABLE "Follow" DISABLE TRIGGER ALL;`;
      await tx.$executeRaw`ALTER TABLE "Comic" DISABLE TRIGGER ALL;`;
      await tx.$executeRaw`ALTER TABLE "Review" DISABLE TRIGGER ALL;`;

      try {
        // Step 3: Update all foreign key references using the mapping
        console.log("Updating foreign key references...");

        await tx.$executeRaw`
          UPDATE "Post" 
          SET "userId" = m.new_id 
          FROM user_id_mapping m 
          WHERE "Post"."userId" = m.old_id AND m.old_id != m.new_id;
        `;

        await tx.$executeRaw`
          UPDATE "Comment" 
          SET "userId" = m.new_id 
          FROM user_id_mapping m 
          WHERE "Comment"."userId" = m.old_id AND m.old_id != m.new_id;
        `;

        await tx.$executeRaw`
          UPDATE "Like" 
          SET "userId" = m.new_id 
          FROM user_id_mapping m 
          WHERE "Like"."userId" = m.old_id AND m.old_id != m.new_id;
        `;

        await tx.$executeRaw`
          UPDATE "Follow" 
          SET "followerId" = m.new_id 
          FROM user_id_mapping m 
          WHERE "Follow"."followerId" = m.old_id AND m.old_id != m.new_id;
        `;

        await tx.$executeRaw`
          UPDATE "Follow" 
          SET "followingId" = m.new_id 
          FROM user_id_mapping m 
          WHERE "Follow"."followingId" = m.old_id AND m.old_id != m.new_id;
        `;

        await tx.$executeRaw`
          UPDATE "Comic" 
          SET "addedById" = m.new_id 
          FROM user_id_mapping m 
          WHERE "Comic"."addedById" = m.old_id AND m.old_id != m.new_id;
        `;

        await tx.$executeRaw`
          UPDATE "Review" 
          SET "userId" = m.new_id 
          FROM user_id_mapping m 
          WHERE "Review"."userId" = m.old_id AND m.old_id != m.new_id;
        `;

        // Step 4: Update the User table primary keys
        console.log("Updating User table primary keys...");

        // First, create new user records with Clerk IDs
        await tx.$executeRaw`
          INSERT INTO "User" (
            id, "clerkId", username, fullname, email, photo, points, bio, role, 
            provider, "providerId", "lastLoginAt", "createdAt", "updatedAt"
          )
          SELECT 
            "clerkId" as id, "clerkId", username || '_temp' as username, fullname, 
            email || '_temp' as email, photo, points, bio, role, 
            provider, "providerId", "lastLoginAt", "createdAt", "updatedAt"
          FROM "User" u
          WHERE u.id != u."clerkId" 
          AND NOT EXISTS (SELECT 1 FROM "User" u2 WHERE u2.id = u."clerkId");
        `;

        // Update the temporary usernames and emails to original values
        await tx.$executeRaw`
          UPDATE "User" as u1
          SET 
            username = u2.username,
            email = u2.email
          FROM "User" as u2, user_id_mapping as m
          WHERE u1.id = m.new_id 
          AND u2.id = m.old_id
          AND m.old_id != m.new_id;
        `;

        // Delete the old user records
        await tx.$executeRaw`
          DELETE FROM "User" 
          WHERE id IN (SELECT old_id FROM user_id_mapping WHERE old_id != new_id);
        `;
      } finally {
        // Step 5: Re-enable foreign key constraints
        await tx.$executeRaw`ALTER TABLE "Post" ENABLE TRIGGER ALL;`;
        await tx.$executeRaw`ALTER TABLE "Comment" ENABLE TRIGGER ALL;`;
        await tx.$executeRaw`ALTER TABLE "Like" ENABLE TRIGGER ALL;`;
        await tx.$executeRaw`ALTER TABLE "Follow" ENABLE TRIGGER ALL;`;
        await tx.$executeRaw`ALTER TABLE "Comic" ENABLE TRIGGER ALL;`;
        await tx.$executeRaw`ALTER TABLE "Review" ENABLE TRIGGER ALL;`;
      }

      // Clean up the temp table
      await tx.$executeRaw`DROP TABLE IF EXISTS user_id_mapping;`;
    });

    console.log("Raw SQL migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Raw SQL migration failed:", error);
    throw error;
  }
}

// Utility function to verify the migration
export async function verifyMigration() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
      },
    });

    const mismatchedUsers = users.filter((user) => user.id !== user.clerkId);

    if (mismatchedUsers.length === 0) {
      console.log(
        "✅ Migration verification passed! All user IDs match their Clerk IDs"
      );
      return { success: true, mismatchedCount: 0 };
    } else {
      console.log(
        `❌ Migration verification failed! ${mismatchedUsers.length} users still have mismatched IDs`
      );
      console.log("Mismatched users:", mismatchedUsers);
      return { success: false, mismatchedCount: mismatchedUsers.length };
    }
  } catch (error) {
    console.error("Verification failed:", error);
    throw error;
  }
}
