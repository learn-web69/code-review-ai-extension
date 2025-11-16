
import React from 'react';
import type { WalkthroughStep as WalkthroughStepType } from '../types';

interface WalkthroughStepProps {
  step: WalkthroughStepType;
  onClick: (step: WalkthroughStepType) => void;
}

export const WalkthroughStep: React.FC<WalkthroughStepProps> = ({ step, onClick }) => {
  return (
    <div
      onClick={() => onClick(step)}
      className="bg-gray-700/50 p-4 rounded-lg cursor-pointer border border-transparent hover:border-indigo-500 hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02]"
    >
      <h3 className="font-semibold text-indigo-300 text-md">{step.title}</h3>
      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
      <p className="text-xs text-gray-500 mt-2 truncate">
        File: <span className="font-mono">{step.file}:{step.line}</span>
      </p>
    </div>
  );
};