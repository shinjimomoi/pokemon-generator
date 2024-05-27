import React from 'react';

interface ButtonProps {
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <div>
      <button onClick={onClick}>Generate</button>
    </div>
  );
};

export default Button;
