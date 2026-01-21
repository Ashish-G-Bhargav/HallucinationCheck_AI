import './RateLimitBanner.css';

function RateLimitBanner({ requestCount, isOffline }) {
    const maxRequests = 10; // Advisory limit
    const percentUsed = (requestCount / maxRequests) * 100;
    const showWarning = requestCount >= 7;

    if (isOffline) {
        return (
            <div className="rate-limit-banner offline">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
                <span>You're offline. Requests will be queued.</span>
            </div>
        );
    }

    if (!showWarning) return null;

    return (
        <div className={`rate-limit-banner ${requestCount >= maxRequests ? 'critical' : 'warning'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
                {requestCount >= maxRequests
                    ? `Request limit reached (${requestCount}/${maxRequests}). Consider waiting.`
                    : `${requestCount}/${maxRequests} requests this session`
                }
            </span>
            <div className="rate-bar">
                <div className="rate-bar-fill" style={{ width: `${Math.min(percentUsed, 100)}%` }} />
            </div>
        </div>
    );
}

export default RateLimitBanner;
