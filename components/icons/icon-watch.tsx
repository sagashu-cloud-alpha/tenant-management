import React from "react";

const WatchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0)">
      <path
        d="M10 1.66668C5.39767 1.66668 1.66671 5.39764 1.66671 10C1.66671 14.6024 5.39767 18.3333 10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39764 14.6024 1.66668 10 1.66668Z"
        stroke="#E5D6A8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.66667V10"
        stroke="#E5D6A8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13.3333H9.99167"
        stroke="#E5D6A8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="matrix(-1 0 0 -1 20 20)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default WatchIcon;

