import React from "react";

type KebabIconProps = React.SVGProps<SVGSVGElement>;

const KebabIcon: React.FC<KebabIconProps> = (props) => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);

export default KebabIcon;
