import React from 'react';

interface LeadsControlsProps {
  selectedLeads: string[];
  onAddLeads: () => void;
  onBulkAction: (action: string, value: string) => void;
  onBulkDelete: () => void;
  statusOptions: string[];
  categoryOptions: string[];
  statusFilter: string;
  categoryFilter: string;
  searchQuery: string;
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
}

const LeadsControls: React.FC<LeadsControlsProps> = ({
  selectedLeads,
  onAddLeads,
  onBulkAction,
  onBulkDelete,
  statusOptions,
  categoryOptions,
  statusFilter,
  categoryFilter,
  searchQuery,
  onStatusFilterChange,
  onCategoryFilterChange,
  onSearchQueryChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <button
          onClick={onAddLeads}
          className="px-3 py-1 bg-indigo-600 text-sm text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Leads
        </button>

        {/* Bulk Actions */}
        {selectedLeads.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              onChange={(e) => onBulkAction('status', e.target.value)}
              className="px-2 py-1 text-sm border rounded-md"
            >
              <option value="">Change Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => onBulkAction('category', e.target.value)}
              className="px-2 py-1 text-sm border rounded-md"
            >
              <option value="">Change Category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={onBulkDelete}
              className="px-2 py-1 bg-red-600 text-sm text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-2 py-1 text-sm border rounded-md"
        >
          <option value="">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="px-2 py-1 text-sm border rounded-md"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="px-3 py-1 border rounded-md w-full sm:w-48 lg:w-64"
          placeholder="Search by Name, Email, or Phone"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LeadsControls;