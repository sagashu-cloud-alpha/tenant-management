import { FC } from "react";

interface IconUpArrowProps {
  className?: string;
}

const IconUpArrow: FC<IconUpArrowProps> = ({ className }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9 7.5L4.5 12H13.5L9 7.5Z"
        fill="currentColor" // Changed from #808080 so color can be styled via CSS/Tailwind
      />
    </svg>
  );
};

export default IconUpArrow;
