import React from 'react';

interface LeadsTableHeaderProps {
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAllSelected: boolean;
}

const LeadsTableHeader: React.FC<LeadsTableHeaderProps> = ({
  onSelectAll,
  isAllSelected,
}) => {
  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th className="px-4 py-3 text-left">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onSelectAll}
            className="rounded border-gray-300"
          />
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
          Lead Name
        </th>
        <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-900">
          Email
        </th>
        <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-900">
          Phone
        </th>
        <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-900">
          Last Contacted
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
          Status
        </th>
        <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-900">
          Category
        </th>
        <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-900">
          Notes
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
          Action
        </th>
      </tr>
    </thead>
  );
};

export default LeadsTableHeader;