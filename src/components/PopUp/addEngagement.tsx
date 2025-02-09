import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Engagement, CreateEngagementPopupProps } from "@/types";

import { toast } from "react-hot-toast";
import { parseBody } from "@/constants";

const CreateEngagementPopup = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
}: CreateEngagementPopupProps) => {
  const [formData, setFormData] = useState<Engagement>({
    name: "",
    notes: "",
    category: "",
    totalMessages: 0,
    replies: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Engagement, string>>
  >({});
  const [loading, setLoading] = useState(false);

  // Fetch categories and statuses from API
  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof Engagement, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.category && !formData.status) {
      newErrors.category = "Either Category or Status is required";
      newErrors.status = "Either Category or Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(parseBody(formData) as Engagement);
      onClose();
    } catch (error) {
      console.error("Error creating engagement:", error);
      toast.error("Failed to create engagement");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Engagement, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center fadeIn justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Engagement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter engagement name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category{" "}
              {!formData.status && <span className="text-red-500">*</span>}
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {(categories || []).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Notes Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md 
                ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
            >
              {loading ? "Creating..." : "Create Engagement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEngagementPopup;
