import React, { ReactNode } from 'react';

interface LoadingProps {
  message: ReactNode;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  return (
    <>
      <div className="spinner"></div>
      <p className="">{message}</p>
    </>
  )
}

export default Loading;