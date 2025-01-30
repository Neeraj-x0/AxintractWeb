/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Reminder } from "@/types";
import {
  Bell,
  Calendar,
  Plus,
  CheckCircle,
  AlertCircle,
  Search,
  MoreVertical,
  ArrowUpRight,
  Settings,
} from "lucide-react";

import ReminderDash from "@/components/ui/ReminderCard";

import { ReminderGrid } from "@/components/ReminderCard";

const RemindersDashboard = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Meeting with John",
      description: "Discuss the new project requirements",
      datetime: "2021-08-20T09:00:00",
      status: "upcoming",
      priority: "high",
      starred: true,
      category: "work",
      assignedTo: ["John Doe"],
      tags: ["meeting", "work"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "title">("date");
  const [selectedView, setSelectedView] = useState<
    "grid" | "list" | "calendar"
  >("grid");

  const processedReminders = useMemo(() => {
    let filtered = [...reminders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reminder) =>
          reminder.title.toLowerCase().includes(query) ||
          reminder.description.toLowerCase().includes(query) ||
          reminder.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (reminder) => reminder.status === filterStatus
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
          );
        case "priority":
          const priorityMap = { high: 3, medium: 2, low: 1 };
          return priorityMap[b.priority] - priorityMap[a.priority];
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [reminders, searchQuery, filterStatus, sortBy]);

  const [showAddModal, setShowAddModal] = useState(false);

  //   const handleSearch = (value: string) => {
  //     const clearTimeout = setTimeout(() => setSearchQuery(value), 300);
  //     if (clearTimeout.current) clearTimeout(clearTimeout.current);
  //     setClearTimeout(current => setTimeout(() => setSearchQuery(value), 300));
  //   };

  return (
    <div className="p-6 space-y-6 fadeIn">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            Reminders
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">
              {reminders.length} Total
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize and track your tasks efficiently
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            New Reminder
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Reminders",
            value: reminders.length,
            icon: Bell,
            trend: "+12%",
            trendUp: true,
          },
          {
            label: "Upcoming",
            value: reminders.filter((r) => r.status === "upcoming").length,
            icon: Calendar,
            trend: "+5%",
            trendUp: true,
          },
          {
            label: "Overdue",
            value: reminders.filter((r) => r.status === "overdue").length,
            icon: AlertCircle,
            trend: "-3%",
            trendUp: false,
          },
          {
            label: "Completed",
            value: reminders.filter((r) => r.status === "completed").length,
            icon: CheckCircle,
            trend: "+8%",
            trendUp: true,
          },
        ].map((stat, index) => (
          <ReminderDash key={index} stat={stat} />
        ))}
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search reminders, tags, or categories..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "priority" | "title")
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>

          <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-1">
            {[
              { icon: Calendar, value: "calendar" },
              { icon: MoreVertical, value: "list" },
              { icon: ArrowUpRight, value: "grid" },
            ].map((view) => (
              <button
                key={view.value}
                onClick={() =>
                  setSelectedView(view.value as "grid" | "list" | "calendar")
                }
                className={`p-2 rounded ${
                  selectedView === view.value
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <view.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Reminder List */}

      <ReminderGrid reminders={processedReminders} />
    </div>
  );
};

export default RemindersDashboard;
