import React from "react";
import { Phone, Globe, Flag, Calendar } from "lucide-react";
import { Lead } from "../../types";

interface LeftSidebarProps {
  lead: Lead;
}

export function LeftSidebar({ lead }: LeftSidebarProps) {
  return (
    <div className="w-80 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lead Information
          </h2>
          <div className="space-y-4">
            {lead.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{lead.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{lead.source}</span>
            </div>
            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{lead.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{lead.nextAction}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement Metrics
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Active</p>
              <p className="text-gray-700">{lead.lastActive}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email Metrics</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Open Rate</span>
                  <span className="text-gray-900">
                    {lead.emailMetrics.openRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Click Rate</span>
                  <span className="text-gray-900">
                    {lead.emailMetrics.clickRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="text-gray-900">
                    {lead.emailMetrics.conversionRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
