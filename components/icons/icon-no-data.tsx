import React from 'react';

interface IconProps {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
}

const ChartSlashIcon: React.FC<IconProps> = ({
  className = "text-gray-400 mb-1",
  width = 36,
  height = 36,
  stroke = "currentColor",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three outlined bars */}
      <rect x="6" y="16" width="3" height="8" rx="1" stroke={stroke} strokeWidth="2"/>
      <rect x="13.5" y="8" width="3" height="16" rx="1" stroke={stroke} strokeWidth="2"/>
      <rect x="21" y="12" width="3" height="12" rx="1" stroke={stroke} strokeWidth="2"/>
      {/* Diagonal slash */}
      <line x1="5" y1="27" x2="27" y2="5" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  );
};

export default ChartSlashIcon;
