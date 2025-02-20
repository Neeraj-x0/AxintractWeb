import { Label } from "@/components/label";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Mail } from "lucide-react";
import { JSX } from "react";

type Channel = "whatsapp" | "email";

interface ChannelSelectorProps {
  selectedChannels: { whatsapp: boolean; email: boolean };
  onChannelToggle: (channel: Channel) => void;
}

const ChannelSelector = ({
  selectedChannels,
  onChannelToggle,
}: ChannelSelectorProps) => {
  const channels: { id: Channel; label: string; icon: JSX.Element }[] = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Select Channels</Label>
      <div className="grid grid-cols-2 gap-4">
        {channels.map(({ id, label, icon }) => (
          <div
            key={id}
            className={`
              flex items-center justify-between p-4 rounded-lg border transition-all
              ${
                selectedChannels[id]
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`
                  p-2 rounded-md
                  ${
                    selectedChannels[id]
                      ? "text-primary bg-primary/10"
                      : "text-gray-500 bg-gray-100"
                  }
                `}
              >
                {icon}
              </div>
              <Label
                htmlFor={`channel-${id}`}
                className="font-medium cursor-pointer"
              >
                {label}
              </Label>
            </div>
            <Switch
              key={id}
              checked={selectedChannels[id]}
              onCheckedChange={() => onChannelToggle(id)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelSelector;
