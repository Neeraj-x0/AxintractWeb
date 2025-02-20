import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Channel } from "./types";
import { MotionDiv } from "@/components/MotionComponents";

interface ChannelSelectorProps {
  channelState: Record<Channel, boolean>;
  onChannelToggle: (channel: Channel) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  channelState,
  onChannelToggle,
}) => {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-medium mb-4">Channels</h3>
      <div className="flex flex-wrap gap-4">
        {(Object.keys(channelState) as Channel[]).map((channel) => (
          <MotionDiv
            key={channel}
            className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Switch
              checked={channelState[channel]}
              onCheckedChange={() => onChannelToggle(channel)}
            />
            <span className="capitalize">{channel}</span>
          </MotionDiv>
        ))}
      </div>
    </Card>
  );
};