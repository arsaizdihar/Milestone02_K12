import React, { useRef } from 'react';
import Input from './Input';

interface SearchFieldProps {
  onSearch: (search: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ onSearch }) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <Input
      type="text"
      placeholder="Search here..."
      onChange={(e) => {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          onSearch(e.target.value);
          timeout.current = null;
        }, 1000);
      }}
      icon={
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_61_61)">
            <path
              d="M16.3605 14.3548H15.569L15.2885 14.0935C16.2703 12.9903 16.8614 11.558 16.8614 9.99998C16.8614 6.52578 13.946 3.70966 10.3493 3.70966C6.75255 3.70966 3.8371 6.52578 3.8371 9.99998C3.8371 13.4742 6.75255 16.2903 10.3493 16.2903C11.9623 16.2903 13.4451 15.7193 14.5872 14.7709L14.8577 15.0419V15.8064L19.8671 20.6355L21.3598 19.1935L16.3605 14.3548ZM10.3493 14.3548C7.85461 14.3548 5.84084 12.4097 5.84084 9.99998C5.84084 7.5903 7.85461 5.64514 10.3493 5.64514C12.8439 5.64514 14.8577 7.5903 14.8577 9.99998C14.8577 12.4097 12.8439 14.3548 10.3493 14.3548Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_61_61">
              <rect
                width="24.0449"
                height="23.2258"
                fill="white"
                transform="translate(0.831482 0.806458)"
              />
            </clipPath>
          </defs>
        </svg>
      }
    />
  );
};

export default SearchField;
