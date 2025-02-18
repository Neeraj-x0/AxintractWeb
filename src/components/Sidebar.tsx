"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/redux/store";
import { setActiveItem } from "../lib/features/activeTabSlice";
import { AiOutlineUser } from "react-icons/ai";
import { FaHouse } from "react-icons/fa6";
import { Calendar, Settings, UsersIcon,Bot  } from "lucide-react"; // Adjust if required

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const activeItem = useSelector(
    (state: RootState) => state.sidebar.activeItem
  );


  const menuItems = [
    { label: "Dashboard", icon: <FaHouse /> },
    { label: "Leads", icon: <AiOutlineUser /> },
    { label: "Reminders", icon: <Calendar size={20} /> },
    {label:"Engagements",icon:<UsersIcon size={20}/>},
//    { label: "Campaigns", icon: <Settings size={20} /> },
    { label: "Follow Ups", icon: <UsersIcon size={20} /> },
    { label: "Chat Bot", icon: <Bot size={20} /> },
    { label: "Settings", icon: <Settings size={20} /> },

  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-full">

      {/* Header Section */}
      

      {/* Menu Items */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer ${
              activeItem === item.label
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => dispatch(setActiveItem(item.label))}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
