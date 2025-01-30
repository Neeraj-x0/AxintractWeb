import React from "react";
import { Tag } from "lucide-react";
import { Lead } from "@/types";

interface MainContentProps {
  lead: Lead;
}

export function MainContent({ lead }: MainContentProps) {
  const funnelStages = ["Prospect", "Qualification", "Negotiation", "Closed"];
  const currentStageIndex = funnelStages.indexOf(lead.funnelStage);

  return (
    <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lead Progression
          </h2>
          <div className="relative">
            <div className="flex justify-between mb-2">
              {funnelStages.map((stage, index) => (
                <div key={stage} className="flex flex-col items-center w-1/4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStageIndex
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-600 mt-2">{stage}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{
                  width: `${
                    (currentStageIndex / (funnelStages.length - 1)) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {lead.tags.map(
              (
                tag:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      unknown,
                      string | React.JSXElementConstructor<unknown>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<unknown>
                        >
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined,
                index: React.Key | null | undefined
              ) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                >
                  <Tag className="w-4 h-4" />
                  {tag}
                </span>
              )
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {/* Example activities - replace with real data */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-700">
                  Opened Email Campaign
                </span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-600">
                Opened &quot;Q1 Product Update&#34; email campaign
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-700">Website Visit</span>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <p className="text-sm text-gray-600">
                Visited pricing page for 5 minutes
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
