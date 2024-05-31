import React from 'react';

interface ButtonProps {
  onClick: () => void;
  text: string;
  className: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, className }) => {
  console.log(className, "classname of the btn")
  return (
    <div className={className}>
      <button className='btn' onClick={onClick}>{text}</button>
    </div>
  );
};

export default Button;
