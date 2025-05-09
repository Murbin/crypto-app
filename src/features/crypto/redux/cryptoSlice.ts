import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CryptoService, CryptoResponse } from '../services/cryptoService';

export type Crypto = CryptoResponse;

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

export const fetchCryptos = createAsyncThunk(
    'crypto/fetchCryptos',
    async (page: number = 1, { getState, rejectWithValue }) => {
        try {
            const cryptoService = CryptoService.getInstance();
            return await cryptoService.fetchCryptos(page);
        } catch (error: any) {
            if (error.message === 'Rate limit exceeded. Retrying...') {
                const state = getState() as { crypto: CryptoState };
                if (state.crypto.retryCount < 3) {
                    return rejectWithValue('Rate limit exceeded. Retrying...');
                }
            }
            return rejectWithValue(error.message);
        }
    }
);

const cryptoSlice = createSlice({
    name: 'crypto',
    initialState,
    reducers: {
        filterCryptos: (state, action) => {
            if (typeof action.payload === 'string') {
                const searchTerm = action.payload.toLowerCase();
                state.filteredCryptos = state.cryptos.filter(
                    crypto =>
                        crypto.name.toLowerCase().includes(searchTerm) ||
                        crypto.symbol.toLowerCase().includes(searchTerm)
                );
            } else {
                state.filteredCryptos = action.payload;
            }
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