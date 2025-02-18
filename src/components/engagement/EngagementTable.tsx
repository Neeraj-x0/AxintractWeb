import React from 'react';
import Link from 'next/link';
import { IEngagement } from '@/types';

interface EngagementTableProps {
  engagements: IEngagement[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string) => void;
}

export const EngagementTable: React.FC<EngagementTableProps> = React.memo(({
  engagements,
  selectedIds,
  onSelectAll,
  onSelectOne,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left">
            <input
              type="checkbox"
              checked={selectedIds.length === engagements.length && engagements.length > 0}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="rounded border-gray-300"
            />
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Messages
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Replies
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Contact
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {engagements.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
              No engagements found
            </td>
          </tr>
        ) : (
          engagements.map((engagement) => (
            <tr
              key={engagement._id?.toString()}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={engagement._id ? selectedIds.includes(engagement._id.toString()) : false}
                  onChange={() => engagement._id && onSelectOne(engagement._id.toString())}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {engagement.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  engagement.status === 'Active' ? 'bg-green-100 text-green-800' :
                  engagement.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  engagement.status === 'Closed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {engagement.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                  {engagement.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="font-medium">{engagement.totalMessages}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <span>{engagement.replies}</span>
                  {engagement.totalMessages > 0 && (
                    <span className="ml-2 text-xs text-gray-400">
                      ({Math.round((engagement.replies / engagement.totalMessages) * 100)}%)
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {engagement.lastMessage ? (
                  <div className="flex flex-col">
                    <span>
                      {new Date(engagement.lastMessage).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(engagement.lastMessage).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/engagements/${engagement._id}`}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                  >
                    View
                  </Link>
                  {engagement.status !== 'Closed' && (
                    <Link
                      href={`/engagements/${engagement._id}/chat`}
                      className="text-green-600 hover:text-green-900 transition-colors duration-150"
                    >
                      Chat
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
));

EngagementTable.displayName = 'EngagementTable';