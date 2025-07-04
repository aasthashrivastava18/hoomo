import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false,
  onClick,
  icon,
  iconPosition = 'left',
  loading = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border border-transparent',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500 border border-transparent',
    outline: 'bg-white hover:bg-gray-50 text-blue-600 focus:ring-blue-500 border border-blue-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-transparent',
    link: 'bg-transparent hover:underline text-blue-600 focus:ring-blue-500 border-none shadow-none'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg'
  };
  
  const disabledClasses = 'opacity-60 cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  
  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClass}
        ${sizeClass}
        ${disabled || loading ? disabledClasses : ''}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
