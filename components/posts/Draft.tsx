import { getPreview } from "@/lib/utils";
import { DraftPreview } from "@/types/Post";
import React from "react";

interface Props {
  onSelectDraft: (title: string, content: string, postId: string) => void;
}

const Draft = ({
  id,
  content,
  title,
  createdAt,
  onSelectDraft,
}: DraftPreview & Props) => {
  return (
    <div
      className="w-full p-4 border-y border-zinc-700 hover:bg-zinc-700 duration-100 cursor-pointer"
      onClick={() => onSelectDraft(title, content, id)}
    >
      <h3 className="font-bold text-xl mb-6">{title}</h3>
      <p className="mb-3">{getPreview(content)}...</p>
      <p className="text-[10px] text-zinc-500">
        {new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
};

export default Draft;
