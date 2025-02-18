import React, { useCallback, useMemo, useState, useRef } from "react";
import { Search, X, Filter as FilterIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface FilterBarProps {
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
  categories: string[];
  statuses: string[];
  dateRange?: { from: Date | null; to: Date | null };
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  onCategoryFilter: (category: string) => void;
  onDateRangeFilter?: (range: { from: Date | null; to: Date | null }) => void;
}

export const FilterBar: React.FC<FilterBarProps> = React.memo(
  ({
    searchQuery,
    statusFilter,
    categoryFilter,
    categories,
    statuses,
    dateRange,
    onSearch,
    onStatusFilter,
    onCategoryFilter,
    onDateRangeFilter,
  }) => {
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const filterMenuRef = useRef<HTMLDivElement>(null!);

    useOnClickOutside(filterMenuRef, () => setShowFilterMenu(false));

    const activeFiltersCount = useMemo(() => {
      let count = 0;
      if (statusFilter) count++;
      if (categoryFilter) count++;
      if (dateRange?.from || dateRange?.to) count++;
      if (searchQuery) count++;
      return count;
    }, [statusFilter, categoryFilter, dateRange, searchQuery]);

    const handleClearFilters = useCallback(() => {
      onSearch("");
      onStatusFilter("");
      onCategoryFilter("");
      onDateRangeFilter?.({ from: null, to: null });
      toast.success("Filters cleared");
    }, [onSearch, onStatusFilter, onCategoryFilter, onDateRangeFilter]);

    return (
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search engagements..."
            className="pl-10 pr-4 py-2 border rounded-md w-64 focus:ring-2 
                     focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <div className="relative" ref={filterMenuRef}>
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`px-4 py-2 border rounded-md flex items-center space-x-2
                      hover:bg-gray-50 transition-colors duration-200
                      ${
                        activeFiltersCount > 0
                          ? "border-indigo-500 text-indigo-600"
                          : "border-gray-300"
                      }`}
          >
            <FilterIcon size={18} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-indigo-100 text-indigo-600 px-2 rounded-full text-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Filter Menu */}
          {showFilterMenu && (
            <div className="absolute top-12 right-0 w-72 bg-white rounded-lg shadow-lg border p-4 z-10">
              <div className="space-y-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 
                              focus:ring-indigo-500 focus:border-indigo-500"
                    value={statusFilter}
                    onChange={(e) => onStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 
                              focus:ring-indigo-500 focus:border-indigo-500"
                    value={categoryFilter}
                    onChange={(e) => onCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Actions */}
                <div className="flex justify-end pt-2 border-t">
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FilterBar.displayName = "FilterBar";

export default FilterBar;
