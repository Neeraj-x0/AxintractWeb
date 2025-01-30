import React from 'react';
import { Lead } from '../../types';

interface TopPanelProps {
  lead: Lead;
}

export function TopPanel({ lead }: TopPanelProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{lead.fullName}</h1>
          <p className="text-gray-600">{lead.email}</p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Lead Score</p>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Category</p>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${lead.category === 'vip' ? 'bg-purple-100 text-purple-700' :
                lead.category === 'hot' ? 'bg-red-100 text-red-700' :
                lead.category === 'warm' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'}
            `}>
              {lead.category.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}