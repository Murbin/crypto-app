import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Crypto {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    image: string;
    price_change_percentage_24h: number;
}

interface CryptoState {
    cryptos: Crypto[];
    filteredCryptos: Crypto[];
    selectedCrypto: Crypto | null;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
    retryCount: number;
}

const initialState: CryptoState = {
    cryptos: [],
    filteredCryptos: [],
    selectedCrypto: null,
    loading: false,
    loadingMore: false,
    error: null,
    page: 1,
    hasMore: true,
    retryCount: 0,
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCryptos = createAsyncThunk(
    'crypto/fetchCryptos',
    async (page: number = 1, { getState, rejectWithValue }) => {
        try {
            // Add minimal delay between requests to avoid rate limiting
            await delay(100);

            const response = await axios.get(
                'https://api.coingecko.com/api/v3/coins/markets',
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
                const state = getState() as { crypto: CryptoState };
                if (state.crypto.retryCount < 3) {
                    // Wait longer between retries
                    await delay(1000 * (state.crypto.retryCount + 1));
                    return rejectWithValue('Rate limit exceeded. Retrying...');
                }
            }
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch cryptos');
        }
    }
);

const cryptoSlice = createSlice({
    name: 'crypto',
    initialState,
    reducers: {
        filterCryptos: (state, action) => {
            const searchTerm = action.payload.toLowerCase();
            state.filteredCryptos = state.cryptos.filter(
                crypto =>
                    crypto.name.toLowerCase().includes(searchTerm) ||
                    crypto.symbol.toLowerCase().includes(searchTerm)
            );
        },
        selectCrypto: (state, action) => {
            state.selectedCrypto = action.payload;
        },
        resetPagination: (state) => {
            state.page = 1;
            state.hasMore = true;
            state.cryptos = [];
            state.filteredCryptos = [];
            state.retryCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCryptos.pending, (state, action) => {
                if (action.meta.arg === 1) {
                    state.loading = true;
                } else {
                    state.loadingMore = true;
                }
                state.error = null;
            })
            .addCase(fetchCryptos.fulfilled, (state, action) => {
                state.loading = false;
                state.loadingMore = false;
                state.retryCount = 0;
                if (action.payload.page === 1) {
                    state.cryptos = action.payload.data;
                    state.filteredCryptos = action.payload.data;
                } else {
                    state.cryptos = [...state.cryptos, ...action.payload.data];
                    state.filteredCryptos = [...state.filteredCryptos, ...action.payload.data];
                }
                state.page = action.payload.page;
                state.hasMore = action.payload.data.length === 20;
            })
            .addCase(fetchCryptos.rejected, (state, action) => {
                state.loading = false;
                state.loadingMore = false;
                if (action.payload === 'Rate limit exceeded. Retrying...') {
                    state.retryCount += 1;
                    state.error = `Rate limit exceeded. Retry attempt ${state.retryCount} of 3`;
                } else {
                    state.error = action.payload as string;
                }
            });
    },
});

export const { filterCryptos, selectCrypto, resetPagination } = cryptoSlice.actions;
export default cryptoSlice.reducer; 