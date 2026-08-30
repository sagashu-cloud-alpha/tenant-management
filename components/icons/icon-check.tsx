import { FC } from 'react';

interface IconCheckProps {
  className?: string;
}

const IconCheck: FC<IconCheckProps> = ({ className }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.707 5.293A1 1 0 0 1 16.707 6.707L8.707 14.707A1 1 0 0 1 7.293 14.707L3.293 10.707A1 1 0 1 1 4.707 9.293L8 12.586L15.293 5.293A1 1 0 0 1 16.707 5.293Z"
      />
    </svg>
  );
};

export default IconCheck;