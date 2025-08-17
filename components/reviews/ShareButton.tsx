"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
}

const ShareButton = ({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Check out this review",
  text = "Check out this comic review!",
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log("Share cancelled");
        console.error(error);
      }
    } else {
      // Fallback to copy URL
      handleCopyLink();
    }
    setShowDropdown(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
    setShowDropdown(false);
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
    setShowDropdown(false);
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank", "width=550,height=420");
    setShowDropdown(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors duration-200 cursor-pointer"
        title="Share review"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm hidden sm:inline">Share</span>
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-1 w-44 sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20">
            <div className="py-2">
              {/* Native Share (mobile) */}
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <Share2 className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Share</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Copy Link</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="border-t border-zinc-700 my-1" />

              {/* Twitter */}
              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span className="text-sm">Twitter</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareOnFacebook}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm">Facebook</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
