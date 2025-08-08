import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  type = 'button',
}: ButtonProps) => {
  const baseClasses =
    'px-6 py-3 font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white',
    secondary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    success: 'bg-gradient-to-r from-green-500 to-teal-600 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
