import { FC } from 'react';

interface IconMenuProps {
  className?: string;
}

const IconMenu: FC<IconMenuProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="6.5" width="16" height="2" fill="currentColor" />
      <rect x="4" y="11.5" width="16" height="2" fill="currentColor" />
      <rect x="4" y="16.5" width="16" height="2" fill="currentColor" />
    </svg>
  );
};

export default IconMenu;
