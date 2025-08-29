import { Book } from "lucide-react";
import ComicCardSkeleton from "@/components/comics/ComicCardSekelton";

const ReadlistPageLoading = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold">ReadList</h1>
          </div>
          <p className="text-zinc-200 text-lg max-w-2xl mb-6">
            Browse through all the comics that have been added to your readlist.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ComicCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadlistPageLoading;
