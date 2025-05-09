// Mock de expo-constants y expo-crypto
jest.mock('expo-constants', () => ({
    expoConfig: { extra: { apiUrl: 'https://mocked-api.com' } },
}));
jest.mock('expo-crypto', () => ({
    digestStringAsync: jest.fn().mockResolvedValue('mockedhash'),
    CryptoDigestAlgorithm: { SHA256: 'SHA256' },
}));

import reducer, { addSecurityAlert } from '../cryptoSlice';

describe('cryptoSlice reducer', () => {
    it('should add a security alert', () => {
        const initialState = {
            cryptos: [],
            filteredCryptos: [],
            selectedCrypto: null,
            loading: false,
            loadingMore: false,
            error: null,
            page: 1,
            hasMore: true,
            retryCount: 0,
            securityAlerts: [],
        };

        const alert = {
            id: 'test',
            type: 'price_spike',
            message: 'Test alert',
            timestamp: Date.now(),
            severity: 'high',
        };

        const state = reducer(initialState, addSecurityAlert(alert));
        expect(state.securityAlerts).toContainEqual(alert);
    });
}); 