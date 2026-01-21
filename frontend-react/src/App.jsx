import { useState, useEffect } from 'react';
import './App.css';
import { verifyText } from './api';
import ClaimCard from './components/ClaimCard';
import TextInput from './components/TextInput';
import Header from './components/Header';
import Stats from './components/Stats';
import CorrectedTextModal from './components/CorrectedTextModal';
import SkeletonLoader from './components/SkeletonLoader';
import HistoryPanel from './components/HistoryPanel';
import RateLimitBanner from './components/RateLimitBanner';
import { exportAsMarkdown } from './utils/exportUtils';
import BackgroundEffects from './components/BackgroundEffects';

const SAMPLE_TEXT = `Recent studies by Johnson et al. (2024) in the Journal of Advanced AI suggest that neural networks consume 50% less energy when trained on quantum hardware. This breakthrough, known as the 'Quantum Leap Protocol', was validated by Google DeepMind in their 2023 annual report. Meanwhile, the moon is made of green cheese, a fact confirmed by NASA in 1969. The Transformer architecture was introduced by Vaswani et al. in their 2017 paper "Attention Is All You Need".`;

function App() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCorrectedModal, setShowCorrectedModal] = useState(false);
  const [correctedText, setCorrectedText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Load saved API key and history on mount
    const savedApiKey = localStorage.getItem('vibecheck-api-key') || '';
    setApiKey(savedApiKey);

    const savedHistory = localStorage.getItem('vibecheck-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const saveToHistory = (analysisText, analysisReport, analysisStats) => {
    const newEntry = {
      id: Date.now(),
      timestamp: Date.now(),
      text: analysisText,
      report: analysisReport,
      stats: analysisStats
    };
    const updatedHistory = [newEntry, ...history].slice(0, 20); // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem('vibecheck-history', JSON.stringify(updatedHistory));
  };

  const handleHistoryRestore = (item) => {
    setText(item.text);
    setReport(item.report);
    setShowHistory(false);
  };

  const handleHistoryDelete = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('vibecheck-history', JSON.stringify(updatedHistory));
  };

  const handleHistoryClear = () => {
    setHistory([]);
    localStorage.removeItem('vibecheck-history');
  };

  const handleApiKeyChange = (newApiKey) => {
    setApiKey(newApiKey);
  };

  const handleAudit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please configure your API key first. Click the API button in the header.');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await verifyText(text, apiKey);
      setReport(result);
      setRequestCount(prev => prev + 1);

      // Calculate stats and save to history
      const analysisStats = {
        verified: result.claims?.filter(c => c.status === 'VERIFIED').length || 0,
        hallucinations: result.claims?.filter(c => c.status === 'HALLUCINATION').length || 0,
        suspicious: result.claims?.filter(c => c.status === 'SUSPICIOUS').length || 0,
        total: result.claims?.length || 0
      };
      saveToHistory(text, result, analysisStats);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to VibeCheck API. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFix = () => {
    if (!report?.claims) return;

    let fixedText = text;
    report.claims.forEach(claim => {
      if (claim.status === 'HALLUCINATION' && claim.correction) {
        fixedText = fixedText.replace(claim.original_text, claim.correction);
      }
    });
    setCorrectedText(fixedText);
    setShowCorrectedModal(true);
  };

  const handleApplyCorrectedText = () => {
    setText(correctedText);
    setShowCorrectedModal(false);
    setReport(null);
  };

  const getStats = () => {
    if (!report?.claims) return { verified: 0, hallucinations: 0, suspicious: 0, total: 0 };

    const stats = {
      verified: 0,
      hallucinations: 0,
      suspicious: 0,
      total: report.claims.length
    };

    report.claims.forEach(claim => {
      if (claim.status === 'VERIFIED') stats.verified++;
      else if (claim.status === 'HALLUCINATION') stats.hallucinations++;
      else if (claim.status === 'SUSPICIOUS') stats.suspicious++;
    });

    return stats;
  };

  const stats = getStats();

  return (
    <div className="app">
      <BackgroundEffects />
      <Header
        onApiKeyChange={handleApiKeyChange}
        apiKey={apiKey}
        onHistoryToggle={() => setShowHistory(!showHistory)}
        historyCount={history.length}
      />

      <main className="container">
        <RateLimitBanner requestCount={requestCount} isOffline={isOffline} />

        <div className="input-section">
          <TextInput
            value={text}
            onChange={setText}
            onAudit={handleAudit}
            loading={loading}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        {report && (
          <>
            <Stats stats={stats} />

            <div className="results-section">
              <div className="results-header">
                <h2>Analysis Results</h2>
                <div className="results-actions">
                  <button className="export-btn" onClick={() => exportAsMarkdown(text, report, stats)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export
                  </button>
                  {stats.hallucinations > 0 && (
                    <button className="auto-fix-btn" onClick={handleAutoFix}>
                      Auto-Fix All
                    </button>
                  )}
                </div>
              </div>

              <div className="claims-list">
                {report.claims.map((claim, index) => (
                  <ClaimCard key={index} claim={claim} index={index} />
                ))}
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="loading-container">
            <p className="loading-text">Analyzing text for hallucinations...</p>
            <SkeletonLoader />
          </div>
        )}

        {showCorrectedModal && (
          <CorrectedTextModal
            originalText={text}
            correctedText={correctedText}
            onApply={handleApplyCorrectedText}
            onClose={() => setShowCorrectedModal(false)}
          />
        )}
      </main>

      <HistoryPanel
        history={history}
        onRestore={handleHistoryRestore}
        onDelete={handleHistoryDelete}
        onClear={handleHistoryClear}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      <footer className="footer">
        <p>Powered by Gemini 2.0 Flash — Built with React & FastAPI</p>
      </footer>
    </div>
  );
}

export default App;
