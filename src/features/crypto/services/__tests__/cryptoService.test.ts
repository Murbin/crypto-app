// Mock de expo-constants y expo-crypto
jest.mock('expo-constants', () => ({
    expoConfig: { extra: { apiUrl: 'https://mocked-api.com' } },
}));
jest.mock('expo-crypto', () => ({
    digestStringAsync: jest.fn().mockResolvedValue('mockedhash'),
    CryptoDigestAlgorithm: { SHA256: 'SHA256' },
}));

import { CryptoService } from '../cryptoService';

describe('CryptoService', () => {
    it('generateDataHash returns a hash', async () => {
        const service = CryptoService.getInstance();
        // @ts-ignore: access private for test
        const hash = await service.generateDataHash({ foo: 'bar' });
        expect(hash).toBe('mockedhash');
    });
}); 