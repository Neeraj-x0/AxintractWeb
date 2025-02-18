"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle, 
  Home, 
  RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="bg-red-50 p-6 rounded-full">
              <AlertTriangle 
                className="w-16 h-16 text-red-500 animate-bounce" 
                strokeWidth={1.5} 
              />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The page you are looking for seems to have wandered off into the digital wilderness. 
              Perhaps it took an unexpected detour or is temporarily lost.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleGoHome}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
            <Button 
              variant="outline"
              onClick={handleRefresh}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </div>

          <div className="mt-8 text-xs text-gray-400 italic">
            Error Code: 404 - Spatial Coordinates Undefined
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;