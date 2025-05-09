import axios from 'axios';
import Constants from 'expo-constants';

export interface CryptoResponse {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    image: string;
    price_change_percentage_24h: number;
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
            return { data: response.data, page };
        } catch (error: any) {
            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Retrying...');
            }
            throw new Error(error.response?.data?.error || 'Failed to fetch cryptos');
        }
    }
} 