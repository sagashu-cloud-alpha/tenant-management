import { FC } from 'react';

interface IconEditProps {
    className?: string;
}

const IconEdit: FC<IconEditProps> = ({ className }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M13.7574 0.996658L11.7574 2.99666H2V16.9967H16V7.23931L18 5.23931V17.9967C18 18.549 17.5523 18.9967 17 18.9967H1C0.44772 18.9967 0 18.549 0 17.9967V1.99666C0 1.44438 0.44772 0.996658 1 0.996658H13.7574ZM17.4853 0.097168L18.8995 1.51138L9.7071 10.7038L8.2954 10.7063L8.2929 9.28958L17.4853 0.097168Z"
                fill="currentColor" // Allows color control via CSS
            />
        </svg>
    );
};

export default IconEdit;
