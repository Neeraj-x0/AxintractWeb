"use client";
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Image from "next/image";
import useAxios from "@/lib";
import { BusinessProfile } from "@/types";
interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    companyName: "",
    companyLogo: "",
    phoneNumber: "",
  });

  const axiosInstance = useAxios();

  useEffect(() => {
    axiosInstance.get("/api/settings").then((res) => {
      setBusinessProfile(res.data.businessProfile);
    });
  }, [axiosInstance]);
  return (
    <div
      className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 ${className}`}
    >
      <button
        onClick={() => {
          location.href = "/";
        }}
        className="text-2xl font-semibold text-gray-900"
      >
        RazoMiner
      </button>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          {businessProfile.companyLogo ? (
            <Image
              src={businessProfile.companyLogo}
              alt={businessProfile.companyName}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : null}
          <span className="text-sm text-gray-600">
            {businessProfile.companyName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
