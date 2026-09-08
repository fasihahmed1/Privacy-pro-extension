import React, { useState, useEffect } from 'react';

const Sites: React.FC = () => {
  const [selectiveBlur, setSelectiveBlur] = useState<boolean>(false);
  const [allBlur, setAllBlur] = useState<boolean>(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  // Load saved states and URLs from local storage when the component mounts
  useEffect(() => {
    const savedSelectiveBlur = localStorage.getItem('selectiveBlur') === 'true';
    const savedAllBlur = localStorage.getItem('allBlur') === 'true';
    const savedUrl = localStorage.getItem('savedUrl'); // Get the saved URL

    setSelectiveBlur(savedSelectiveBlur);
    setAllBlur(savedAllBlur);
    setSavedUrl(savedUrl); // Set the saved URL
  }, []);

  // Save states to local storage when they change
  useEffect(() => {
    localStorage.setItem('selectiveBlur', JSON.stringify(selectiveBlur));
    localStorage.setItem('allBlur', JSON.stringify(allBlur));
  }, [selectiveBlur, allBlur]);

  const handleApply = () => {
    console.log('Selective Blur:', selectiveBlur);
    console.log('All Blur:', allBlur);
    console.log('Saved URL:', savedUrl); // Check the saved URL
    if (selectiveBlur) {
      blurCurrentTab();
    }
    if (allBlur) {
      blurAllTabs();
    }
  };

  // Function to blur the current tab
  const blurCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.scripting.executeScript(
          {
            target: { tabId },
            func: injectBlurElements,
          },
          () => console.log('Selective blur applied to current tab.')
        );
      }
    });
  };

  // Function to blur all open tabs
  const blurAllTabs = () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        const tabId = tab.id;
        // Check if the current tab has a URL and if it matches the saved URL
        if (tab.url && savedUrl && tab.url.includes(savedUrl)) {
          if (tabId) {
            chrome.scripting.executeScript(
              {
                target: { tabId },
                func: injectBlurElements,
              },
              () => console.log(`Blur applied to tab: ${tab.url}`)
            );
          }
        }
      });
    });
  };

  // The function to blur specific elements with different blur effects
  const injectBlurElements = () => {
    const videoElements = document.querySelectorAll('video');
    const imgElements = document.querySelectorAll('img');
    const spanElements = document.querySelectorAll('span, yt-formatted-string');

    // Apply blur for video and img elements (10px)
    const applyBlur = (elements: NodeListOf<HTMLElement>, blurValue: string) => {
      elements.forEach((element) => {
        (element as HTMLElement).style.filter = `blur(${blurValue})`;

        // Add event listeners for hover effect
        element.addEventListener('mouseenter', () => {
          (element as HTMLElement).style.filter = 'none'; // Unblur on hover
        });
        element.addEventListener('mouseleave', () => {
          (element as HTMLElement).style.filter = `blur(${blurValue})`; // Reblur when not hovering
        });
      });
    };

    // Apply 10px blur to video and img elements
    applyBlur(videoElements, '50px');
    applyBlur(imgElements, '15px');

    // Apply 3px blur to span elements
    spanElements.forEach((element) => {
      (element as HTMLElement).style.filter = 'blur(3px)';

      // Add event listeners for hover effect
      element.addEventListener('mouseenter', () => {
        (element as HTMLElement).style.filter = 'none'; // Unblur on hover
      });
      element.addEventListener('mouseleave', () => {
        (element as HTMLElement).style.filter = 'blur(3px)'; // Reblur when not hovering
      });
    });
  };

  return (
    <div className="sites-container">
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={selectiveBlur}
            onChange={() => setSelectiveBlur(!selectiveBlur)}
          />
          Selective Blur
        </label>
        <label>
          <input
            type="checkbox"
            checked={allBlur}
            onChange={() => setAllBlur(!allBlur)}
          />
          All Blur
        </label>
      </div>

      <button className="apply-button" onClick={handleApply}>
        Apply
      </button>
    </div>
  );
};

export default Sites;
