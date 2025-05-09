import React, { useEffect, useState, useCallback, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
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
        style={styles.cryptoItem}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Image
            source={{ uri: item.image }}
            style={styles.cryptoImage}
            defaultSource={require('../../../../assets/placeholder.png')}
        />
        <View style={styles.cryptoInfo}>
            <Text style={styles.cryptoName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cryptoSymbol}>{item.symbol.toUpperCase()}</Text>
        </View>
        <View style={styles.cryptoPriceContainer}>
            <Text style={styles.cryptoPrice}>${item.current_price.toFixed(2)}</Text>
            <Text
                style={[
                    styles.priceChange,
                    item.price_change_percentage_24h > 0
                        ? styles.positiveChange
                        : styles.negativeChange,
                ]}
            >
                {item.price_change_percentage_24h.toFixed(2)}%
            </Text>
        </View>
    </TouchableOpacity>
));

// Memoized empty component
const EmptyComponent = memo(() => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No cryptocurrencies found</Text>
    </View>
));

// Memoized loading component
const LoadingComponent = memo(() => (
    <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
));

// Memoized error component
const ErrorComponent = memo(({ message }: { message: string }) => (
    <View style={styles.centered}>
        <Text style={styles.error}>{message}</Text>
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
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
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
                contentContainerStyle={styles.listContent}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    listContent: {
        paddingHorizontal: 10,
    },
    cryptoItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        marginVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    cryptoImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    cryptoInfo: {
        flex: 1,
        marginLeft: 15,
    },
    cryptoName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cryptoSymbol: {
        fontSize: 14,
        color: '#666',
    },
    cryptoPriceContainer: {
        alignItems: 'flex-end',
    },
    cryptoPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    priceChange: {
        fontSize: 14,
    },
    positiveChange: {
        color: '#4CAF50',
    },
    negativeChange: {
        color: '#F44336',
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
}); 