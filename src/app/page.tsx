import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header with fixed height */}
      <Header className="flex-none" />
      
      {/* Main content area that fills remaining space */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar with overflow handling */}
        <div className="flex-none overflow-y-auto">
          <Sidebar />
        </div>
        
        {/* Dashboard wrapper */}
        <div className="flex-1 min-w-0">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Home;