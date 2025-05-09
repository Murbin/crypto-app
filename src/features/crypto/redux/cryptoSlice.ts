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
    error: string | null;
}

const initialState: CryptoState = {
    cryptos: [],
    filteredCryptos: [],
    selectedCrypto: null,
    loading: false,
    error: null,
};

export const fetchCryptos = createAsyncThunk(
    'crypto/fetchCryptos',
    async () => {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/coins/markets',
            {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 100,
                    page: 1,
                    sparkline: false,
                },
            }
        );
        return response.data;
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCryptos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCryptos.fulfilled, (state, action) => {
                state.loading = false;
                state.cryptos = action.payload;
                state.filteredCryptos = action.payload;
            })
            .addCase(fetchCryptos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch cryptos';
            });
    },
});

export const { filterCryptos, selectCrypto } = cryptoSlice.actions;
export default cryptoSlice.reducer; 