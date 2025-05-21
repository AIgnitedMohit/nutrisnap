
import React from 'react';
import { AlertTriangleIcon } from './Icons'; // Using a HeroIcon style SVG

interface ErrorDisplayProps {
  message: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div 
      className="bg-red-700 border-l-4 border-red-500 text-red-100 p-4 rounded-md shadow-lg flex items-start space-x-3" 
      role="alert"
    >
      <AlertTriangleIcon className="h-6 w-6 text-red-300 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold">Error</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
