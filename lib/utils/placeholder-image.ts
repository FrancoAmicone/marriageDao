/**
 * Generate a beautiful SVG placeholder for NFT images
 * This is used when the IPFS image is not available
 */

export function generatePlaceholderSVG(type: 'vow' | 'milestone', year?: string): string {
    const colors = type === 'vow' 
        ? {
            primary: '#ec4899',  // pink-500
            secondary: '#a855f7', // purple-500
            accent: '#f472b6',   // pink-400
        }
        : {
            primary: '#f59e0b',  // amber-500
            secondary: '#ea580c', // orange-600
            accent: '#fbbf24',   // amber-400
        };

    const icon = type === 'vow' ? '💝' : '🏆';
    const title = type === 'vow' ? 'Marriage Vow' : `Year ${year || '?'}`;

    const svg = `
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
                    <stop offset="50%" style="stop-color:${colors.accent};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Background -->
            <rect width="400" height="400" fill="url(#bg)"/>
            
            <!-- Decorative circles -->
            <circle cx="80" cy="80" r="60" fill="white" opacity="0.1"/>
            <circle cx="320" cy="320" r="80" fill="white" opacity="0.1"/>
            <circle cx="200" cy="200" r="120" fill="white" opacity="0.05"/>
            
            <!-- Icon -->
            <text x="200" y="180" font-size="80" text-anchor="middle" filter="url(#glow)">
                ${icon}
            </text>
            
            <!-- Title -->
            <text x="200" y="240" font-size="28" font-weight="bold" text-anchor="middle" fill="white" opacity="0.95">
                ${title}
            </text>
            
            <!-- Universal Human TIME Protocol -->
            <text x="200" y="270" font-size="12" text-anchor="middle" fill="white" opacity="0.7">
                Universal Human TIME Protocol
            </text>
            
            <!-- Decorative elements -->
            <text x="60" y="60" font-size="24" opacity="0.3">✨</text>
            <text x="340" y="340" font-size="24" opacity="0.3">💫</text>
            <text x="340" y="60" font-size="24" opacity="0.3">⭐</text>
            <text x="60" y="340" font-size="24" opacity="0.3">🌟</text>
        </svg>
    `;

    // Convert to base64 data URI
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

export function getPlaceholderImage(type: 'vow' | 'milestone', year?: string): string {
    return generatePlaceholderSVG(type, year);
}

