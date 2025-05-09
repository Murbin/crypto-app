import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CryptoService, CryptoResponse } from '../services/cryptoService';

export type Crypto = CryptoResponse;

interface SecurityAlert {
    id: string;
    type: 'price_spike' | 'price_drop' | 'data_integrity';
    message: string;
    timestamp: number;
    severity: 'high' | 'medium' | 'low';
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
    securityAlerts: SecurityAlert[];
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
    securityAlerts: [],
};

const PRICE_CHANGE_THRESHOLD = 10; // 10% change threshold for alerts

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
        clearSecurityAlerts: (state) => {
            state.securityAlerts = [];
        },
        addSecurityAlert: (state, action) => {
            state.securityAlerts.push(action.payload);
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

                // Verificar cambios significativos en los precios
                const newData = action.payload.data;
                const oldData = state.cryptos;

                newData.forEach((newCrypto) => {
                    const oldCrypto = oldData.find(c => c.id === newCrypto.id);
                    if (oldCrypto) {
                        const priceChange = Math.abs(newCrypto.price_change_percentage_24h - oldCrypto.price_change_percentage_24h);

                        if (priceChange > PRICE_CHANGE_THRESHOLD) {
                            const alert: SecurityAlert = {
                                id: `${newCrypto.id}-${Date.now()}`,
                                type: newCrypto.price_change_percentage_24h > oldCrypto.price_change_percentage_24h ? 'price_spike' : 'price_drop',
                                message: `Significant price change detected for ${newCrypto.name}: ${priceChange.toFixed(2)}%`,
                                timestamp: Date.now(),
                                severity: priceChange > PRICE_CHANGE_THRESHOLD * 2 ? 'high' : 'medium'
                            };
                            state.securityAlerts.push(alert);
                        }
                    }
                });

                if (action.payload.page === 1) {
                    state.cryptos = newData;
                    state.filteredCryptos = newData;
                } else {
                    state.cryptos = [...state.cryptos, ...newData];
                    state.filteredCryptos = [...state.filteredCryptos, ...newData];
                }
                state.page = action.payload.page;
                state.hasMore = newData.length === 20;
            })
            .addCase(fetchCryptos.rejected, (state, action) => {
                state.loading = false;
                state.loadingMore = false;
                if (action.payload === 'Rate limit exceeded. Retrying...') {
                    state.retryCount += 1;
                    state.error = `Rate limit exceeded. Retry attempt ${state.retryCount} of 3`;
                } else {
                    state.error = action.payload as string;
                    // Agregar alerta de seguridad para errores
                    const alert: SecurityAlert = {
                        id: `error-${Date.now()}`,
                        type: 'data_integrity',
                        message: `Data integrity issue detected: ${action.payload}`,
                        timestamp: Date.now(),
                        severity: 'high'
                    };
                    state.securityAlerts.push(alert);
                }
            });
    },
});

export const { filterCryptos, selectCrypto, resetPagination, clearSecurityAlerts, addSecurityAlert } = cryptoSlice.actions;
export default cryptoSlice.reducer; 