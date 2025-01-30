import React from 'react';
import { MessageSquare, Send, Bell, Play, ListTodo } from 'lucide-react';
import { Communication, Campaign } from '../../types';

interface RightSidebarProps {
  communications: Communication[];
  campaigns: Campaign[];
}

export function RightSidebar({ communications, campaigns }: RightSidebarProps) {
  return (
    <div className="w-96 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <Send className="w-4 h-4" />
              Send Campaign
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
              <Bell className="w-4 h-4" />
              Set Reminder
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              <Play className="w-4 h-4" />
              Add to Sequence
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <ListTodo className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication History</h2>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {communications.map((comm) => (
              <div key={comm.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{comm.type}</span>
                  <span className="text-xs text-gray-500">{comm.date}</span>
                </div>
                <p className="text-sm text-gray-600">{comm.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Participation</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700 mb-2">{campaign.name}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Open Rate:</span>
                    <span className="ml-2 text-gray-700">{campaign.performance.openRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Click Rate:</span>
                    <span className="ml-2 text-gray-700">{campaign.performance.clickRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}