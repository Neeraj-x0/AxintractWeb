"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, ChevronRight, AlertCircle, Mail, Phone, FileText } from "lucide-react";
import { memo } from "react";

interface Lead {
  name: string;
  time: string;
  source: string;
  urgent: boolean;
}

const PendingLead = memo(({ lead }: { lead: Lead }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow-md">
    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
        {lead.source === "WhatsApp" ? (
          <Phone size={16} />
        ) : lead.source === "Email" ? (
          <Mail size={16} />
        ) : (
          <FileText size={16} />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900">{lead.name}</p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs sm:text-sm text-gray-500">
            Received {lead.time} ago
          </p>
          {lead.urgent && (
            <span className="flex items-center text-amber-600 text-xs sm:text-sm">
              <AlertCircle size={12} className="mr-1" /> Needs response
            </span>
          )}
        </div>
      </div>
    </div>
    <button className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors mt-2 sm:mt-0">
      Engage <ChevronRight size={16} className="ml-1" />
    </button>
  </div>
));

interface PendingLeadsProps {
  leads: Lead[];
}

const PendingLeads = ({ leads }: PendingLeadsProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-blue-50 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base font-semibold flex items-center">
          <Clock size={18} className="mr-2 text-amber-500" /> Pending Lead
          Responses
        </CardTitle>
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
          Response time matters!
        </span>
      </CardHeader>
      <CardContent className="pt-6 bg-white">
        <div className="space-y-4">
          {leads.map((lead, index) => (
            <PendingLead key={index} lead={lead} />
          ))}
          <button className="w-full py-3 border border-blue-200 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-200 mt-4 shadow-sm hover:shadow-md text-sm sm:text-base">
            View All Pending Leads
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

PendingLead.displayName = "PendingLead";
export default PendingLeads;