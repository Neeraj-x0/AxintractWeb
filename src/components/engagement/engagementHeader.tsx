import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronDown, Trash, Clock, Tag } from "lucide-react";
import { IEngagement } from "@/types";
import { motion, AnimatePresence, MotionProps } from "framer-motion";

interface EngagementHeaderProps {
  engagement: IEngagement;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onDelete: () => void;
  actionLoading: boolean;
}

export const EngagementHeader: React.FC<EngagementHeaderProps> = React.memo(
  ({ engagement, categories, onCategoryChange, onDelete, actionLoading }) => {
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsCategoryDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                {engagement.name}
              </h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <Tag className="w-4 h-4 mr-2" />
                  {engagement.category}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                  <span className="text-indigo-500 font-medium">
                    {engagement.lastMessage
                      ? new Date(engagement.lastMessage).toLocaleString()
                      : "No date"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4" ref={dropdownRef}>
            <div className="relative">
              <Button
                variant="outline"
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all"
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                disabled={actionLoading}
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Update Category
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <CategoryDropdown
                    categories={categories}
                    onSelect={(category) => {
                      onCategoryChange(category);
                      setIsCategoryDropdownOpen(false);
                    }}
                    currentCategory={engagement.category ?? ""}
                  />
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
              onClick={onDelete}
              disabled={actionLoading}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

const MotionDiv = motion.div as React.FC<
  React.HTMLAttributes<HTMLDivElement> & MotionProps
>;

const CategoryDropdown: React.FC<{
  categories: string[];
  onSelect: (category: string) => void;
  currentCategory: string;
}> = React.memo(({ categories, onSelect, currentCategory }) => (
  <MotionDiv
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute z-10 right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100"
  >
    <div className="py-2">
      {categories.map((category) => (
        <MotionDiv
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 text-sm hover:bg-indigo-50 cursor-pointer flex items-center justify-between
            ${
              category === currentCategory
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-700"
            }
          `}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          {category}
          {category === currentCategory && (
            <div className="w-2 h-2 rounded-full bg-indigo-600" />
          )}
        </MotionDiv>
      ))}
    </div>
  </MotionDiv>
));

EngagementHeader.displayName = "EngagementHeader";
CategoryDropdown.displayName = "CategoryDropdown";
