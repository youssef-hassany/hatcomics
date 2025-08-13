import { useReadlistToggle } from "@/hooks/readlist/useReadListToggle";
import { Library } from "lucide-react";
import ComponentProtector from "../common/ComponentProtector";
import { useState } from "react";
import { toast } from "sonner";

interface ReadlistToggleButtonProps {
  userId: string;
  comicId: string;
  isInReadlist: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ReadlistToggleButton = ({
  userId,
  comicId,
  isInReadlist,
  disabled = false,
  size = "md",
  className = "",
}: ReadlistToggleButtonProps) => {
  const { mutateAsync: toggleReadList } = useReadlistToggle();
  const [isComicInReadlist, setIsComicInReadlist] = useState(isInReadlist);

  const handleToggle = async () => {
    try {
      setIsComicInReadlist((prev) => !prev);

      await toggleReadList({
        userId,
        comicId,
        isInReadlist: isComicInReadlist,
      });

      toast.success(
        `Comic ${
          !isComicInReadlist ? "Added To" : "Removed From"
        } Your ReadList`
      );
    } catch (error) {
      setIsComicInReadlist((prev) => !prev);
      toast.error("Failed To Add Comic To Your ReadList, Try Again");
      console.error(error);
    }
  };

  const sizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <ComponentProtector>
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${
          isComicInReadlist
            ? "bg-orange-600 hover:bg-orange-500 text-white shadow-lg hover:shadow-orange-500/25"
            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-orange-400 border border-zinc-700 hover:border-orange-500/50"
        }
        ${className}
      `}
        title={isComicInReadlist ? "Remove from readlist" : "Add to readlist"}
      >
        <Library
          size={iconSizes[size]}
          className={`
          transition-transform duration-200
          ${isComicInReadlist ? "fill-current" : ""}
        `}
        />
      </button>
    </ComponentProtector>
  );
};
