import React from 'react';
import { Lead, ProgressionStage } from './types';

interface ProgressionCardsProps {
  leads: Lead[];
}

const ProgressionCards: React.FC<ProgressionCardsProps> = ({ leads }) => {
  const progressionStages: ProgressionStage[] = [
    {
      title: "New",
      description: "Leads that have been recently created",
      count: leads.filter(lead => lead.status === "New").length,
      color: "bg-blue-50 text-blue-700 border-blue-100",
      icon: "🆕",
    },
    {
      title: "Engaged",
      description: "Leads that have interacted with your content",
      count: leads.filter(lead => lead.status === "Engaged").length,
      color: "bg-purple-50 text-purple-700 border-purple-100",
      icon: "⭐",
    },
    {
      title: "Qualified",
      description: "Leads that have been identified as potential customers",
      count: leads.filter(lead => lead.status === "Qualified").length,
      color: "bg-green-50 text-green-700 border-green-100",
      icon: "✅",
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Progression</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {progressionStages.map((stage, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${stage.color} hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{stage.icon}</span>
                <h3 className="font-medium">{stage.title}</h3>
              </div>
              <span className="text-2xl font-semibold">{stage.count}</span>
            </div>
            <p className="text-sm opacity-75">{stage.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressionCards;