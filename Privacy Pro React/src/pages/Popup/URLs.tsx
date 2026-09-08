import React, { useState, useEffect } from 'react';

const URLs: React.FC = () => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const savedUrl = localStorage.getItem('savedUrl');
    if (savedUrl) {
      setUrl(savedUrl);
    }
  }, []);

  const handleSaveUrl = () => {
    localStorage.setItem('savedUrl', url);
    console.log('URL saved:', url);
  };

  return (
    <>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to save"
        className="url-input"
      />
      <button onClick={handleSaveUrl} className="url-button">Save URL</button>
      </>
  );
};

export default URLs;
