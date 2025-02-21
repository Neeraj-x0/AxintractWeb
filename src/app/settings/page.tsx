"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Save,
  Plus,
  Pencil,
  Trash,
  Building,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/label";
import { Separator } from "@/components/ui/seperator";

import usAxios from "@/lib";
import SystemPromptForm from "@/components/chatBotPrompt";

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
            "Content-Type": "multipart/form-data",
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
      {/* Notification */}
      {notification.type && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            notification.type === "error" ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <div className="flex items-center">
            <AlertCircle
              className={`w-5 h-5 mr-2 ${
                notification.type === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                notification.type === "error"
                  ? "text-red-800"
                  : "text-green-800"
              }`}
            >
              {notification.message}
            </span>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="mb-8">
        <Card className="overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
            {/* Profile Image Overlay */}
            <div className="absolute -bottom-12 left-8 flex items-end space-x-4">
              <div className="relative h-24 w-24 border-4 border-white rounded-lg bg-white shadow-md">
                {businessProfile.companyLogo ? (
                  <Image
                  src={businessProfile.companyLogo}
                  alt="Company Logo"
                  fill
                  sizes="100%"
                  className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <Building className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="logoUpload"
                  className="absolute -right-2 -bottom-2 p-1 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
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
          </div>

          <div className="pt-16 px-8 pb-8">
            <form onSubmit={saveGeneralSettings}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
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
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
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
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Settings Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
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

          {/* Statuses Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
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
            <Separator className="my-8" />
          <SystemPromptForm />
      </div>
    </div>
  );
};

export default React.memo(SettingsPage);
