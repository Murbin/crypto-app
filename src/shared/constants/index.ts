// Alert Types
export const ALERT_TYPES = {
    PRICE_SPIKE: 'price_spike',
    PRICE_DROP: 'price_drop',
    DATA_INTEGRITY: 'data_integrity'
} as const;

// Alert Severity
export const ALERT_SEVERITY = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
} as const;

// Crypto Names for Simulation
export const CRYPTO_NAMES = ['Bitcoin', 'Ethereum', 'Solana', 'Cardano'] as const;

// Alert Messages
export const ALERT_MESSAGES = {
    DATA_INTEGRITY: (crypto: string) => `Data integrity issue detected for ${crypto}`,
    PRICE_CHANGE: (type: string, crypto: string, change: string) =>
        `Significant price ${type === ALERT_TYPES.PRICE_SPIKE ? 'spike' : 'drop'} detected for ${crypto}: ${change}%`
} as const;

// Colors
export const COLORS = {
    PRIMARY: '#f4511e',
    SECONDARY: '#666666',
    SUCCESS: '#4CAF50',
    DANGER: '#F44336',
    WARNING: '#FFC107',
    INFO: '#2196F3',
    LIGHT: '#f5f5f5',
    DARK: '#333333',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY: {
        100: '#f8f9fa',
        200: '#e9ecef',
        300: '#dee2e6',
        400: '#ced4da',
        500: '#adb5bd',
        600: '#6c757d',
        700: '#495057',
        800: '#343a40',
        900: '#212529'
    }
} as const;

// API Constants
export const API = {
    BASE_URL: 'https://api.coingecko.com/api/v3',
    PER_PAGE: 20,
    RETRY_LIMIT: 3
} as const;

// UI Constants
export const UI = {
    ANIMATION_DURATION: 300,
    ALERT_DISPLAY_TIME: 5000,
    PRICE_CHANGE_THRESHOLD: 10
} as const; 