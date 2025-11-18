import React from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'date';
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder,
  type = 'text'
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-base font-normal text-gray-900">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full
          h-10 px-4 
          border border-gray-300 
          rounded-lg 
          text-base 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
        `}
      />
    </div>
  );
};

export default FormInput;
