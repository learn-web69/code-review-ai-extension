console.log("AI Core Review Assistant content script loaded.");

interface GetPrDiffMessage {
  type: 'GET_PR_DIFF';
}

interface ScrollToMessage {
  type: 'SCROLL_TO_ELEMENT';
  payload: {
    file: string;
    line: number;
  };
}

type Message = GetPrDiffMessage | ScrollToMessage;

/**
 * Scrapes the GitHub PR "Files changed" page to extract the diff text.
 * @returns The concatenated diff text from all files.
 */
const getPrDiff = (): string => {
  const diffElements = document.querySelectorAll('.file-diff-split, .file-diff-unified');
  let diffText = '';
  diffElements.forEach(el => {
    const header = el.closest('.file')?.querySelector('.file-header');
    if (header) {
      const filePath = header.getAttribute('data-path');
      diffText += `diff --git a/${filePath} b/${filePath}\n`;
      diffText += (el as HTMLElement).innerText + '\n';
    }
  });
  return diffText;
};

chrome.runtime.onMessage.addListener((
    message: Message, 
    _sender, 
    sendResponse
  ) => {
  if (message.type === 'GET_PR_DIFF') {
    const diff = getPrDiff();
    sendResponse({ diff });
    return true; // Indicate async response
  }
    
  if (message.type === 'SCROLL_TO_ELEMENT') {
    const { file, line } = message.payload;
    console.log(`Received request to scroll to ${file}:${line}`);
    
    const fileContainer = document.querySelector(`[data-path="${file}"]`);
    
    if (fileContainer) {
      fileContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        const lineElement = fileContainer.querySelector(`[data-line-number="${line}"]`);
        if (lineElement) {
          lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const originalBg = (lineElement as HTMLElement).style.backgroundColor;
          (lineElement as HTMLElement).style.backgroundColor = 'rgba(139, 92, 246, 0.3)';
          setTimeout(() => {
            (lineElement as HTMLElement).style.backgroundColor = originalBg;
          }, 2000);
        } else {
            console.warn(`Line number ${line} not found in file ${file}`);
        }
      }, 500);

      sendResponse({ success: true, message: `Scrolled to ${file}` });
    } else {
      console.error(`File container not found for path: ${file}`);
      sendResponse({ success: false, message: `File not found: ${file}` });
    }
    return true; // Indicate async response
  }
});
