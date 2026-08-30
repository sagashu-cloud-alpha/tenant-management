import { FC } from "react";

interface IconArrowRightProps {
  className?: string;
}

const IconArrowRight: FC<IconArrowRightProps> = ({ className }) => {
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
        d="M0.94 0L0 0.94L3.05333 4L0 7.06L0.94 8L4.94 4L0.94 0Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconArrowRight;
