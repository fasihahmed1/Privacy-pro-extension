import React, { useState, useRef, useEffect } from 'react';
import './Popup.css';
import Tabs from './tabs';
import Sites from './sites';
import URLs from './URLs'; 

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('default');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isTabsOn, setIsTabsOn] = useState<boolean>(false); // Default to off
  const [isSitesOn, setIsSitesOn] = useState<boolean>(false); // Default to off
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load button states from local storage when the component mounts
  useEffect(() => {
    const storedTabsState = localStorage.getItem('isTabsOn') === 'true';
    const storedSitesState = localStorage.getItem('isSitesOn') === 'true';

    setIsTabsOn(storedTabsState);
    setIsSitesOn(storedSitesState);
  }, []);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setIsDropdownOpen(false); // Close dropdown when a tab is clicked
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBackClick = () => {
    setActiveTab('default');
  };

  const toggleTabs = () => {
    const newTabsState = !isTabsOn;
    setIsTabsOn(newTabsState);
    localStorage.setItem('isTabsOn', JSON.stringify(newTabsState));

    if (!newTabsState) {
      reverseTabsChanges();
    }
  };

  const toggleSites = () => {
    const newSitesState = !isSitesOn;
    setIsSitesOn(newSitesState);
    localStorage.setItem('isSitesOn', JSON.stringify(newSitesState));

    if (!newSitesState) {
      reverseSitesChanges();
    }
  };

  // Reverse the changes for Tabs (reset any title changes, etc.)
  const reverseTabsChanges = () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              document.title = 'Original Tab Title'; // Replace with the original tab title
            }
          });
        }
      });
    });
    console.log('Reversed all tab changes.');
  };

  // Reverse the blur changes for Sites
  const reverseSitesChanges = () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const blurOverlay = document.getElementById('blur-overlay');
              if (blurOverlay) {
                blurOverlay.remove(); // Remove blur overlay
              }
            }
          });
        }
      });
    });
    console.log('Reversed all site blur changes.');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false); // Close dropdown when clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="popup-container">
      {activeTab !== 'default' && (
        <div className="back-button" onClick={handleBackClick}>
          <i className="fa-solid fa-arrow-left"></i>
        </div>
      )}

      <div className="settings-icon" onClick={toggleDropdown}>
        <img src="D:\React Extension\Privacy Pro React\src\assets\img\settings.png" alt="Settings Icon" />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" ref={dropdownRef}>
          <div onClick={() => handleTabClick('tabs')}>Tabs</div>
          <div onClick={() => handleTabClick('websites')}>Websites</div>
          <div onClick={() => handleTabClick('urls')}>URLs</div>
        </div>
      )}

      <div className="display-area">
        {activeTab === 'default' && <h1>Privacy Pro</h1>}

        {activeTab === 'default' && (
          <div className="center-image">
            <img src="D:\React Extension\Privacy Pro React\src\assets\img\screenshot__2_-removebg-preview.png" alt="Centered Image" />
          </div>
        )}

        {/* Toggleable Tabs Button */}
        {activeTab === 'default' && (
          <h2
            className={`toggle-button ${isTabsOn ? 'active' : 'inactive'}`}
            onClick={toggleTabs}
          >
            Tabs {isTabsOn ? 'On' : 'Off'}
          </h2>
        )}

        {/* Toggleable Sites Button */}
        {activeTab === 'default' && (
          <h2
            className={`toggle-button ${isSitesOn ? 'active' : 'inactive'}`}
            onClick={toggleSites}
          >
            Sites {isSitesOn ? 'On' : 'Off'}
          </h2>
        )}

        {/* Render Tabs, Sites, or URLs based on activeTab */}
        {activeTab === 'tabs' && isTabsOn && <Tabs />}
        {activeTab === 'websites' && isSitesOn && <Sites />}
        {activeTab === 'urls' && <URLs />}
      </div>
    </div>
  );
};

export default Popup;
