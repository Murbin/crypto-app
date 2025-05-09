import React, { useEffect, useState, useCallback, memo } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { fetchCryptos, filterCryptos, selectCrypto, Crypto } from '../redux/cryptoSlice';
import { useNavigation } from '@react-navigation/native';

// Memoized CryptoItem component for better performance
const CryptoItem = memo(({ item, onPress }: { item: Crypto; onPress: () => void }) => (
    <TouchableOpacity
        className="flex-row p-4 bg-white my-1 rounded-lg items-center shadow-sm"
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Image
            source={{ uri: item.image }}
            className="w-10 h-10 rounded-full bg-gray-100"
            defaultSource={require('../../../../assets/placeholder.png')}
        />
        <View className="flex-1 ml-4">
            <Text className="text-base font-bold" numberOfLines={1}>{item.name}</Text>
            <Text className="text-sm text-secondary">{item.symbol.toUpperCase()}</Text>
        </View>
        <View className="items-end">
            <Text className="text-base font-bold">${item.current_price.toFixed(2)}</Text>
            <Text
                className={`text-sm ${item.price_change_percentage_24h > 0
                        ? 'text-success'
                        : 'text-danger'
                    }`}
            >
                {item.price_change_percentage_24h.toFixed(2)}%
            </Text>
        </View>
    </TouchableOpacity>
));

// Memoized empty component
const EmptyComponent = memo(() => (
    <View className="flex-1 justify-center items-center py-5">
        <Text className="text-base text-secondary">No cryptocurrencies found</Text>
    </View>
));

// Memoized loading component
const LoadingComponent = memo(() => (
    <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f4511e" />
    </View>
));

// Memoized error component
const ErrorComponent = memo(({ message }: { message: string }) => (
    <View className="flex-1 justify-center items-center">
        <Text className="text-base text-danger">{message}</Text>
    </View>
));

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
        return <LoadingComponent />;
    }

    if (error) {
        return <ErrorComponent message={error} />;
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
                ListEmptyComponent={EmptyComponent}
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