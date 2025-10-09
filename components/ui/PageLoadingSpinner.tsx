import React from "react";

const PageLoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-700 border-t-orange-500"></div>
        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-orange-500 opacity-20"></div>
      </div>
    </div>
  );
};

export default PageLoadingSpinner;
