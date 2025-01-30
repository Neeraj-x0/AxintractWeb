import React from 'react';
import { Users, Link} from 'lucide-react';
import {RiPlaneFill} from "react-icons/ri";

const CreateWorkflow = () => {
  const mainTriggers = [
    { icon: Users, title: "Attendee is in Segment", description: "Conference attendees" },
    { icon: Link, title: "Email is Replied", description: "Reply to an email" },
    { icon: Users, title: "Email is Not Replied", description: "No reply to an email" }
  ];

  const mainActions = [
    { icon: RiPlaneFill, title: "Send Email", description: "Send an email" },
    { icon: Users, title: "Add to Sequence", description: "Add to sequence" },
    { icon: Users, title: "Remove from Sequence", description: "Remove from sequence" }
  ];

  return (
    <div className="h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">Create a New Workflow</h1>
            <p className="text-sm text-gray-600">Automate your lead engagement and follow-up</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info Section */}
          <div className="grid gap-4 max-w-xl">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Workflow Name</label>
              <input 
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter workflow name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Description</label>
              <textarea 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                placeholder="Enter workflow description"
              />
            </div>
          </div>

          {/* Triggers Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Triggers</h2>
              <button 
                onClick={() => window.location.href = '/workflow/create/triggers'}
                className="text-blue-500 text-sm font-medium hover:text-blue-600"
              >
                View All Triggers
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainTriggers.map((trigger, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer shadow-sm"
                >
                  <trigger.icon className="w-6 h-6 text-gray-600 mb-2" />
                  <h3 className="font-medium text-gray-900">{trigger.title}</h3>
                  <p className="text-sm text-gray-500">{trigger.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
              <button 
                onClick={() => window.location.href = '/workflow/create/actions'}
                className="text-blue-500 text-sm font-medium hover:text-blue-600"
              >
                View All Actions
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainActions.map((action, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer shadow-sm"
                >
                  <action.icon className="w-6 h-6 text-gray-600 mb-2" />
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkflow;