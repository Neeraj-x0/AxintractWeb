"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        
      />

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        id="main-content"
        className={`
          flex-1 overflow-hidden transition-all duration-300 ease-in-out
          ${!isMobile && !isSidebarCollapsed ? "ml-[256px]" : ""}
          ${!isMobile && isSidebarCollapsed ? "ml-[72px]" : ""}
          ${isMobile ? "ml-0" : ""}
        `}
      >
        <div className="h-full">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Home;
