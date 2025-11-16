import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ActionButtons } from './components/ActionButtons';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WalkthroughStep as WalkthroughStepComponent } from './components/WalkthroughStep';
import { generateReviewWalkthrough } from './services/geminiService';
import { MOCK_PR_DIFF } from './constants';
import type { WalkthroughStep } from './types';

// Fix: Add declaration for the 'chrome' extension API to fix TypeScript errors.
declare const chrome: any;

// Detect if running as a Chrome extension
const IS_EXTENSION = typeof chrome !== 'undefined' && chrome.runtime?.id;

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walkthroughSteps, setWalkthroughSteps] = useState<WalkthroughStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLiveReviewActive, setIsLiveReviewActive] = useState(false);
  const [currentRepoUrl, setCurrentRepoUrl] = useState<string | null>(null);

  const handleAnalyzePR = useCallback(async (diff: string) => {
    if (!diff || diff.trim() === '') {
      setError("Could not find a PR diff on this page. Navigate to the 'Files changed' tab of a pull request.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setWalkthroughSteps([]);
    try {
      const steps = await generateReviewWalkthrough(diff);
      setWalkthroughSteps(steps);
    } catch (err) {
      setError('Failed to generate review. Please check the API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDiffAndAnalyze = () => {
    if (!IS_EXTENSION) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.tabs.sendMessage(tabId, { type: 'GET_PR_DIFF' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            setError("Could not get PR data. Refresh the page or ensure you're on a GitHub 'Files Changed' tab.");
            return;
          }
          if (response?.diff) {
            handleAnalyzePR(response.diff);
          } else {
            setError("Could not find a PR diff on this page. Navigate to the 'Files changed' tab.");
          }
        });
      }
    });
  };

  useEffect(() => {
    if (IS_EXTENSION) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url;
        if (url) {
          setCurrentRepoUrl(url);
          chrome.storage.local.get([url], (result) => {
            if (result[url]) {
              setIsInitialized(true);
              getDiffAndAnalyze();
            }
          });
        }
      });
    }
  }, []);

  const handleInitRepo = () => {
    if (IS_EXTENSION && currentRepoUrl) {
      chrome.storage.local.set({ [currentRepoUrl]: true }, () => {
        console.log(`Repository ${currentRepoUrl} marked as initialized.`);
        setIsInitialized(true);
        getDiffAndAnalyze();
      });
    } else {
      // Web mock behavior
      setIsInitialized(true);
      handleAnalyzePR(MOCK_PR_DIFF);
    }
  };

  const handleStepClick = (step: WalkthroughStep) => {
    if (IS_EXTENSION) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'SCROLL_TO_ELEMENT',
            payload: { file: step.file, line: step.line },
          });
        }
      });
    } else {
      // Web mock behavior
      console.log(`Simulating scroll to: ${step.file} at line ${step.line}`);
      alert(`Would scroll to:\nFile: ${step.file}\nLine: ${step.line}`);
    }
  };

  return (
    <div className="flex justify-center items-start h-screen p-0 font-sans bg-gray-900 text-white">
      <div className="w-full h-full bg-gray-800 flex flex-col">
        <Header isInitialized={isInitialized} />
        <div className="flex-grow p-6 overflow-y-auto">
          {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</div>}
          
          {isLoading && <LoadingSpinner />}
          
          {!isLoading && walkthroughSteps.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Review Walkthrough</h2>
              {walkthroughSteps.map((step) => (
                <WalkthroughStepComponent key={step.id} step={step} onClick={handleStepClick} />
              ))}
            </div>
          )}

          {!isInitialized && !isLoading && (
             <div className="text-center text-gray-400 mt-10">
              <p className="mb-4">This repository is not yet initialized for AI reviews.</p>
              <p>Click the button below to start the analysis.</p>
            </div>
          )}
        </div>
        
        <ActionButtons
          isInitialized={isInitialized}
          onInit={handleInitRepo}
          onLiveReview={() => setIsLiveReviewActive(true)}
        />
      </div>

      {isLiveReviewActive && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsLiveReviewActive(false)}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-purple-500 text-center max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Live AI Review Session</h2>
            <p className="text-gray-300 mb-6">
              A live review session has started. You would now be sharing your screen with the AI assistant to walk through the PR together.
            </p>
            <button
              onClick={() => setIsLiveReviewActive(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              End Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
