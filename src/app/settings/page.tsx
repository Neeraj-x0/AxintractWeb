"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AlertCircle, Save, Plus, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/label";

import usAxios from "@/lib";

type NotificationType = "error" | "success";
type ItemType = "category" | "status";

interface BusinessProfile {
  companyName: string;
  companyLogo: string;
  phoneNumber: string;
}

interface EditModeState {
  type: ItemType | null;
  id: number | null;
  value: string;
}

const SettingsPage: React.FC = () => {
  const axios = usAxios();
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: NotificationType | null;
    message: string;
  }>({ type: null, message: "" });
  const [editMode, setEditMode] = useState<EditModeState>({
    type: null,
    id: null,
    value: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    companyName: "",
    companyLogo: "",
    phoneNumber: "",
  });

  // Show notification with auto-dismiss
  const showNotification = useCallback(
    (type: NotificationType, message: string): void => {
      setNotification({ type, message });
      setTimeout(() => setNotification({ type: null, message: "" }), 3000);
    },
    []
  );

  // Fetch settings data
  useEffect(() => {
    const fetchSettings = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/settings");
        const { categories, statuses, businessProfile } = response.data;
        setCategories(categories || []);
        setStatuses(statuses || []);
        setBusinessProfile(
          businessProfile || {
            companyName: "",
            companyLogo: "",
            phoneNumber: "",
          }
        );
      } catch {
        showNotification("error", "Failed to fetch settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [axios, showNotification]);

  // Handler functions
  const handleEdit = useCallback(
    (type: ItemType, index: number, value: string): void => {
      setEditMode({ type, id: index, value });
    },
    []
  );

  const handleSaveEdit = useCallback(
    async (type: ItemType) => {
      if (editMode.id === null || !editMode.value.trim()) return;

      try {
        const items = type === "category" ? categories : statuses;
        const oldName = items[editMode.id];
        const newName = editMode.value;

        const response = await axios.put(`/api/settings/${type}`, {
          name: oldName,
          newName,
        });

        if (response.status === 200) {
          if (type === "category") {
            setCategories((prev) =>
              prev.map((item, idx) => (idx === editMode.id ? newName : item))
            );
          } else {
            setStatuses((prev) =>
              prev.map((item, idx) => (idx === editMode.id ? newName : item))
            );
          }
          showNotification("success", `${type} updated successfully`);
        }
      } catch {
        showNotification("error", `Failed to update ${type}`);
      } finally {
        setEditMode({ type: null, id: null, value: "" });
      }
    },
    [editMode, categories, statuses, axios, showNotification]
  );

  const handleDelete = useCallback(
    async (type: ItemType, index: number) => {
      try {
        const items = type === "category" ? categories : statuses;
        const name = items[index];

        const response = await axios.delete(`/api/settings/${type}`, {
          data: { name },
        });

        if (response.status === 200) {
          if (type === "category") {
            setCategories((prev) => prev.filter((_, idx) => idx !== index));
          } else {
            setStatuses((prev) => prev.filter((_, idx) => idx !== index));
          }
          showNotification("success", `${type} deleted successfully`);
        }
      } catch {
        showNotification("error", `Failed to delete ${type}`);
      }
    },
    [categories, statuses, axios, showNotification]
  );

  const handleAdd = useCallback(
    async (type: ItemType) => {
      const name = type === "category" ? newCategory : newStatus;
      if (!name.trim()) return;

      try {
        const response = await axios.post(`/api/settings/${type}`, { name });

        if (response.status === 200) {
          if (type === "category") {
            setCategories((prev) => [...prev, name]);
            setNewCategory("");
          } else {
            setStatuses((prev) => [...prev, name]);
            setNewStatus("");
          }
          showNotification("success", `${type} added successfully`);
        }
      } catch {
        showNotification("error", `Failed to add ${type}`);
      }
    },
    [newCategory, newStatus, axios, showNotification]
  );

  const saveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!profileImage) return;
      
      const formdata = new FormData();
      formdata.append("file", profileImage);
      try {
        const response = await axios.put("/api/settings/profile", formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          showNotification("success", "Profile updated successfully");
        }
      } catch {
        showNotification("error", "Failed to update profile");
      }
    },

    [profileImage, axios, showNotification]
  );

  const saveGeneralSettings = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (profileImage) {
          await saveProfile(e);
        }
        const response = await axios.put("/api/settings/profile", {
          companyName: businessProfile.companyName,
          phoneNumber: businessProfile.phoneNumber,
        });
        if (response.status === 200) {
          showNotification("success", "General settings saved successfully");
        }
      } catch {
        showNotification("error", "Failed to save general settings");
      }
    },
    [businessProfile, axios, showNotification, saveProfile, profileImage]
  );

  // Render item list (categories or statuses)
  const renderItemList = useCallback(
    (type: ItemType, items: string[]) => (
      <ul className="mt-4 space-y-2 transition-all">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-white border p-2 rounded-md hover:shadow-sm transition-shadow duration-200"
          >
            {editMode.type === type && editMode.id === index ? (
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  value={editMode.value}
                  onChange={(e: { target: { value: string } }) =>
                    setEditMode((prev) => ({ ...prev, value: e.target.value }))
                  }
                  className="flex-1"
                  autoFocus
                />
                <Button
                  onClick={() => handleSaveEdit(type)}
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={() =>
                    setEditMode({ type: null, id: null, value: "" })
                  }
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <span className="font-medium text-gray-700">{item}</span>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => handleEdit(type, index, item)}
                    size="sm"
                    variant="ghost"
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(type, index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    ),
    [editMode, handleEdit, handleSaveEdit, handleDelete]
  );

  // Add item input (category or status)
  const renderAddItemInput = useCallback(
    (type: ItemType) => {
      const value = type === "category" ? newCategory : newStatus;
      const setValue = type === "category" ? setNewCategory : setNewStatus;

      return (
        <div className="mt-4 flex gap-2">
          <Input
            type="text"
            placeholder={`New ${type}`}
            value={value}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setValue(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => handleAdd(type)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      );
    },
    [newCategory, newStatus, handleAdd]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 transition-all duration-300 animate-fadeIn">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview and configuration of your application settings
          </p>
        </div>
      </header>

      {/* Notification */}
      {notification.type && (
        <Card
          className={`mb-6 border-l-4 transition-all duration-300 animate-slideIn ${
            notification.type === "error"
              ? "border-red-500"
              : "border-green-500"
          }`}
        >
          <CardContent className="flex py-3">
            <div className="flex items-center space-x-2">
              <AlertCircle
                className={`w-5 h-5 ${
                  notification.type === "error"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              />
              <span
                className={`${
                  notification.type === "error"
                    ? "text-red-600"
                    : "text-green-600"
                } text-sm font-medium`}
              >
                {notification.message}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderAddItemInput("category")}
            {categories.length === 0 ? (
              <p className="text-gray-500 text-sm italic mt-4">
                No categories added yet
              </p>
            ) : (
              renderItemList("category", categories)
            )}
          </CardContent>
        </Card>

        {/* Statuses */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Statuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderAddItemInput("status")}
            {statuses.length === 0 ? (
              <p className="text-gray-500 text-sm italic mt-4">
                No statuses added yet
              </p>
            ) : (
              renderItemList("status", statuses)
            )}
          </CardContent>
        </Card>
      </div>

      {/* General Settings */}
      <Card className="mt-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveGeneralSettings} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className="text-sm font-medium text-gray-700"
              >
                Company Name
              </Label>
              <Input
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
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Company Logo
              </Label>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
                {businessProfile.companyLogo ? (
                  <div className="mb-3 relative h-16 w-16">
                    <Image
                      src={"https://api.axintract.com/media/"+businessProfile.companyLogo}
                      alt="Company Logo"
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-3 h-16 w-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                    <span className="text-gray-400 text-sm text-center">
                      No logo
                    </span>
                  </div>
                )}
                <label
                  htmlFor="logoUpload"
                  className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
                        setProfileImage(file);
                        setBusinessProfile((prev) => ({
                          ...prev,
                          companyLogo: reader.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700"
              >
                Contact Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter contact number"
                value={businessProfile.phoneNumber}
                onChange={(e) =>
                  setBusinessProfile((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="w-full"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(SettingsPage);
