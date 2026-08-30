import { FC } from 'react';

interface IconPlusProps {
    className?: string;
}

const IconPlus: FC<IconPlusProps> = ({ className }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M7.28429 7.28429V2H9.04571V7.28429H14.33V9.04571H9.04571V14.33H7.28429V9.04571H2V7.28429H7.28429Z"
                fill="currentColor" // Makes it easy to theme
            />
        </svg>
    );
};

export default IconPlus;
