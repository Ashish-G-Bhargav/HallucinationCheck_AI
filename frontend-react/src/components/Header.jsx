import { useState, useEffect } from 'react';
import './Header.css';

function Header({ onApiKeyChange, apiKey, onHistoryToggle, historyCount }) {
  const [showApiModal, setShowApiModal] = useState(false);
  const [inputApiKey, setInputApiKey] = useState('');

  useEffect(() => {
    // Load saved API key
    const savedApiKey = localStorage.getItem('vibecheck-api-key') || '';
    setInputApiKey(savedApiKey);
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('vibecheck-api-key', inputApiKey);
    onApiKeyChange(inputApiKey);
    setShowApiModal(false);
  };

  const handleClearApiKey = () => {
    setInputApiKey('');
    localStorage.removeItem('vibecheck-api-key');
    onApiKeyChange('');
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">Hallucination Check</div>
        <div className="nav-links">
          <button className="history-btn" onClick={onHistoryToggle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>History</span>
            {historyCount > 0 && <span className="badge">{historyCount}</span>}
          </button>
          <button className="api-btn" onClick={() => setShowApiModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="key-icon">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            <span>API</span> {apiKey ? '✓' : ''}
          </button>
        </div>
      </nav>
      <div className="header-content">
        <h1 className="title">
          AI HALLUCINATION <span className="title-accent">DETECTION & CORRECTION</span>
        </h1>
        <p className="tagline">
          Detect and fix AI-generated misinformation.
        </p>
        <div className="header-divider"></div>
      </div>

      {/* API Key Modal */}
      {
        showApiModal && (
          <div className="api-modal-overlay" onClick={() => setShowApiModal(false)}>
            <div className="api-modal" onClick={e => e.stopPropagation()}>
              <div className="api-modal-header">
                <h3>API Configuration</h3>
                <button className="api-modal-close" onClick={() => setShowApiModal(false)}>×</button>
              </div>
              <div className="api-modal-body">
                <label className="api-label">Google Gemini API Key</label>
                <input
                  type="password"
                  className="api-input"
                  placeholder="Enter your API key..."
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                />
                <p className="api-hint">
                  Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
                </p>
              </div>
              <div className="api-modal-footer">
                <button className="api-clear-btn" onClick={handleClearApiKey}>Clear</button>
                <button className="api-save-btn" onClick={handleSaveApiKey}>Save Key</button>
              </div>
            </div>
          </div>
        )
      }
    </header >
  );
}

export default Header;
