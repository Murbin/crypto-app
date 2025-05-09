import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { fetchCryptos, filterCryptos, selectCrypto, Crypto } from '../redux/cryptoSlice';
import { useNavigation } from '@react-navigation/native';
import { CryptoItem } from '../components/CryptoItem';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const CryptoListScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { filteredCryptos, loading, error } = useAppSelector((state) => state.crypto);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchCryptos());
    }, [dispatch]);

    const handleSearch = useCallback((text: string) => {
        setSearchTerm(text);
        dispatch(filterCryptos(text));
    }, [dispatch]);

    const handleCryptoPress = useCallback((crypto: Crypto) => {
        dispatch(selectCrypto(crypto));
        navigation.navigate('CryptoDetail' as never);
    }, [dispatch, navigation]);

    const renderItem = useCallback(({ item }: { item: Crypto }) => (
        <CryptoItem
            item={item}
            onPress={() => handleCryptoPress(item)}
        />
    ), [handleCryptoPress]);

    const keyExtractor = useCallback((item: Crypto) => item.id, []);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchCryptos());
        setRefreshing(false);
    }, [dispatch]);

    if (loading && !refreshing) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <View className="flex-1 bg-background">
            <TextInput
                className="mx-4 my-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChangeText={handleSearch}
                returnKeyType="search"
                clearButtonMode="while-editing"
                autoCorrect={false}
                autoCapitalize="none"
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
                overrideItemLayout={(layout, item) => {
                    layout.size = 80;
                }}
            />
        </View>
    );
}; 