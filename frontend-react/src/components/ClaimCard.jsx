import './ClaimCard.css';

const STATUS_CONFIG = {
  VERIFIED: {
    icon: '✓',
    label: 'Verified'
  },
  HALLUCINATION: {
    icon: '✕',
    label: 'Hallucination'
  },
  SUSPICIOUS: {
    icon: '!',
    label: 'Suspicious'
  },
  OPINION: {
    icon: '○',
    label: 'Opinion'
  }
};

function ClaimCard({ claim, index }) {
  const config = STATUS_CONFIG[claim.status] || STATUS_CONFIG.OPINION;

  return (
    <div className={`claim-card ${claim.status.toLowerCase()}`}>
      <div className="claim-header">
        <div className="claim-number">Claim {index + 1}</div>
        <div className={`claim-status ${claim.status.toLowerCase()}`}>
          <span className="status-icon">{config.icon}</span>
          {config.label}
        </div>
      </div>

      <div className="claim-text">
        "{claim.original_text}"
      </div>

      <div className="claim-details">
        <div className="detail-row">
          <span className="detail-label">Type</span>
          <span className="detail-value">{claim.type}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Reasoning</span>
          <span className="detail-value">{claim.reasoning}</span>
        </div>

        {claim.correction && (
          <div className="detail-row correction">
            <span className="detail-label">Correction</span>
            <span className="detail-value">{claim.correction}</span>
          </div>
        )}

        {claim.source_url && (
          <div className="detail-row">
            <span className="detail-label">Source</span>
            <a
              href={claim.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link"
            >
              {claim.source_url}
            </a>
          </div>
        )}

        <div className="confidence-section">
          <div className="confidence-info">
            <span className="label">Confidence</span>
            <span className="value">{claim.confidence_score}%</span>
          </div>
          <div className="confidence-ring-container">
            <svg className="confidence-ring" viewBox="0 0 36 36">
              <circle
                className="confidence-ring-bg"
                cx="18"
                cy="18"
                r="14"
                fill="none"
              />
              <circle
                className={`confidence-ring-fill ${claim.status.toLowerCase()}`}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                strokeDasharray={`${claim.confidence_score * 0.88} 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimCard;
