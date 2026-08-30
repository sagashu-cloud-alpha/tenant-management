import React from "react";

interface IconAdministrationProps {
  size?: number;
  color?: string;
  className?: string;
}

const IconAdministration: React.FC<IconAdministrationProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15A1.7 1.7 0 0 0 19.7 17L20.1 17.4C20.7 18 20.7 18.9 20.1 19.5L19.5 20.1C18.9 20.7 18 20.7 17.4 20.1L17 19.7A1.7 1.7 0 0 0 15 19.4A1.7 1.7 0 0 0 14 21V21.6C14 22.4 13.4 23 12.6 23H11.4C10.6 23 10 22.4 10 21.6V21A1.7 1.7 0 0 0 8.9 19.4A1.7 1.7 0 0 0 7 19.7L6.6 20.1C6 20.7 5.1 20.7 4.5 20.1L3.9 19.5C3.3 18.9 3.3 18 3.9 17.4L4.3 17A1.7 1.7 0 0 0 4.6 15A1.7 1.7 0 0 0 3 14H2.4C1.6 14 1 13.4 1 12.6V11.4C1 10.6 1.6 10 2.4 10H3A1.7 1.7 0 0 0 4.6 8.9A1.7 1.7 0 0 0 4.3 7L3.9 6.6C3.3 6 3.3 5.1 3.9 4.5L4.5 3.9C5.1 3.3 6 3.3 6.6 3.9L7 4.3A1.7 1.7 0 0 0 8.9 4.6A1.7 1.7 0 0 0 10 3V2.4C10 1.6 10.6 1 11.4 1H12.6C13.4 1 14 1.6 14 2.4V3A1.7 1.7 0 0 0 15 4.6A1.7 1.7 0 0 0 17 4.3L17.4 3.9C18 3.3 18.9 3.3 19.5 3.9L20.1 4.5C20.7 5.1 20.7 6 20.1 6.6L19.7 7A1.7 1.7 0 0 0 19.4 8.9A1.7 1.7 0 0 0 21 10H21.6C22.4 10 23 10.6 23 11.4V12.6C23 13.4 22.4 14 21.6 14H21A1.7 1.7 0 0 0 19.4 15Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconAdministration;

