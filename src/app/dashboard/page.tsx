/* eslint-disable react/display-name */
import React, { useMemo, useCallback, memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  MessageSquare,
  Target,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Filter,
  Download,
  Plus,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// Memoized components for better performance
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

const QuickActionButton = memo(({ icon, label }: QuickActionButtonProps) => (
  <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-200 group">
    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100">
      {icon}
    </div>
    <span className="font-medium text-gray-700 group-hover:text-indigo-600">
      {label}
    </span>
  </button>
));

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}

const StatCard = memo(({ label, value, icon, change }: StatCardProps) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
    <span
      className={`text-sm font-medium ${
        change.startsWith("+") ? "text-green-600" : "text-red-600"
      }`}
    >
      {change}
    </span>
  </div>
));

interface TaskItemProps {
  task: {
    title: string;
    time: string;
    type: string;
    urgent: boolean;
  };
}

const TaskItem = memo(({ task }: TaskItemProps) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {task.type === "Call" ? (
          <Phone size={16} />
        ) : task.type === "Email" ? (
          <Mail size={16} />
        ) : (
          <Target size={16} />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900">{task.title}</p>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">{task.time}</p>
          {task.urgent && (
            <span className="flex items-center text-amber-600 text-sm">
              <AlertCircle size={12} className="mr-1" /> Urgent
            </span>
          )}
        </div>
      </div>
    </div>
    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
      View <ChevronRight size={16} className="ml-1" />
    </button>
  </div>
));

const ProfessionalDashboard = () => {
  // Enhanced sample data with more detail
  const leadTrendData = useMemo(
    () => [
      {
        month: "Jan",
        "New Leads": 120,
        converted: 45,
        engaged: 65,
        conversion: 37.5,
      },
      {
        month: "Feb",
        "New Leads": 140,
        converted: 55,
        engaged: 75,
        conversion: 39.3,
      },
      {
        month: "Mar",
        "New Leads": 160,
        converted: 65,
        engaged: 85,
        conversion: 40.6,
      },
      {
        month: "Apr",
        "New Leads": 180,
        converted: 75,
        engaged: 95,
        conversion: 41.7,
      },
      {
        month: "May",
        "New Leads": 200,
        converted: 85,
        engaged: 105,
        conversion: 42.5,
      },
      {
        month: "Jun",
        "New Leads": 220,
        converted: 95,
        engaged: 115,
        conversion: 43.2,
      },
    ],
    []
  );

  const quickActions = useMemo(
    () => [
      { icon: <Plus size={20} />, label: "Add Lead" },
      { icon: <Phone size={20} />, label: "Schedule Call" },
      { icon: <Mail size={20} />, label: "Send Email" },
      { icon: <Calendar size={20} />, label: "Add Task" },
    ],
    []
  );

  const upcomingTasks = useMemo(
    () => [
      {
        title: "Follow up with John Doe",
        time: "2:00 PM",
        type: "Call",
        urgent: true,
      },
      {
        title: "Send proposal to Tech Corp",
        time: "4:30 PM",
        type: "Email",
        urgent: false,
      },
      {
        title: "Review lead qualification",
        time: "Tomorrow",
        type: "Task",
        urgent: true,
      },
    ],
    []
  );

  const handleExport = useCallback(() => {
    // Export functionality implementation
  }, []);

  return (
    <div className="min-h-screen fadeIn bg-gradient-to-b from-gray-50 to-white transition-opacity ">
      <div className="p-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <QuickActionButton key={index} {...action} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics Overview */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                <CardTitle className="text-base font-semibold">
                  Lead Performance
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Filter size={16} className="text-gray-500" />
                  </button>
                  <button
                    onClick={handleExport}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Download size={16} className="text-gray-500" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={leadTrendData}>
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
                            stopColor="#4F46E5"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4F46E5"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          color: "#1F2937",
                          backgroundColor: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="New Leads"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        fill="url(#newLeadsGradient)"
                      />
                      <Line
                        type="monotone"
                        dataKey="converted"
                        stroke="#06B6D4"
                        strokeWidth={2}
                        dot={{ stroke: "#06B6D4", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-base font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <TaskItem key={index} task={task} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-base font-semibold">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    {
                      label: "Total Leads",
                      value: "2,543",
                      icon: <Users size={20} />,
                      change: "+12.5%",
                    },
                    {
                      label: "Conversion Rate",
                      value: "23.5%",
                      icon: <TrendingUp size={20} />,
                      change: "+2.1%",
                    },
                    {
                      label: "Avg Response Time",
                      value: "2.5 hrs",
                      icon: <MessageSquare size={20} />,
                      change: "-8.3%",
                    },
                  ].map((stat, index) => (
                    <StatCard key={index} {...stat} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                <CardTitle className="text-base font-semibold">
                  Upcoming Tasks
                </CardTitle>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
                  View All <ChevronRight size={16} className="ml-1" />
                </button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500">{task.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
