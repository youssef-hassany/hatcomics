import React from "react";
import { AlertTriangle } from "lucide-react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  iconActiveColor?: string;
  iconInactiveColor?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  icon: Icon = AlertTriangle,
  disabled = false,
  activeColor = "bg-orange-500",
  inactiveColor = "bg-zinc-600",
  iconActiveColor = "text-orange-400",
  iconInactiveColor = "text-zinc-400",
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            checked ? activeColor : inactiveColor
          } ${disabled ? "opacity-50" : ""}`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform ${
              checked ? "translate-x-5" : "translate-x-0.5"
            } translate-y-0.5`}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Icon
          className={`w-4 h-4 ${checked ? iconActiveColor : iconInactiveColor}`}
        />
        <span className="text-sm text-zinc-300">{label}</span>
      </div>
    </label>
  );
};

export default Toggle;
