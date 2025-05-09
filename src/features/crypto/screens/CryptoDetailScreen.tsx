import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useAppSelector } from '../../../shared/hooks/useRedux';

export const CryptoDetailScreen = () => {
    const { selectedCrypto } = useAppSelector((state) => state.crypto);

    if (!selectedCrypto) {
        return (
            <View style={styles.centered}>
                <Text>No cryptocurrency selected</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Image
                        source={{ uri: selectedCrypto.image }}
                        style={styles.cryptoImage}
                    />
                    <Text style={styles.cryptoName}>{selectedCrypto.name}</Text>
                    <Text style={styles.cryptoSymbol}>
                        {selectedCrypto.symbol.toUpperCase()}
                    </Text>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Current Price:</Text>
                        <Text style={styles.value}>
                            ${selectedCrypto.current_price.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Market Cap Rank:</Text>
                        <Text style={styles.value}>#{selectedCrypto.market_cap_rank}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Market Cap:</Text>
                        <Text style={styles.value}>
                            ${selectedCrypto.market_cap.toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>24h Change:</Text>
                        <Text
                            style={[
                                styles.value,
                                selectedCrypto.price_change_percentage_24h > 0
                                    ? styles.positiveChange
                                    : styles.negativeChange,
                            ]}
                        >
                            {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cryptoImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    cryptoName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cryptoSymbol: {
        fontSize: 18,
        color: '#666',
    },
    infoContainer: {
        backgroundColor: 'white',
        margin: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    positiveChange: {
        color: '#4CAF50',
    },
    negativeChange: {
        color: '#F44336',
    },
}); 