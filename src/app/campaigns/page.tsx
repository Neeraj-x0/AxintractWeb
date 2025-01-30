import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Users, TrendingUp, Calendar,
  AlertCircle, Plus,  Bell
} from 'lucide-react';

const CampaignDashboard = () => {
  // Sample data
  const performanceMetrics = [
    { label: 'Total Leads', value: '2,345', icon: Users, trend: '+12%', trendUp: true },
    { label: 'Conversion Rate', value: '23.5%', icon: TrendingUp, trend: '+5%', trendUp: true },
    { label: 'Active Campaigns', value: '12', icon: Calendar, trend: '-2', trendUp: false },
    { label: 'Engagement Rate', value: '68%', icon: BarChart, trend: '+8%', trendUp: true }
  ];

  const activeCampaigns = [
    { name: 'Summer Sale 2025', status: 'Active', leads: 456, engagement: '78%', startDate: '2025-01-15', endDate: '2025-02-15' },
    { name: 'Product Launch', status: 'Active', leads: 789, engagement: '82%', startDate: '2025-01-20', endDate: '2025-03-01' },
    { name: 'Email Newsletter', status: 'Paused', leads: 234, engagement: '45%', startDate: '2025-01-10', endDate: '2025-02-10' }
  ];

  return (
    <div className="min-h-screen fadeIn bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your marketing campaigns</p>
        </div>
        <div className="flex space-x-4">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
          <Button variant="outline" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {metric.value}
                  </p>
                </div>
                <div className="flex flex-col items-end mt-2 align-middle space-y-2">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${
                    metric.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Campaigns */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeCampaigns.map((campaign, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.leads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.engagement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.startDate} - {campaign.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="ghost" className="text-indigo-600 hover:text-indigo-900">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className='text-black'>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Low engagement detected</p>
                <p className="text-sm text-yellow-700">Email Newsletter campaign is showing below-average open rates</p>
              </div>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDashboard;