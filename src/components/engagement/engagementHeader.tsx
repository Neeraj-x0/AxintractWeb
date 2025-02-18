import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/ui/avatar';
import { ArrowUpRight, ChevronDown, Trash } from 'lucide-react';
import { IEngagement } from '@/types';

interface EngagementHeaderProps {
  engagement: IEngagement;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onDelete: () => void;
  actionLoading: boolean;
}

export const EngagementHeader: React.FC<EngagementHeaderProps> = React.memo(({
  engagement,
  categories,
  onCategoryChange,
  onDelete,
  actionLoading,
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between text-gray-900 py-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{engagement.name}</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{engagement.category}</span>
            <span>•</span>
            <span className="text-indigo-600">{engagement.status}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            disabled={actionLoading}
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Update Category
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          {isCategoryDropdownOpen && (
            <CategoryDropdown
              categories={categories}
              onSelect={(category) => {
                onCategoryChange(category);
                setIsCategoryDropdownOpen(false);
              }}
            />
          )}
        </div>

        <Button
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={onDelete}
          disabled={actionLoading}
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
});

const CategoryDropdown: React.FC<{
  categories: string[];
  onSelect: (category: string) => void;
}> = React.memo(({ categories, onSelect }) => (
  <div className="absolute z-10 mt-2 w-48 bg-white border rounded shadow-lg">
    {categories.map((category) => (
      <div
        key={category}
        onClick={() => onSelect(category)}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {category}
      </div>
    ))}
  </div>
));

EngagementHeader.displayName = 'EngagementHeader';
CategoryDropdown.displayName = 'CategoryDropdown';