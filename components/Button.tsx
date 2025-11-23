import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyles = "px-6 py-3 transition-all duration-300 font-light tracking-widest text-sm uppercase flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-dorren-lightBlue text-dorren-black hover:bg-white hover:text-dorren-black disabled:hover:bg-dorren-lightBlue disabled:hover:text-dorren-black",
    secondary: "bg-dorren-darkBlue text-white hover:bg-dorren-lightBlue hover:text-dorren-black disabled:hover:bg-dorren-darkBlue disabled:hover:text-white",
    outline: "border border-dorren-lightBlue text-dorren-lightBlue hover:bg-dorren-lightBlue hover:text-dorren-black disabled:hover:bg-transparent disabled:hover:text-dorren-lightBlue"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};