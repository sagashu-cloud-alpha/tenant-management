import { FC } from "react";

interface IconDoubleArrowLeftProps {
  className?: string;
}

const IconDoubleArrowLeft: FC<IconDoubleArrowLeftProps> = ({ className }) => {
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
        d="M5.27616 5.00037L8.47144 8.19563L7.52862 9.13843L3.39056 5.00037L7.52862 0.862305L8.47144 1.80511L5.27616 5.00037ZM0.666694 1.00038V9.00037H2.00003V1.00038H0.666694Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconDoubleArrowLeft;
