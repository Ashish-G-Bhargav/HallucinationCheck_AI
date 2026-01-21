import { useState } from 'react';
import './CorrectedTextModal.css';

function CorrectedTextModal({ originalText, correctedText, onApply, onClose }) {
  const [view, setView] = useState('corrected'); // 'original', 'corrected', 'comparison'
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(correctedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Corrected Text</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab ${view === 'original' ? 'active' : ''}`}
            onClick={() => setView('original')}
          >
            Original
          </button>
          <button
            className={`tab ${view === 'corrected' ? 'active' : ''}`}
            onClick={() => setView('corrected')}
          >
            Corrected
          </button>
          <button
            className={`tab ${view === 'comparison' ? 'active' : ''}`}
            onClick={() => setView('comparison')}
          >
            Compare
          </button>
        </div>

        <div className="modal-body">
          {view === 'original' && (
            <div className="text-view">
              <div className="view-label">Original Text</div>
              <div className="text-content original">
                {originalText}
              </div>
            </div>
          )}

          {view === 'corrected' && (
            <div className="text-view">
              <div className="view-label">Corrected Text (Hallucinations Removed)</div>
              <div className="text-content corrected">
                {correctedText}
              </div>
            </div>
          )}

          {view === 'comparison' && (
            <div className="comparison-view">
              <div className="comparison-column">
                <div className="view-label">Original</div>
                <div className="text-content original">
                  {originalText}
                </div>
              </div>
              <div className="comparison-divider">
                <div className="arrow">→</div>
              </div>
              <div className="comparison-column">
                <div className="view-label">Corrected</div>
                <div className="text-content corrected">
                  {correctedText}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className={`btn-secondary ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Text
              </>
            )}
          </button>
          <button className="btn-primary" onClick={onApply}>
            Apply Corrections
          </button>
        </div>

        {copied && (
          <div className="toast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}

export default CorrectedTextModal;
