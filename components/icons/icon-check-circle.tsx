export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    {/* Green Background Circle */}
    <circle cx="12" cy="12" r="12" fill="#22c55e" />

    {/* Lucide Check Circle Icon */}
    <path
      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="22 4 12 14.01 9 11.01"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
