/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "@/lib";
import { BusinessProfile } from "@/types";

// Dummy types and functions
type ExportFormat = "csv" | "xlsx";
type NotificationType = "error" | "success";

const SettingsPage = () => {
  // Basic Settings state
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit mode state for inline editing (for simplicity, we use index based editing)
  const [editMode, setEditMode] = useState<{
    type: string | null;
    id: number | null;
    value: string;
  }>({
    type: null,
    id: null,
    value: "",
  });

  // General Settings state
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    companyName: "",
    companyLogo: "",
    phoneNumber: "",
  });

  // Utility function for notifications (memoized)
  const showNotification = useCallback(
    (type: NotificationType, message: string): void => {
      if (type === "error") {
        setError(message);
        setTimeout(() => setError(null), 3000);
      } else {
        setSuccess(message);
        setTimeout(() => setSuccess(null), 3000);
      }
    },
    []
  );

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/settings`);
        const { categories, statuses, businessProfile } = response.data;

        setCategories(categories);
        setStatuses(statuses);
        setBusinessProfile(businessProfile);
      } catch {
        showNotification("error", "Failed to fetch settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [showNotification]);

  // Handlers for editing using useCallback
  const handleEdit = useCallback(
    (type: string, index: number, currentValue: string): void => {
      setEditMode({ type, id: index, value: currentValue });
    },
    []
  );

  const handleSaveEdit = useCallback(
    async (type: "category" | "status") => {
      // validate current editMode state
      if (editMode.id === null || !editMode.value.trim()) return;
      const updateItems = (items: string[]) =>
        items.map((item, index) =>
          index === editMode.id ? editMode.value : item
        );

      if (type === "category") {
        const response = await axios.put(`/api/settings/category`, {
          name: categories[editMode.id],
          newName: editMode.value,
        });
        if (response.status !== 200) {
          showNotification("error", "Failed to update category");
          return;
        }

        setCategories(updateItems(categories));
      } else {
        const response = await axios.put(`/api/settings/status`, {
          name: statuses[editMode.id],
          newName: editMode.value,
        });
        if (response.status !== 200) {
          showNotification("error", "Failed to update status");
          return;
        }

        setStatuses(updateItems(statuses));
      }
      setEditMode({ type: null, id: null, value: "" });
      showNotification("success", `${type} updated successfully`);
    },
    [editMode, categories, statuses, showNotification]
  );

  const handleDelete = useCallback(
    async (type: "category" | "status", index: number) => {
      if (type === "category") {
        const response = await axios.delete(`/api/settings/category`, {
          data: { name: categories[index] },
        });
        if (response.status !== 200) {
          showNotification("error", "Failed to delete category");
          return;
        }
        setCategories((prev) => prev.filter((_, i) => i !== index));
      } else {
        const response = await axios.delete(`/api/settings/status`, {
          data: { name: statuses[index] },
        });
        if (response.status !== 200) {
          showNotification("error", "Failed to delete status");
          return;
        }
        setStatuses((prev) => prev.filter((_, i) => i !== index));
      }
      showNotification("error", `${type} deleted successfully`);
    },
    [categories, showNotification, statuses]
  );

  const cancelEdit = useCallback(() => {
    setEditMode({ type: null, id: null, value: "" });
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setEditMode((prev) => ({ ...prev, value }));
  }, []);

  const addCategory = useCallback(async () => {
    if (!newCategory.trim()) return;
    const response = await axios.post(`/api/settings/category`, {
      name: newCategory,
    });
    if (response.status !== 200) {
      showNotification("error", "Failed to add category");
      return;
    }
    setCategories((prev) => [...prev, newCategory]);
    setNewCategory("");

    showNotification("success", "Category added successfully");
  }, [newCategory, showNotification]);

  const addStatus = useCallback(async () => {
    if (!newStatus.trim()) return;
    const response = await axios.post(`/api/settings/status`, {
      name: newStatus,
    });
    if (response.status !== 200) {
      showNotification("error", "Failed to add status");
      return;
    }
    setStatuses((prev) => [...prev, newStatus]);
    setNewStatus("");
  }, [newStatus, showNotification]);

  return (
    <div className="min-h-screen  bg-gray-50 p-8 fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Overview and configuration of your application settings
          </p>
        </div>
      </div>

      {/* Notification Alerts */}
      {(error || success) && (
        <Card
          className={`mb-6 flex items-center  text-center border-l-4 ${
            error ? "border-red-500" : "border-green-500"
          }`}
        >
          <CardContent className="flex w-full py-3">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle
                className={`w-5 mt-2 h-5 ${
                  error ? "text-red-600" : "text-green-600"
                }`}
              />
              <span
                className={`${
                  error ? "text-red-600" : "text-green-600"
                } text-center mt-2  text-sm`}
              >
                {error || success}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={addCategory}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {categories.map((cat, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border p-2 rounded-md"
                >
                  {editMode.type === "category" && editMode.id === index ? (
                    <>
                      <input
                        type="text"
                        value={editMode.value}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="flex-1 mr-2 border rounded-md px-2 py-1"
                      />
                      <Button
                        onClick={() => handleSaveEdit("category")}
                        size="sm"
                        className="mr-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save
                      </Button>
                      <Button onClick={cancelEdit} size="sm" variant="outline">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>{cat}</span>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit("category", index, cat)}
                          size="sm"
                          variant="ghost"
                          className="text-indigo-600"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete("category", index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Statuses */}
        <Card>
          <CardHeader>
            <CardTitle>Statuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={addStatus}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {statuses.map((status, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border p-2 rounded-md"
                >
                  {editMode.type === "status" && editMode.id === index ? (
                    <>
                      <input
                        type="text"
                        value={editMode.value}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="flex-1 mr-2 border rounded-md px-2 py-1"
                      />
                      <Button
                        onClick={() => handleSaveEdit("status")}
                        size="sm"
                        className="mr-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save
                      </Button>
                      <Button onClick={cancelEdit} size="sm" variant="outline">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>{status}</span>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit("status", index, status)}
                          size="sm"
                          variant="ghost"
                          className="text-indigo-600"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete("status", index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* General Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Simulate saving general settings
              setTimeout(() => {
                showNotification(
                  "success",
                  "General settings saved successfully"
                );
              }, 500);
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                value={businessProfile.companyName}
                onChange={(e) =>
                  setBusinessProfile((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </label>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border">
                {businessProfile.companyLogo ? (
                  <Image
                    src={businessProfile.companyLogo}
                    alt="Company Logo"
                    width={64}
                    height={64}
                    className="mb-3 h-16 w-auto object-contain"
                  />
                ) : (
                  <span className="mb-3 text-gray-500">No logo uploaded</span>
                )}
                <label
                  htmlFor="logoUpload"
                  className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Upload Logo
                </label>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const url = reader.result as string;
                        setBusinessProfile((prev) => ({
                          ...prev,
                          logoUrl: url,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="contactInfo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Info
              </label>
              <input
                id="contactInfo"
                type="text"
                placeholder="Enter contact details"
                value={businessProfile.phoneNumber}
                onChange={(e) =>
                  setBusinessProfile((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Save General Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(SettingsPage);
