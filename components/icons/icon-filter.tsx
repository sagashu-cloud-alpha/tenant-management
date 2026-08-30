import { FC } from 'react';

interface IconFilterProps {
    className?: string;
}

const IconFilter: FC<IconFilterProps> = ({ className }) => {
    return (
        <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M6.33333 10H9.66667V8.33333H6.33333V10ZM0.5 0V1.66667H15.5V0H0.5ZM3 5.83333H13V4.16667H3V5.83333Z"
                fill="currentColor" // Allows color to be controlled via text color (CSS)
            />
        </svg>
    );
};

export default IconFilter;
