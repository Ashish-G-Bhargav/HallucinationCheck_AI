import { useState } from 'react';
import './HistoryPanel.css';

function HistoryPanel({ history, onRestore, onDelete, onClear, isOpen, onClose }) {
    const [confirmClear, setConfirmClear] = useState(false);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const truncateText = (text, maxLength = 80) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleClearAll = () => {
        if (confirmClear) {
            onClear();
            setConfirmClear(false);
        } else {
            setConfirmClear(true);
            setTimeout(() => setConfirmClear(false), 3000);
        }
    };

    return (
        <>
            <div className={`history-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`history-panel ${isOpen ? 'open' : ''}`}>
                <div className="history-header">
                    <h3>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        History
                    </h3>
                    <button className="history-close" onClick={onClose}>✕</button>
                </div>

                <div className="history-content">
                    {history.length === 0 ? (
                        <div className="history-empty">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <p>No analyses yet</p>
                            <span>Your past checks will appear here</span>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.map((item, index) => (
                                <div key={item.id || index} className="history-item">
                                    <div className="history-item-header">
                                        <span className="history-date">{formatDate(item.timestamp)}</span>
                                        <div className="history-stats">
                                            {item.stats?.hallucinations > 0 && (
                                                <span className="stat hallucination">{item.stats.hallucinations} issues</span>
                                            )}
                                            {item.stats?.verified > 0 && (
                                                <span className="stat verified">{item.stats.verified} verified</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="history-item-text">{truncateText(item.text)}</div>
                                    <div className="history-item-actions">
                                        <button className="history-restore" onClick={() => onRestore(item)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="1 4 1 10 7 10" />
                                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                            </svg>
                                            Restore
                                        </button>
                                        <button className="history-delete" onClick={() => onDelete(item.id)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {history.length > 0 && (
                    <div className="history-footer">
                        <button
                            className={`history-clear ${confirmClear ? 'confirm' : ''}`}
                            onClick={handleClearAll}
                        >
                            {confirmClear ? 'Click again to confirm' : 'Clear All History'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default HistoryPanel;
