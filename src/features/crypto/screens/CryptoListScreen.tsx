import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { fetchCryptos, filterCryptos, selectCrypto } from '../redux/cryptoSlice';
import { useNavigation } from '@react-navigation/native';

export const CryptoListScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { filteredCryptos, loading, error } = useAppSelector((state) => state.crypto);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchCryptos());
    }, [dispatch]);

    const handleSearch = (text: string) => {
        setSearchTerm(text);
        dispatch(filterCryptos(text));
    };

    const handleCryptoPress = (crypto: any) => {
        dispatch(selectCrypto(crypto));
        navigation.navigate('CryptoDetail' as never);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.cryptoItem}
            onPress={() => handleCryptoPress(item)}
        >
            <Image source={{ uri: item.image }} style={styles.cryptoImage} />
            <View style={styles.cryptoInfo}>
                <Text style={styles.cryptoName}>{item.name}</Text>
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
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredCryptos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
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
    },
    list: {
        flex: 1,
    },
    cryptoItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cryptoImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
}); 