import ReviewPageClient from "@/components/reviews/ReviewPageClient";
import { prisma } from "@/lib/db";
import { Review } from "@/types/Review";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Server-side function to get review data
async function getReviewData(reviewId: string) {
  try {
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
      },
      include: {
        comic: true,
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            photo: true,
            points: true,
            role: true,
          },
        },
      },
    });
    return review;
  } catch (error) {
    console.error("Error fetching review:", error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const review = await getReviewData(resolvedParams.id);

  if (!review) {
    return {
      title: "Review Not Found",
      description: "The review you are looking for does not exist.",
    };
  }

  const title = `${review.user.username}'s Review of ${review.comic.name}`;
  const description = review.description
    ? `${review.description.slice(0, 155)}${
        review.description.length > 155 ? "..." : ""
      }`
    : `A ${review.rating}/5 star review of ${review.comic.name} by ${review.user.username}`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hat-comics.com";
  const reviewUrl = `${baseUrl}/reviews/${review.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: reviewUrl,
      siteName: "HatComics",
      publishedTime: review.createdAt.toISOString(),
      modifiedTime: review.updatedAt.toISOString(),
      authors: [review.user.username],
      images: [
        {
          url: review.comic.image || `${baseUrl}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${review.comic.name} cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [review.comic.image || `${baseUrl}/default-og-image.jpg`],
    },
    alternates: {
      canonical: reviewUrl,
    },
    other: {
      "article:author": review.user.username,
      "article:published_time": review.createdAt.toISOString(),
      "article:modified_time": review.updatedAt.toISOString(),
    },
  };
}

// Generate structured data for SEO
function generateStructuredData(review: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Book",
      name: review.comic.name,
      image: review.comic.image,
      numberOfPages: review.comic.numberOfIssues,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      "@type": "Person",
      name: review.user.username,
      image: review.user.photo,
    },
    reviewBody: review.description,
    datePublished: review.createdAt.toISOString(),
    dateModified: review.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "HatComics", // Replace with your site name
    },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  console.log("Review ID:", resolvedParams.id); // Debug log

  const review = await getReviewData(resolvedParams.id);

  if (!review) {
    console.log("Review not found for ID:", resolvedParams.id); // Debug log
    notFound();
  }

  // Transform the data to match the Review type expectations
  const transformedReview = {
    ...review,
    user: {
      ...review.user,
      photo: review.user.photo ?? undefined, // Convert null to undefined
    },
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    comic: {
      ...review.comic,
      image: review.comic.image ?? undefined, // Convert null to undefined
      description: review.comic.description ?? undefined, // Convert null to undefined
      createdAt: review.comic.createdAt.toISOString(),
      updatedAt: review.comic.updatedAt.toISOString(),
    },
  } as Review;

  const structuredData = generateStructuredData(review);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Client Component */}
      <ReviewPageClient initialReview={transformedReview} />
    </>
  );
}
