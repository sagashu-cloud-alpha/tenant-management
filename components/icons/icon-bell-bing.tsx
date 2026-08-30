import { FC } from 'react';

interface IconBellProps {
    className?: string;
}

const IconBell: FC<IconBellProps> = ({ className }) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M8 19.5833C9.1 19.5833 10 18.7208 10 17.6667H6C6 18.7208 6.9 19.5833 8 19.5833ZM14 13.8333V9.04168C14 6.09959 12.37 3.63668 9.5 2.98501V2.33334C9.5 1.53793 8.83 0.895844 8 0.895844C7.17 0.895844 6.5 1.53793 6.5 2.33334V2.98501C3.64 3.63668 2 6.09001 2 9.04168V13.8333L0 15.75V16.7083H16V15.75L14 13.8333ZM12 14.7917H4V9.04168C4 6.66501 5.51 4.72918 8 4.72918C10.49 4.72918 12 6.66501 12 9.04168V14.7917Z"
                fill="currentColor" // Changed to currentColor for easy styling via CSS
            />
        </svg>
    );
};

export default IconBell;
