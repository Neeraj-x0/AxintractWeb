import React from "react";
import { Label } from "@/components/label";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReminderDetailsProps } from "./reminder/types";

export const ReminderDetails: React.FC<ReminderDetailsProps> = ({
  formData,
  currentDate,
  onFormChange,
}) => {
  return (
    <div className="space-y-4 border-b pb-6">
      <h3 className="font-medium text-lg">Reminder Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Reminder Title"
            value={formData.title}
            onChange={(e) => onFormChange({ title: e.target.value })}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Reminder Description (Optional)"
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => {
              const scheduledAt = new Date(e.target.value).toISOString();
              onFormChange({ scheduledAt });
            }}
            min={currentDate}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={formData.frequency}
            onValueChange={(
              frequency: "once" | "daily" | "weekly" | "monthly"
            ) => onFormChange({ frequency })}
          >
            <SelectTrigger id="frequency" className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Once</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
