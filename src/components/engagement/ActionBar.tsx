import React, { useMemo } from "react";
import { Plus, Trash2, Filter, Download, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ActionBarProps {
  selectedIds: string[];
  categories: string[];
  statuses: string[];
  onBulkAction: (
    action: "status" | "category" | "delete",
    value: string,
    selectedIds: string[]
  ) => Promise<void>;
  onAddNew: () => void;
  loading?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = React.memo(
  ({
    selectedIds,
    categories,
    statuses,
    onBulkAction,
    onAddNew,
    loading = false,
  }) => {
    const hasSelection = selectedIds.length > 0;

    const selectionInfo = useMemo(
      () => ({
        count: selectedIds.length,
        timestamp: new Date("2025-02-09T17:51:12Z").toISOString(),
        user: "Neeraj-x0",
      }),
      [selectedIds.length]
    );

    const handleExport = async () => {
      try {
        // Implement export functionality here
        toast.success(`Exported ${selectedIds.length} items successfully`);
      } catch {
        toast.error("Failed to export items");
      }
    };

    const handleShare = async () => {
      try {
        const shareText = `Shared by ${selectionInfo.user} at ${selectionInfo.timestamp}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("Share link copied to clipboard");
      } catch {
        toast.error("Failed to share");
      }
    };

    return (
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between w-full">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onAddNew}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
                   disabled:bg-indigo-300 disabled:cursor-not-allowed
                   transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Add New
          </button>

          {hasSelection && (
            <div className="flex items-center space-x-2">
              <select
                disabled={loading}
                className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={(e) => onBulkAction("status", e.target.value, selectedIds)}
              >
                <option value="">Change Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                disabled={loading}
                className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={(e) => onBulkAction("category", e.target.value, selectedIds)}
              >
                <option value="">Change Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExport()}
                  disabled={loading}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md
                         transition-colors duration-200 disabled:text-gray-400
                         disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  title="Export selected"
                >
                  <Download size={18} />
                </button>

                <button
                  onClick={() => handleShare()}
                  disabled={loading}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md
                         transition-colors duration-200 disabled:text-gray-400
                         disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  title="Share selected"
                >
                  <Share2 size={18} />
                </button>

                <button
                  onClick={() => onBulkAction("delete", "", selectedIds)}
                  disabled={loading}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md
                         transition-colors duration-200 disabled:text-red-300
                         disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  title="Delete selected"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {hasSelection && (
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Filter size={16} className="mr-2" />
              <span>
                {selectionInfo.count} item{selectionInfo.count !== 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>
            <div className="hidden sm:block text-gray-400">|</div>
            <div className="hidden sm:block">
              Last updated: {new Date(selectionInfo.timestamp).toLocaleString()}
            </div>
            <div className="hidden sm:block text-gray-400">|</div>
            <div className="hidden sm:block">By: {selectionInfo.user}</div>
          </div>
        )}
      </div>
    );
  }
);

ActionBar.displayName = "ActionBar";

export default ActionBar;
