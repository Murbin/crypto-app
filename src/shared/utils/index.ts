import { ALERT_TYPES, ALERT_SEVERITY, CRYPTO_NAMES, ALERT_MESSAGES } from '../constants';

/**
 * Genera un ID único basado en el timestamp actual
 */
export const generateUniqueId = (prefix: string = ''): string => {
    return `${prefix}-${Date.now()}`;
};

/**
 * Simula una alerta de seguridad con datos aleatorios
 */
export const generateRandomAlert = () => {
    const alertTypes = Object.values(ALERT_TYPES);
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomCrypto = CRYPTO_NAMES[Math.floor(Math.random() * CRYPTO_NAMES.length)];
    const randomChange = (Math.random() * 30).toFixed(2);

    return {
        id: generateUniqueId('sim'),
        type: randomType,
        message: randomType === ALERT_TYPES.DATA_INTEGRITY
            ? ALERT_MESSAGES.DATA_INTEGRITY(randomCrypto)
            : ALERT_MESSAGES.PRICE_CHANGE(randomType, randomCrypto, randomChange),
        timestamp: Date.now(),
        severity: Math.random() > 0.5 ? ALERT_SEVERITY.HIGH : ALERT_SEVERITY.MEDIUM
    };
};

/**
 * Formatea un número como moneda
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

/**
 * Formatea un número como porcentaje
 */
export const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
};

/**
 * Retrasa la ejecución por un tiempo determinado
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}; 