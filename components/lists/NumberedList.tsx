import React from "react";

interface ListItem {
  id: string;
  listId: string;
  title: string;
  description: string | null;
  image: string | null;
  order: number | null;
}

const NumberedList = ({ items }: { items: ListItem[] }) => {
  const sortedItems = [...items].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
  const topThree = sortedItems.slice(0, 3);
  const remaining = sortedItems.slice(3);

  return (
    <div className="space-y-8">
      {/* Top 3 - Podium Style */}
      <div className="flex items-end justify-center gap-2 sm:gap-6 mb-12 px-2">
        {/* Second Place */}
        {topThree[1] && (
          <div className="flex flex-col items-center transform hover:scale-105 transition-all duration-300">
            <div className="relative mb-4">
              <img
                src={topThree[1].image || ""}
                alt={topThree[1].title}
                className="w-20 sm:w-24 rounded-xl object-cover border-4 border-zinc-400 shadow-lg"
              />
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-zinc-500 to-zinc-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-black shadow-lg border-2 border-white">
                2
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-xl p-2 sm:p-4 text-center border-2 border-zinc-500 shadow-lg w-20 sm:w-32">
              <h3 className="text-white font-bold text-xs sm:text-sm truncate">
                {topThree[1].title}
              </h3>
            </div>
          </div>
        )}

        {/* First Place */}
        {topThree[0] && (
          <div className="flex flex-col items-center transform hover:scale-110 transition-all duration-300">
            <div className="relative mb-4">
              <img
                src={topThree[0].image || ""}
                alt={topThree[0].title}
                className="w-22 sm:w-32 rounded-xl object-cover border-4 border-orange-400 shadow-xl ring-2 ring-orange-300"
              />
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-black shadow-xl border-2 border-yellow-300">
                1
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-2 sm:p-4 text-center border-2 border-orange-400 shadow-xl w-28 sm:w-36">
              <h3 className="text-yellow-100 font-bold text-sm sm:text-base truncate">
                {topThree[0].title}
              </h3>
            </div>
          </div>
        )}

        {/* Third Place */}
        {topThree[2] && (
          <div className="flex flex-col items-center transform hover:scale-105 transition-all duration-300">
            <div className="relative mb-4">
              <img
                src={topThree[2].image || ""}
                alt={topThree[2].title}
                className="w-18 sm:w-20 rounded-xl object-cover border-4 border-amber-500 shadow-lg"
              />
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-base font-black shadow-lg border-2 border-white">
                3
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl p-2 sm:p-4 text-center border-2 border-amber-500 shadow-lg w-16 sm:w-28">
              <h3 className="text-white font-bold text-xs truncate">
                {topThree[2].title}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Remaining Items */}
      {remaining.length > 0 && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {remaining.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-xl p-4 border-2 border-zinc-600 shadow-lg hover:shadow-xl hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image || ""}
                    alt={item.title}
                    className="w-16 rounded-lg object-cover shadow-md"
                  />
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg border-2 border-white">
                    {item.order}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-zinc-400 text-sm truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NumberedList;
