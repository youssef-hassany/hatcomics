import { memo } from "react";
import { Check, Loader2 } from "lucide-react";

type FilterType = "all" | "activity" | "announcement";

type NotificationFiltersProps = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount: number;
  unreadCount: number;
  onMarkAllAsRead: () => void;
  isMarkingAllAsRead: boolean;
};

function NotificationFilters({
  filter,
  onFilterChange,
  totalCount,
  unreadCount,
  onMarkAllAsRead,
  isMarkingAllAsRead,
}: NotificationFiltersProps) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-orange-600 text-white"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          All {totalCount > 0 && `(${totalCount})`}
        </button>
        <button
          onClick={() => onFilterChange("activity")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "activity"
              ? "bg-orange-600 text-white"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          For You
        </button>
        <button
          onClick={() => onFilterChange("announcement")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "announcement"
              ? "bg-orange-600 text-white"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Following
        </button>
      </div>

      {unreadCount > 0 && (
        <button
          onClick={onMarkAllAsRead}
          disabled={isMarkingAllAsRead}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 transition-colors disabled:opacity-50"
        >
          {isMarkingAllAsRead ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Mark all as read
        </button>
      )}
    </div>
  );
}

export default memo(NotificationFilters);
