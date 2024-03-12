"use client";

import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  icon?: IconType;
  onCLick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  label,
  disabled,
  outline,
  small,
  custom,
  icon: Icon,
  onCLick,
}: ButtonProps) => {
  return (
    <button
      onClick={onCLick}
      disabled={disabled}
      className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-md hover:opacity-80
      transition w-full border-slate-700 flex items-center justify-center gap-2 ${
        outline ? "bg-white text-slate-700" : "bg-slate-700 text-white"
      } ${
        small
          ? "text-sm font-light py-1 px-2 border"
          : "text-md font-semibold py-3 px-4 border-2"
      } ${custom ? custom : ""}`}
    >
      {Icon && <Icon size={24} />}
      {label}
    </button>
  );
};

export default Button;
