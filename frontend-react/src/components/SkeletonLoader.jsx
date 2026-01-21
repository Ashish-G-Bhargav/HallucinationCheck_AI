import './SkeletonLoader.css';

function SkeletonLoader() {
    return (
        <div className="skeleton-container">
            <div className="skeleton-stats">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="skeleton-stat-card">
                        <div className="skeleton-circle"></div>
                        <div className="skeleton-lines">
                            <div className="skeleton-line short"></div>
                            <div className="skeleton-line"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="skeleton-header">
                <div className="skeleton-line medium"></div>
            </div>

            <div className="skeleton-claims">
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton-claim-card">
                        <div className="skeleton-claim-header">
                            <div className="skeleton-badge"></div>
                            <div className="skeleton-badge"></div>
                        </div>
                        <div className="skeleton-claim-body">
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line long"></div>
                            <div className="skeleton-line medium"></div>
                        </div>
                        <div className="skeleton-claim-footer">
                            <div className="skeleton-bar"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonLoader;
