console.log("AI Core Review Assistant content script loaded.");

// Fix: Add declaration for the 'chrome' extension API to fix TypeScript errors.
declare const chrome: any;

interface ScrollToMessage {
  type: 'SCROLL_TO_ELEMENT';
  payload: {
    file: string;
    line: number;
  };
}

chrome.runtime.onMessage.addListener((
    message: ScrollToMessage, 
    _sender: any, 
    sendResponse: (response?: any) => void
  ) => {
  if (message.type === 'SCROLL_TO_ELEMENT') {
    const { file, line } = message.payload;
    console.log(`Received request to scroll to ${file}:${line}`);
    
    // Find the file diff container on GitHub's PR page
    const fileContainer = document.querySelector(`[data-path="${file}"]`);
    
    if (fileContainer) {
      fileContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // After scrolling to the file, find the specific line
      // GitHub line numbers are in a data attribute `data-line-number`
      setTimeout(() => {
        const lineElement = fileContainer.querySelector(`[data-line-number="${line}"]`);
        if (lineElement) {
          lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a temporary highlight effect
          const originalBg = (lineElement as HTMLElement).style.backgroundColor;
          (lineElement as HTMLElement).style.backgroundColor = 'rgba(139, 92, 246, 0.3)';
          setTimeout(() => {
            (lineElement as HTMLElement).style.backgroundColor = originalBg;
          }, 2000);
        } else {
            console.warn(`Line number ${line} not found in file ${file}`);
        }
      }, 500); // Wait a bit for the initial scroll to settle

      sendResponse({ success: true, message: `Scrolled to ${file}` });
    } else {
      console.error(`File container not found for path: ${file}`);
      sendResponse({ success: false, message: `File not found: ${file}` });
    }
  }
  // Return true to indicate you wish to send a response asynchronously
  return true;
});