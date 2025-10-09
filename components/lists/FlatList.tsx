import React from "react";

interface ListItem {
  id: string;
  listId: string;
  title: string;
  description: string | null;
  image: string | null;
  order: number | null;
}

const FlatList = ({ items }: { items: ListItem[] }) => {
  return (
    <div className="space-y-4 mx-auto">
      {items.map((item) => (
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
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate">
                {item.title}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlatList;
