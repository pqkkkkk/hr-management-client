import React from 'react';

interface FormDateInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const FormDateInput: React.FC<FormDateInputProps> = ({
  label,
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-base font-normal text-gray-900">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder="DD/MM/YYYY"
          className={`
            h-10 px-4 pr-12
            w-full
            border border-gray-300 
            rounded-lg 
            text-base 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
          `}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FormDateInput;
