import React, { ReactNode } from 'react';

interface ButtonProps {
  onClick: () => void;
  text: ReactNode;
  className: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, className }) => {
  return (
    <div className={className}>
      <button className={`btn ${className}`} onClick={onClick}>{text}</button>
    </div>
  );
};

export default Button;
