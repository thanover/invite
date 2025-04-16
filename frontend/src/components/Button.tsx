import { PropsWithChildren } from "react";

export type ButtonProps = {
  to: string;
  type: ButtonType;
};

export type ButtonType = "Primary" | "Secondary" | "Warn";

const colors: { [key in ButtonType]: { default: string; hover: string } } = {
  Primary: {
    default: "bg-[var(--color-blue)]",
    hover: "bg-[var(--color-turquoise)]",
  },
  Secondary: {
    default: "bg-cyan-500",
    hover: "bg-sky-700",
  },
  Warn: {
    default: "bg-red-500",
    hover: "bg-pink-600",
  },
};

export function Button({ children, type }: PropsWithChildren<ButtonProps>) {
  return (
    <span
      className={`${colors[type].default} hover:${colors[type].hover} transition delay-150 duration-300 ease-in-out rounded-lg pl-4 pr-4 p-1`}
    >
      {children}
    </span>
  );
}
