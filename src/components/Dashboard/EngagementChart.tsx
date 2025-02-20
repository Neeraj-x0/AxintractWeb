"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, ChevronsRight } from "lucide-react";

interface EngagementData {
  day: string;
  "New Leads": string | number;
  Engaged: number;
  Converted: number;
  rate: number;
}

interface EngagementChartProps {
  data: EngagementData[];
}

const EngagementChart = ({ data }: EngagementChartProps) => {
  return (
    <Card className="overflow-hidden shadow-lg w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b">
        <CardTitle className="text-sm sm:text-base font-semibold flex items-center">
          <TrendingUp size={18} className="mr-2 text-blue-600" />
          This Week&apos;s Leads Engagement
        </CardTitle>
        <button className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
          View Detailed Report <ChevronsRight size={16} className="ml-1" />
        </button>
      </CardHeader>
      <CardContent className="pt-6 bg-white">
        <div className="w-full h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="newLeadsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#1E40AF"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#1E40AF"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="engagedLeadsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#06B6D4"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#06B6D4"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  color: "#1F2937",
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                  padding: "8px",
                }}
                labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="New Leads"
                stroke="#1E40AF"
                strokeWidth={2}
                fill="url(#newLeadsGradient)"
                dot={{ r: 2 }}
                activeDot={{ r: 4, strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="Engaged"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#engagedLeadsGradient)"
                dot={{ r: 2 }}
                activeDot={{ r: 4, strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;