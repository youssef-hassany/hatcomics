import React from "react";
import NumberedList from "./NumberedList";
import FlatList from "./FlatList";
import NoDataFound from "../ui/NoDataFound";
import { List } from "lucide-react";

interface Props {
  items: {
    id: string;
    listId: string;
    title: string;
    description: string | null;
    image: string | null;
    order: number | null;
  }[];
  type?: "flat" | "numbered";
}

const ListItems = ({ items, type = "flat" }: Props) => {
  if (items.length === 0)
    return (
      <NoDataFound
        Icon={List}
        title="No Items Yet"
        description="The User is currently adding items to the list"
      />
    );

  return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4">
      {type === "numbered" ? (
        <NumberedList items={items} />
      ) : (
        <FlatList items={items} />
      )}
    </div>
  );
};

export default ListItems;
