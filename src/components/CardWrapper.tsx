import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CardWrapperProps {
  title: string;
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = React.memo(({ title, children }) => (
  <Card className="border-2 flex-1 border-opacity-50 dark:border-gray-700 animate-fadeIn">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
));
 
CardWrapper.displayName = "CardWrapper";
export default CardWrapper;