import { FC } from "react";

interface IconDoubleArrowRightProps {
  className?: string;
}

const IconDoubleArrowRight: FC<IconDoubleArrowRightProps> = ({ className }) => {
  return (
    <svg
      width="9"
      height="10"
      viewBox="0 0 9 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.72384 5.00037L0.528564 8.19563L1.47138 9.13843L5.60944 5.00037L1.47138 0.862305L0.528564 1.80511L3.72384 5.00037ZM8.33331 1.00038V9.00037H6.99997V1.00038H8.33331Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconDoubleArrowRight;
