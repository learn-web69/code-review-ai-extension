import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
  isInitialized: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isInitialized }) => {
  return (
    <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-3">
        <Icon name="github" className="h-8 w-8 text-gray-400" />
        <h1 className="text-xl font-bold text-white">AI Core Review Assistant</h1>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        {isInitialized ? (
          <>
            <Icon name="checkCircle" className="h-5 w-5 text-green-400" />
            <span className="text-green-400">Initialized</span>
          </>
        ) : (
          <>
            <Icon name="xCircle" className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400">Not Initialized</span>
          </>
        )}
      </div>
    </div>
  );
};
