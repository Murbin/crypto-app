import axios from 'axios';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';

export interface CryptoResponse {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    image: string;
    price_change_percentage_24h: number;
    dataHash?: string; // Hash para verificación de integridad
}

export class CryptoService {
    private static instance: CryptoService;
    private readonly baseUrl: string;
    private readonly delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    private constructor() {
        this.baseUrl = Constants.expoConfig?.extra?.apiUrl || 'https://api.coingecko.com/api/v3';
    }

    public static getInstance(): CryptoService {
        if (!CryptoService.instance) {
            CryptoService.instance = new CryptoService();
        }
        return CryptoService.instance;
    }

    private async generateDataHash(data: any): Promise<string> {
        const dataString = JSON.stringify(data);
        return await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            dataString
        );
    }

    private async verifyDataIntegrity(data: CryptoResponse[]): Promise<boolean> {
        for (const crypto of data) {
            if (!crypto.dataHash) continue;

            const { dataHash, ...cryptoData } = crypto;
            const calculatedHash = await this.generateDataHash(cryptoData);

            if (calculatedHash !== dataHash) {
                console.warn(`Data integrity check failed for ${crypto.name}`);
                return false;
            }
        }
        return true;
    }

    // Nueva función para verificar manualmente una criptomoneda específica
    public async verifyCryptoIntegrity(crypto: CryptoResponse): Promise<{ isValid: boolean; currentHash: string; storedHash: string }> {
        const { dataHash, ...cryptoData } = crypto;
        const currentHash = await this.generateDataHash(cryptoData);

        return {
            isValid: currentHash === dataHash,
            currentHash,
            storedHash: dataHash || 'No hash stored'
        };
    }

    public async fetchCryptos(page: number = 1): Promise<{ data: CryptoResponse[], page: number }> {
        try {
            await this.delay(100);

            const response = await axios.get(
                `${this.baseUrl}/coins/markets`,
                {
                    params: {
                        vs_currency: 'usd',
                        per_page: 20,
                        page: page,
                        sparkline: false,
                    },
                }
            );

            // Generar hash para cada criptomoneda
            const dataWithHashes = await Promise.all(
                response.data.map(async (crypto: CryptoResponse) => {
                    const dataHash = await this.generateDataHash(crypto);
                    return { ...crypto, dataHash };
                })
            );

            // Verificar integridad de los datos
            const isDataValid = await this.verifyDataIntegrity(dataWithHashes);
            if (!isDataValid) {
                throw new Error('Data integrity verification failed');
            }

            return { data: dataWithHashes, page };
        } catch (error: any) {
            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Retrying...');
            }
            throw new Error(error.response?.data?.error || 'Failed to fetch cryptos');
        }
    }
} 