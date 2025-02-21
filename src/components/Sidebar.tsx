"use client";
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
  Menu
} from "lucide-react";
import { motion, AnimatePresence, MotionProps } from "framer-motion";
import useAxios from "@/lib";
import Image from "next/image";

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
  const [data, setData] = useState({
    companyName: "",
    companyLogo: "https://cdn-icons-png.flaticon.com/512/7153/7153150.png",
  });
  const axios = useAxios();



  const MotionDiv = motion.div as React.FC<React.HTMLAttributes<HTMLDivElement> & MotionProps>
  const MotionSpan = motion.span as React.FC<React.HTMLAttributes<HTMLSpanElement> & MotionProps>

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
  }, [axios, setData]);


  const menuItems = [
    { label: "Dashboard", icon: <FaHouse size={20} /> },
    { label: "Leads", icon: <AiOutlineUser size={20} /> },
    { label: "Reminders", icon: <Calendar size={20} /> },
    { label: "Engagements", icon: <UsersIcon size={20} /> },
    { label: "Follow Ups", icon: <UsersIcon size={20} /> },
    { label: "Chat Bot", icon: <Bot size={20} /> },
    { label: "Settings", icon: <Settings size={20} /> },
  ];



  const toggleSidebar = () => {
    if (isMobile) {
      onSidebarOpenChange(!isSidebarOpen);
    } else {
      onCollapsedChange(!isCollapsed);
    }
  };

  const sidebarVariants = {
    expanded: {
      width: "256px",
      transition: { duration: 0.3 },
    },
    collapsed: {
      width: "72px",
      transition: { duration: 0.3 },
    },
  };

  const mobileVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <MotionDiv
            initial={isMobile ? "closed" : "expanded"}
            animate={
              isMobile
                ? "open"
                : isCollapsed
                  ? "collapsed"
                  : "expanded"
            }
            exit={isMobile ? "closed" : "collapsed"}
            variants={isMobile ? mobileVariants : sidebarVariants}
            className={`
              fixed left-0 top-0 h-full bg-white border-r border-gray-200
              flex flex-col z-40 shadow-xl
              ${isMobile ? 'w-64' : ''}
            `}
          >

            {/* Logo Section */}
            <div className="p-4 border-b border-gray-200">
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
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-bold text-xl">{data.companyName}</span>
                  </MotionDiv>
                )}
                {!isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
                  >
                    {isCollapsed ? (
                      <ChevronRight size={20} />
                    ) : (
                      <ChevronLeft size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-hidden py-4">
              <div className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <div
                    key={item.label}
                    className={`
                      group flex items-center space-x-2 p-2 rounded-lg cursor-pointer
                      transition-all duration-150 ease-in-out
                      ${activeItem === item.label
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                      }
                      ${isCollapsed && !isMobile ? "justify-center" : ""}
                    `}
                    onClick={() => dispatch(setActiveItem(item.label))}
                  >
                    <div className="relative flex items-center">
                      {item.icon}
                      {isCollapsed && !isMobile && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </div>
                    {(!isCollapsed || isMobile) && (
                      <MotionSpan
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {item.label}
                      </MotionSpan>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* User Profile Section */}
            <div className="border-t border-gray-200 p-4">
              <div className={`flex items-center ${isCollapsed && !isMobile ? "justify-center" : "space-x-3"}`}>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-xs text-gray-500">Admin</div>
                  </MotionDiv>
                )}
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
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