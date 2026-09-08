import React, { useState, useEffect } from 'react';

const Tabs: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>(''); // Custom tab name entered by the user
  const [isSelectiveBlur, setIsSelectiveBlur] = useState<boolean>(false); // State for selective blur
  const [isAllBlur, setIsAllBlur] = useState<boolean>(false); // State for all blur
  const [url, setUrl] = useState<string>(''); // Retrieve saved URL from local storage
  const [originalTitles, setOriginalTitles] = useState<{ [key: number]: string }>({}); // Store original tab titles

  useEffect(() => {
    // Fetch URL from local storage
    const savedUrl = localStorage.getItem('savedUrl');
    if (savedUrl) {
      setUrl(savedUrl);
    }

    // Fetch tab information and save original titles
    chrome.tabs.query({}, function (tabs) {
      const titles: { [key: number]: string } = {};
      tabs.forEach((tab) => {
        if (tab.id && tab.title) {
          titles[tab.id] = tab.title; // Save original tab title by tab ID
        }
      });
      console.log('Original Titles Stored:', titles); // Debug log for stored titles
      setOriginalTitles(titles); // Save original titles in state
    });

    // Load blur states from local storage
    setIsSelectiveBlur(localStorage.getItem('isSelectiveBlur') === 'true');
    setIsAllBlur(localStorage.getItem('isAllBlur') === 'true');
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelectiveBlurChange = () => {
    const newState = !isSelectiveBlur;
    setIsSelectiveBlur(newState);
    localStorage.setItem('isSelectiveBlur', JSON.stringify(newState));
  
    if (newState) {
      // Apply blur (change title) to the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          console.log(`Changing title of current tab (ID: ${currentTab.id}) to "${inputValue}"`);
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: (newTitle: string) => {
              document.title = newTitle;
            },
            args: [inputValue],
          });
        }
      });
    } else {
      // Revert to the original title when unchecked
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id && originalTitles[currentTab.id]) {
          console.log(`Reverting title of current tab (ID: ${currentTab.id}) to "${originalTitles[currentTab.id]}"`);
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: (originalTitle: string) => {
              document.title = originalTitle;
            },
            args: [originalTitles[currentTab.id]],  // Revert to the original title stored earlier
          });
        } else {
          console.error(`Failed to find original title for tab ID: ${currentTab?.id}`);
        }
      });
    }
  };

  const handleAllBlurChange = () => {
    const newState = !isAllBlur;
    setIsAllBlur(newState);
    localStorage.setItem('isAllBlur', JSON.stringify(newState));
  
    if (newState) {
      // Apply the new title to all tabs with the same URL
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach((tab) => {
          if (tab.url === url && tab.id) {
            console.log(`Changing title of tab (ID: ${tab.id}, URL: ${tab.url}) to "${inputValue}"`);
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (newTitle: string) => {
                document.title = newTitle;
              },
              args: [inputValue],
            });
          }
        });
      });
    } else {
      // Revert to original titles for all tabs with the same URL
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach((tab) => {
          if (tab.url === url && tab.id && originalTitles[tab.id]) {
            console.log(`Reverting title of tab (ID: ${tab.id}, URL: ${tab.url}) to "${originalTitles[tab.id]}"`);
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (originalTitle: string) => {
                document.title = originalTitle;
              },
              args: [originalTitles[tab.id]],  // Revert to stored original titles
            });
          } else {
            console.error(`Failed to find original title for tab ID: ${tab.id}`);
          }
        });
      });
    }
  };

  const handleApplyClick = () => {
    console.log('Input:', inputValue);
    console.log('Selective Blur:', isSelectiveBlur);
    console.log('All Blur:', isAllBlur);

    if (isSelectiveBlur) {
      // Change the current tab name only
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          console.log(`Changing title of current tab (ID: ${currentTab.id}) to "${inputValue}"`);
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: (newTitle: string) => {
              document.title = newTitle;
            },
            args: [inputValue],
          });
        }
      });
    }

    if (isAllBlur) {
      // Change the title of all tabs with the same URL
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach((tab) => {
          if (tab.url === url && tab.id) {
            console.log(`Changing title of tab (ID: ${tab.id}, URL: ${tab.url}) to "${inputValue}"`);
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (newTitle: string) => {
                document.title = newTitle;
              },
              args: [inputValue],
            });
          }
        });
      });
    }

    // Store the new title in local storage
    localStorage.setItem('tabTitle', inputValue);
  };

  return (
    <div className="tabs-container">
      {/* Input field */}
      <div className="input-section">
        <input
          id="inputField"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter tab name..."
        />
      </div>

      {/* Selective Blur checkbox */}
      <div className="checkbox-section">
        <label>
          <input
            type="checkbox"
            checked={isSelectiveBlur}
            onChange={handleSelectiveBlurChange}
          />
          Selective Blur
        </label>
      </div>

      {/* All Blur checkbox */}
      <div className="checkbox-section">
        <label>
          <input
            type="checkbox"
            checked={isAllBlur}
            onChange={handleAllBlurChange}
          />
          All Blur
        </label>
      </div>

      {/* Apply button */}
      <div className="button-section">
        <button onClick={handleApplyClick}>Apply</button>
      </div>
    </div>
  );
};

export default Tabs;
