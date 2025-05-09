import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { fetchCryptos, filterCryptos, selectCrypto, Crypto, resetPagination } from '../redux/cryptoSlice';
import { useNavigation } from '@react-navigation/native';
import { CryptoItem } from '../components/CryptoItem';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { LoadingFooter } from '../components/LoadingFooter';
import { CryptoFilters } from '../components/CryptoFilters';
import { SecurityAlerts } from '../components/SecurityAlerts';

/**
 * CryptoListScreen Component
 * 
 * Main screen that displays a list of cryptocurrencies with search functionality.
 * Features:
 * - Real-time cryptocurrency data display
 * - Search functionality
 * - Pull-to-refresh
 * - Error handling
 * - Loading states
 * 
 * @component
 * @returns {JSX.Element} The rendered component
 */
export const CryptoListScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { filteredCryptos, loading, loadingMore, error, page, hasMore, retryCount } = useAppSelector((state) => state.crypto);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [showLoadingFooter, setShowLoadingFooter] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const loadMoreTimeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        dispatch(fetchCryptos(1));
    }, [dispatch]);

    /**
     * Handles the search functionality
     * Updates the search term and filters the cryptocurrency list
     * 
     * @param {string} text - The search term entered by the user
     */
    const handleSearch = useCallback((text: string) => {
        setSearchTerm(text);
        dispatch(filterCryptos(text));
    }, [dispatch]);

    /**
     * Handles the selection of a cryptocurrency
     * Dispatches the selected crypto to the store and navigates to detail screen
     * 
     * @param {Crypto} crypto - The selected cryptocurrency object
     */
    const handleCryptoPress = useCallback((crypto: Crypto) => {
        dispatch(selectCrypto(crypto));
        navigation.navigate('CryptoDetail' as never);
    }, [dispatch, navigation]);

    /**
     * Renders a single cryptocurrency item
     * 
     * @param {{ item: Crypto }} param0 - The cryptocurrency item to render
     * @returns {JSX.Element} The rendered CryptoItem component
     */
    const renderItem = useCallback(({ item }: { item: Crypto }) => (
        <CryptoItem
            item={item}
            onPress={() => handleCryptoPress(item)}
        />
    ), [handleCryptoPress]);

    /**
     * Extracts a unique key for each cryptocurrency item
     * 
     * @param {Crypto} item - The cryptocurrency item
     * @returns {string} The unique identifier
     */
    const keyExtractor = useCallback((item: Crypto) => item.id, []);

    /**
     * Handles the pull-to-refresh functionality
     * Fetches fresh cryptocurrency data
     */
    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        dispatch(resetPagination());
        await dispatch(fetchCryptos(1));
        setRefreshing(false);
    }, [dispatch]);

    const handleLoadMore = useCallback(() => {
        if (!loading && !loadingMore && hasMore && !searchTerm && !error) {
            // Show loading footer immediately
            setShowLoadingFooter(true);

            // Clear any existing timeout
            if (loadMoreTimeout.current) {
                clearTimeout(loadMoreTimeout.current);
            }

            // Debounce the load more action with a shorter delay
            loadMoreTimeout.current = setTimeout(async () => {
                await dispatch(fetchCryptos(page + 1));
                setShowLoadingFooter(false);
            }, 200); // Reduced from 500ms to 200ms
        }
    }, [loading, loadingMore, hasMore, page, searchTerm, error, dispatch]);

    const handleRetry = useCallback(() => {
        dispatch(fetchCryptos(page));
    }, [dispatch, page]);

    const handleFilterChange = useCallback((filter: string) => {
        setActiveFilter(filter);
        let filtered = [...filteredCryptos];

        switch (filter) {
            case 'top':
                filtered = filtered.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
                break;
            case 'gainers':
                filtered = filtered.filter(crypto => crypto.price_change_percentage_24h > 0)
                    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
                break;
            case 'losers':
                filtered = filtered.filter(crypto => crypto.price_change_percentage_24h < 0)
                    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
                break;
            default:
                filtered = filtered.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
        }

        dispatch(filterCryptos(filtered));
    }, [dispatch, filteredCryptos]);

    if (loading && !refreshing && page === 1) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={handleRetry}
                showRetry={retryCount < 3}
            />
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <SecurityAlerts />
            <TextInput
                className="mx-4 my-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChangeText={handleSearch}
                returnKeyType="search"
            />
            <CryptoFilters
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
            />
            <FlashList
                data={filteredCryptos}
                renderItem={renderItem}
                estimatedItemSize={80}
                keyExtractor={keyExtractor}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                ListEmptyComponent={EmptyState}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={Platform.OS === 'android'}
                drawDistance={200}
                estimatedFirstItemOffset={0}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={showLoadingFooter || loadingMore ? LoadingFooter : null}
                overrideItemLayout={(layout, item) => {
                    layout.size = 80;
                }}
            />
        </View>
    );
}; 