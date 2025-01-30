import Icon from './Icon';

export default function TriggerActionCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 gap-4 rounded-lg border border-[#D1D5DB] bg-white p-6 flex-col shadow-md transition-all hover:shadow-lg">
      <Icon name={icon} size="24px" />
      <div className="flex flex-col gap-2">
        <h2 className="text-[#202020] text-base font-semibold leading-tight">{title}</h2>
        <p className="text-[#6B7280] text-sm font-medium leading-normal">{description}</p>
      </div>
    </div>
  );
}
