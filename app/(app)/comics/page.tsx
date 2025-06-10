"use client";

import { useGetComicVineComics } from "@/hooks/comic-vine/useGetComicVineComics";
import React from "react";
import { Calendar, Book, ExternalLink } from "lucide-react";

const ComicsPage = () => {
  const { data: comicsList } = useGetComicVineComics("spider-man");

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    // Remove HTML tags using regex
    return html
      .replace(/<[^>]*>/g, "") // Remove all HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with regular spaces
      .replace(/&amp;/g, "&") // Replace &amp; with &
      .replace(/&lt;/g, "<") // Replace &lt; with <
      .replace(/&gt;/g, ">") // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, " ") // Replace multiple whitespace with single space
      .trim(); // Remove leading/trailing whitespace
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    const cleanText = stripHtmlTags(text);
    return cleanText.length <= maxLength
      ? cleanText
      : cleanText.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold">Batman Comics</h1>
          </div>
          <p className="text-zinc-200 text-lg max-w-2xl">
            Discover the world of Batman through this curated collection of
            comic issues. From classic storylines to modern adventures.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!comicsList ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-zinc-300">Loading comics...</p>
            </div>
          </div>
        ) : comicsList.length === 0 ? (
          <div className="text-center py-20">
            <Book className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-300 text-lg">No comics found</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-zinc-300">
                Found{" "}
                <span className="font-semibold text-orange-400">
                  {comicsList.length}
                </span>{" "}
                comics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {comicsList.map((comic) => (
                <div
                  key={comic.id}
                  className="bg-zinc-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-zinc-700"
                >
                  {/* Comic Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-700">
                    <img
                      src={comic.image?.original_url || comic.image?.super_url}
                      alt={comic.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-zinc-700">
                      <Book className="w-12 h-12 text-zinc-500" />
                    </div>

                    {/* Issue Number Badge */}
                    {comic.issue_number && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold shadow-lg">
                        #{comic.issue_number}
                      </div>
                    )}
                  </div>

                  {/* Comic Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight">
                      {comic.name || "Untitled Issue"}
                    </h3>

                    {/* Volume Info */}
                    {comic.volume?.name && (
                      <p className="text-orange-600 font-medium text-sm mb-2">
                        {comic.volume.name}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                      {truncateText(comic.description, 120) ||
                        "No description available."}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      {comic.cover_date && (
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>Cover: {formatDate(comic.cover_date)}</span>
                        </div>
                      )}
                      {comic.store_date && (
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>Store: {formatDate(comic.store_date)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() =>
                        window.open(comic.site_detail_url, "_blank")
                      }
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComicsPage;
