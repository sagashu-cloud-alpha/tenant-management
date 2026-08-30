import { FC } from "react";

interface IconArrowLeftProps {
  className?: string;
}

const IconArrowLeft: FC<IconArrowLeftProps> = ({ className }) => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 3 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.06 8L5 7.06L1.94667 4L5 0.94L4.06 0L0.06 4L4.06 8Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconArrowLeft;
