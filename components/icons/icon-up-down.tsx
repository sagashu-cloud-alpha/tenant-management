import { FC } from 'react';

interface UpDownIconProps {
  className?: string;
}

const UpDownIcon: FC<UpDownIconProps> = ({ className }) => {
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9.5 4.75L5 0.25L0.5 4.75H9.5ZM9.5 9.25L5 13.75L0.5 9.25H9.5Z"
        fill="currentColor"
        fillOpacity="0.5"
      />
    </svg>
  );
};

export default UpDownIcon;
