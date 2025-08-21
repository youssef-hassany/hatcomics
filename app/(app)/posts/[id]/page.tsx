import PostContent from "@/components/posts/PostContent";
import { prisma } from "@/lib/db";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const post = await prisma.post.findFirst({
    where: { id },
    select: {
      title: true,
      content: true,
      user: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  // Extract plain text from HTML content for description
  const plainTextContent = post.content.replace(/<[^>]*>/g, "").slice(0, 160);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hat-comics.com";
  const postUrl = `${baseUrl}/posts/${id}`;

  return {
    title: `${post.title} | Your Blog Name`,
    description: plainTextContent,
    authors: [{ name: post.user.fullname }],

    // Open Graph for social sharing
    openGraph: {
      title: post.title,
      description: plainTextContent,
      url: postUrl,
      siteName: "Your Blog Name",
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.user.fullname],
      images: [
        {
          url: post.user.photo || `${baseUrl}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: plainTextContent,
      creator: `@${post.user.username || post.user.fullname}`,
      images: [post.user.photo || `${baseUrl}/default-og-image.jpg`],
    },

    // Additional SEO
    keywords: extractKeywords(post.content, post.title),
    alternates: {
      canonical: postUrl,
    },

    // JSON-LD structured data
    other: {
      "article:author": post.user.fullname,
      "article:published_time": post.createdAt.toISOString(),
      "article:modified_time":
        post.updatedAt?.toISOString() || post.createdAt.toISOString(),
    },
  };
}

// Helper function to extract keywords
function extractKeywords(content: string, title: string): string {
  const text = `${title} ${content.replace(/<[^>]*>/g, "")}`;
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3)
    .slice(0, 10);
  return [...new Set(words)].join(", ");
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  const post = await prisma.post.findFirst({
    where: { id },
    select: {
      id: true,
      content: true,
      user: true,
      title: true,
      createdAt: true,
    },
  });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            Post Not Found
          </h1>
          <p className="text-zinc-400">
            The post you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    // @ts-expect-error: bla bla bla bla bla
    <PostContent initialPost={post} />
  );
};

export default page;
