import React from 'react';
import { Icon } from './Icon';

interface ActionButtonsProps {
  isInitialized: boolean;
  onInit: () => void;
  onLiveReview: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ isInitialized, onInit, onLiveReview }) => {
  return (
    <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex-shrink-0 flex items-center space-x-3">
      {!isInitialized ? (
        <button
          onClick={onInit}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <Icon name="sparkles" className="h-5 w-5" />
          <span>Initialize Repository</span>
        </button>
      ) : (
        <button
          onClick={onLiveReview}
          className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          <Icon name="video" className="h-5 w-5" />
          <span>Start Live AI Review</span>
        </button>
      )}
    </div>
  );
};