import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/redux/store";
import { setActiveItem } from "../lib/features/activeTabSlice";
import { AiOutlineUser } from "react-icons/ai";
import { FaHouse } from "react-icons/fa6";
import {
  Calendar,
  Settings,
  UsersIcon,
  Bot,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import useAxios from "@/lib";
import Image from "next/image";
import { MotionDiv, MotionSpan } from "./MotionComponents";

interface SidebarProps {
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  isSidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onCollapsedChange,
  isSidebarOpen,
  onSidebarOpenChange
}) => {
  const dispatch = useDispatch();
  const activeItem = useSelector((state: RootState) => state.sidebar.activeItem);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    companyName: "",
    companyLogo: "https://cdn-icons-png.flaticon.com/512/7153/7153150.png",
    name: ""
  });
  const axios = useAxios();

  const menuItems = [
    { label: "Dashboard", icon: <FaHouse size={18} /> },
    { label: "Leads", icon: <AiOutlineUser size={18} /> },
    { label: "Reminders", icon: <Calendar size={18} /> },
    { label: "Engagements", icon: <UsersIcon size={18} /> },
    { label: "Follow Ups", icon: <UsersIcon size={18} /> },
    { label: "Chat Bot", icon: <Bot size={18} /> },
    { label: "Settings", icon: <Settings size={18} /> },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        onCollapsedChange(true);
        onSidebarOpenChange(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [onCollapsedChange, onSidebarOpenChange]);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const response = await axios.get("/api/settings");
        setData(response.data.businessProfile);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLogo();
  }, [axios]);

  const toggleSidebar = () => {
    if (isMobile) {
      onSidebarOpenChange(!isSidebarOpen);
    } else {
      onCollapsedChange(!isCollapsed);
    }
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      )}

      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <MotionDiv
            initial={isMobile ? { x: "-100%" } : { width: "256px" }}
            animate={
              isMobile
                ? { x: 0 }
                : { width: isCollapsed ? "72px" : "256px" }
            }
            exit={isMobile ? { x: "-100%" } : { width: "72px" }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-40 shadow-sm"
          >
            {/* Logo Section */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                {!isCollapsed && (
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src={data.companyLogo}
                      alt="Logo"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="font-medium text-sm">{data.companyName}</span>
                  </MotionDiv>
                )}
                {!isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-md hover:bg-gray-50 focus:outline-none"
                  >
                    {isCollapsed ? (
                      <ChevronRight size={16} />
                    ) : (
                      <ChevronLeft size={16} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Search Bar */}
            {(!isCollapsed || isMobile) && (
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded-md border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="space-y-0.5 px-3">
                {menuItems.map((item) => (
                  <div
                    key={item.label}
                    className={`
                      group flex items-center space-x-2 px-2 py-1.5 rounded-lg cursor-pointer
                      transition-all duration-150 ease-in-out
                      ${activeItem === item.label
                        ? "bg-gray-100 text-gray-900 shadow-sm  text-lg font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                      }
                      ${isCollapsed && !isMobile ? "justify-center" : ""}
                    `}
                    onClick={() => dispatch(setActiveItem(item.label))}
                  >
                    <div className={`relative flex items-center${activeItem === item.label
                      ? "text-gray-900  text-lg font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}>
                      {item.icon}
                      {isCollapsed && !isMobile && (
                        <div className="fixed ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 translate-x-[35px]">
                          {item.label}
                        </div>
                      )}
                    </div>
                    {(!isCollapsed || isMobile) && (
                      <MotionSpan
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm"
                      >
                        {item.label}
                      </MotionSpan>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* User Profile */}
            <div className="border-t border-gray-100 p-3">
              <div className={`flex items-center ${isCollapsed && !isMobile ? "justify-center" : "space-x-3"}`}>
                <Image
                  src={data.companyLogo}
                  alt="Logo"
                  width={24}
                  height={24}
                  className="rounded-full"
                />  
                {(!isCollapsed || isMobile) && (
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-sm font-medium">{data.name}</div>
                    <div className="text-xs text-gray-500">Admin</div>
                  </MotionDiv>
                )}
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
    </>
  );
};

export default Sidebar;