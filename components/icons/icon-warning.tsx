import { FC } from "react";

interface IconProps {
  className?: string;
}

export const IconWarning: FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01M4.93 19h14.14a2 2 0 001.74-3L13.74 4.99a2 2 0 00-3.48 0L3.19 16a2 2 0 001.74 3z"
    />
  </svg>
);