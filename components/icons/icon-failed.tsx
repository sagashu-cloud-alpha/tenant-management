export const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
    <circle cx="12" cy="12" r="12" fill="#fee2e2" />
    <circle cx="12" cy="12" r="9" fill="none" stroke="#dc2626" strokeWidth="2" />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="12"
      stroke="#dc2626"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1" fill="#dc2626" />
  </svg>
);

