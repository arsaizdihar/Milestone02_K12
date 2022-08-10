import React from 'react';

const ErrorRenderer: React.FC<{ message?: string }> = ({ message }) => {
  return <p className="text-sm text-red-400 font-medium">{message}</p>;
};

export default ErrorRenderer;
