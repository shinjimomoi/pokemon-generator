import React from 'react';

interface ButtonProps {
  onClick: () => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <div>
      <button className='btn btn-gen' onClick={onClick}>{text}</button>
    </div>
  );
};

export default Button;
