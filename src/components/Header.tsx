import React from "react";
import { Bell } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div
      className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 ${className}`}
    >
      <h1 className="text-2xl font-semibold text-gray-900">RazoMiner</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          <Image
            src="https://via.assets.so/game.png?id=1&q=95&w=360&h=360&fit=fill"
            alt="John Doe"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm text-gray-600">John Doe</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
