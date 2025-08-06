import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  className?: string;
}

const Input = ({ label, id, className = '', ...props }: InputProps) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className='block mb-2 text-sm font-medium text-gray-700'
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`px-4 py-3 w-full rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
