import React from 'react';
import Link from 'next/link';
import { Lead } from './types';

interface LeadsTableRowProps {
  lead: Lead;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const LeadsTableRow: React.FC<LeadsTableRowProps> = ({
  lead,
  isSelected,
  onSelect,
}) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700';
      case 'Engaged':
        return 'bg-purple-50 text-purple-700';
      case 'Qualified':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(lead.id)}
          className="rounded border-gray-300"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
        {lead.name}
      </td>
      <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {lead.email}
      </td>
      <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {lead.phone}
      </td>
      <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {lead.lastContacted || "-"}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(lead.status)}`}>
          {lead.status}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {lead.category}
      </td>
      <td className="hidden xl:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
        {lead.notes}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        <Link
          href={`/lead/${lead.id}`}
          className="text-indigo-600 hover:text-indigo-900 transition-colors"
        >
          View
        </Link>
      </td>
    </tr>
  );
};

export default LeadsTableRow;