export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
    <circle cx="12" cy="12" r="12" fill="#fef3c7" />
    <circle cx="12" cy="12" r="9" fill="none" stroke="#d97706" strokeWidth="2" />
    <polyline
      points="12 7 12 12 15 14"
      fill="none"
      stroke="#d97706"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

