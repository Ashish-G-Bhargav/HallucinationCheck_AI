import './BackgroundEffects.css';

function BackgroundEffects() {
    return (
        <div className="background-effects">
            {/* Floating particles */}
            <div className="particles">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            '--delay': `${i * 0.8}s`,
                            '--duration': `${15 + Math.random() * 10}s`,
                            '--x-start': `${Math.random() * 100}%`,
                            '--x-end': `${Math.random() * 100}%`,
                            '--size': `${4 + Math.random() * 8}px`
                        }}
                    />
                ))}
            </div>

            {/* Glowing corner accents */}
            <div className="corner-glow top-left" />
            <div className="corner-glow bottom-right" />

            {/* Animated lines */}
            <div className="scan-line" />
        </div>
    );
}

export default BackgroundEffects;
