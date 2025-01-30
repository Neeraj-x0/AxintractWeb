// components/MenuItem.tsx
import Icon from "./Icon";

interface Props {
  icon: string;
  title: string;
  isActive?: boolean;
}

export default function MenuItem({ icon, title, isActive = false }: Props) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
        isActive ? "bg-[#293138]" : "hover:bg-[#293138]/50 transition-colors"
      }`}
    >
      <Icon name={icon} size="24px" className="text-white" />
      <p className="text-white text-sm font-medium leading-normal">{title}</p>
    </div>
  );
}
