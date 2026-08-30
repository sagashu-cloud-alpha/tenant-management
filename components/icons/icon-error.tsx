import { FC } from "react";

interface IconProps {
  className?: string;
}

export const IconError: FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Circle */}
    <circle cx="12" cy="12" r="10" />

    {/* X inside */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 9l-6 6M9 9l6 6"
    />
  </svg>
);