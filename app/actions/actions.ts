"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CreateComicData {
  name: string;
  description?: string;
  publisher: string;
  authors: string[];
  characters: string[];
  numberOfIssues: number;
  image?: string;
  isBeginnerFriendly?: boolean;
  readingLinks: string[];
  isOnGoing: boolean;
}

export async function createComic(data: CreateComicData) {
  try {
    // Get the current user
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: Please log in to create a comic");
    }

    // Validate required fields
    if (
      !data.name ||
      !data.publisher ||
      !data.authors.length ||
      !data.numberOfIssues
    ) {
      throw new Error(
        "Missing required fields: name, publisher, authors, and numberOfIssues are required"
      );
    }

    // Validate numberOfIssues is positive
    if (data.numberOfIssues <= 0) {
      throw new Error("Number of issues must be greater than 0");
    }

    // Validate reading links are valid URLs (optional but recommended)
    if (data.readingLinks.length > 0) {
      for (const link of data.readingLinks) {
        try {
          new URL(link);
        } catch {
          throw new Error(`Invalid URL provided in reading links: ${link}`);
        }
      }
    }

    // Find the user in the database using clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // Create the comic
    const comic = await prisma.comic.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        publisher: data.publisher.trim(),
        authors: data.authors.map((author) => author.trim()).filter(Boolean),
        characters: data.characters.map((char) => char.trim()).filter(Boolean),
        numberOfIssues: data.numberOfIssues,
        image: data.image?.trim() || null,
        isBeginnerFriendly: data.isBeginnerFriendly || false,
        readingLinks: data.readingLinks
          .map((link) => link.trim())
          .filter(Boolean),
        totalReviews: 0,
        averageRating: null,
      },
    });

    // Revalidate relevant pages
    revalidatePath("/comics");
    revalidatePath("/dashboard");

    return {
      success: true,
      comic,
      message: "Comic created successfully!",
    };
  } catch (error) {
    console.error("Error creating comic:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create comic",
    };
  }
}

// Alternative version with form data handling
export async function createComicFromFormData(formData: FormData) {
  try {
    // Extract and parse form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const publisher = formData.get("publisher") as string;
    const authorsString = formData.get("authors") as string;
    const charactersString = formData.get("characters") as string;
    const numberOfIssues = parseInt(formData.get("numberOfIssues") as string);
    const image = formData.get("image") as string;
    const isBeginnerFriendly = formData.get("isBeginnerFriendly") === "true";
    const readingLinksString = formData.get("readingLinks") as string;
    const isOnGoing = formData.get("isOnGoing") === "false";

    // Parse arrays from comma-separated strings
    const authors = authorsString
      ? authorsString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const characters = charactersString
      ? charactersString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const readingLinks = readingLinksString
      ? readingLinksString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const data: CreateComicData = {
      name,
      description: description || undefined,
      publisher,
      authors,
      characters,
      numberOfIssues,
      image: image || undefined,
      isBeginnerFriendly,
      readingLinks,
      isOnGoing: isOnGoing,
    };

    const result = await createComic(data);

    if (result.success) {
      redirect("/comics");
    }

    return result;
  } catch (error) {
    console.error("Error processing form data:", error);
    return {
      success: false,
      error: "Failed to process form data",
    };
  }
}

/* ===== update ===== */
export interface UpdateComicData {
  id: string;
  name?: string;
  description?: string;
  publisher?: string;
  authors?: string[];
  characters?: string[];
  numberOfIssues?: number;
  image?: string;
  isBeginnerFriendly?: boolean;
  readingLinks?: string[];
  isOnGoing?: boolean;
}

export async function updateComic(data: UpdateComicData) {
  try {
    // Get the current user
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: Please log in to update a comic");
    }

    // Validate required fields
    if (!data.id) {
      throw new Error("Comic ID is required for updating");
    }

    // Find the user in the database using clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // Check if the comic exists
    const existingComic = await prisma.comic.findUnique({
      where: { id: data.id },
    });

    if (!existingComic) {
      throw new Error("Comic not found");
    }

    // Validate numberOfIssues if provided
    if (data.numberOfIssues !== undefined && data.numberOfIssues <= 0) {
      throw new Error("Number of issues must be greater than 0");
    }

    // Validate reading links are valid URLs if provided
    if (data.readingLinks && data.readingLinks.length > 0) {
      for (const link of data.readingLinks) {
        if (link.trim()) {
          try {
            new URL(link);
          } catch {
            throw new Error(`Invalid URL provided in reading links: ${link}`);
          }
        }
      }
    }

    // Prepare update data, only including fields that are provided
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }
    if (data.publisher !== undefined)
      updateData.publisher = data.publisher.trim();
    if (data.authors !== undefined) {
      updateData.authors = data.authors
        .map((author) => author.trim())
        .filter(Boolean);
    }
    if (data.characters !== undefined) {
      updateData.characters = data.characters
        .map((char) => char.trim())
        .filter(Boolean);
    }
    if (data.numberOfIssues !== undefined)
      updateData.numberOfIssues = data.numberOfIssues;
    if (data.image !== undefined) {
      updateData.image = data.image?.trim() || null;
    }
    if (data.isBeginnerFriendly !== undefined) {
      updateData.isBeginnerFriendly = data.isBeginnerFriendly;
    }
    if (data.readingLinks !== undefined) {
      updateData.readingLinks = data.readingLinks
        .map((link) => link.trim())
        .filter(Boolean);
    }
    // FIXED: Changed from 'isOnGoing' to 'ongoing' to match schema
    if (data.isOnGoing !== undefined) updateData.ongoing = data.isOnGoing;

    // Update the comic
    const comic = await prisma.comic.update({
      where: { id: data.id },
      data: updateData,
    });

    // Revalidate relevant pages
    revalidatePath("/comics");
    revalidatePath("/dashboard");
    revalidatePath(`/comics/${data.id}`);

    return {
      success: true,
      comic,
      message: "Comic updated successfully!",
    };
  } catch (error) {
    console.error("Error updating comic:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update comic",
    };
  }
}

// Alternative version with form data handling
export async function updateComicFromFormData(formData: FormData) {
  try {
    // Extract and parse form data
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const publisher = formData.get("publisher") as string;
    const authorsString = formData.get("authors") as string;
    const charactersString = formData.get("characters") as string;
    const numberOfIssuesString = formData.get("numberOfIssues") as string;
    const image = formData.get("image") as string;
    const isBeginnerFriendly = formData.get("isBeginnerFriendly") === "true";
    const readingLinksString = formData.get("readingLinks") as string;
    const isOnGoing = formData.get("isOnGoing") === "true";

    if (!id) {
      throw new Error("Comic ID is required for updating");
    }

    // Parse arrays from comma-separated strings
    const authors = authorsString
      ? authorsString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;
    const characters = charactersString
      ? charactersString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;
    const readingLinks = readingLinksString
      ? readingLinksString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    const numberOfIssues = numberOfIssuesString
      ? parseInt(numberOfIssuesString)
      : undefined;

    const data: UpdateComicData = {
      id,
      name: name || undefined,
      description: description || undefined,
      publisher: publisher || undefined,
      authors,
      characters,
      numberOfIssues,
      image: image || undefined,
      isBeginnerFriendly,
      readingLinks,
      isOnGoing,
    };

    const result = await updateComic(data);

    if (result.success) {
      redirect(`/comics/${id}`);
    }

    return result;
  } catch (error) {
    console.error("Error processing form data:", error);
    return {
      success: false,
      error: "Failed to process form data",
    };
  }
}
