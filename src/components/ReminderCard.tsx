import { Clock, Repeat, Users } from "lucide-react";
import { Reminder } from "@/types";
const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
  return (
    <div className="relative p-4 bg-white rounded-xl border border-gray-300 hover:shadow-md transition-all duration-200">
      {/* Priority & Star Indicators */}

      {/* Main Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition">
            {reminder.title}
          </h3>
        </div>

        <p className="text-sm text-gray-600">{reminder.description}</p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <time dateTime={reminder.datetime}>
              {new Date(reminder.datetime).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          {reminder.recurrence && (
            <div className="flex items-center">
              <Repeat size={14} className="mr-1" />
              <span className="capitalize">{reminder.recurrence}</span>
            </div>
          )}
          {reminder.assignedTo.length > 0 && (
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{reminder.assignedTo .join(" ")}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {reminder.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {reminder.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              reminder.status === "completed"
                ? "bg-green-500 w-full"
                : reminder.status === "upcoming"
                ? "bg-indigo-500 w-1/2"
                : "bg-red-500 w-3/4"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

const ReminderGrid = ({ reminders }: { reminders: Reminder[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reminders.map((reminder) => (
        <ReminderCard key={reminder.id} reminder={reminder} />
      ))}
    </div>
  );
};

export { ReminderCard, ReminderGrid };
