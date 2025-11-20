import React from 'react';

interface FormSelectProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-base font-normal text-gray-900">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`
            h-10 px-4 pr-10
            w-full
            border border-gray-300 
            rounded-lg 
            text-base 
            appearance-none
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FormSelect;
