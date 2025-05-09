import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useAppSelector } from '../../../shared/hooks/useRedux';
import { CryptoService } from '../services/cryptoService';

export const CryptoDetailScreen = () => {
    const { selectedCrypto } = useAppSelector((state) => state.crypto);
    const [verificationResult, setVerificationResult] = useState<{
        isValid: boolean;
        currentHash: string;
        storedHash: string;
    } | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    if (!selectedCrypto) {
        return (
            <View style={styles.centered}>
                <Text>No cryptocurrency selected</Text>
            </View>
        );
    }

    const handleVerifyIntegrity = async () => {
        setIsVerifying(true);
        try {
            const cryptoService = CryptoService.getInstance();
            const result = await cryptoService.verifyCryptoIntegrity(selectedCrypto);
            setVerificationResult(result);
        } catch (error) {
            console.error('Error verifying integrity:', error);
        } finally {
            setIsVerifying(false);
        }
    };

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

                    {/* Botón de verificación y resultados */}
                    <TouchableOpacity
                        style={styles.verifyButton}
                        onPress={handleVerifyIntegrity}
                        disabled={isVerifying}
                    >
                        {isVerifying ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.verifyButtonText}>
                                Verify Data Integrity
                            </Text>
                        )}
                    </TouchableOpacity>

                    {verificationResult && (
                        <View style={styles.verificationResult}>
                            <Text style={[
                                styles.verificationStatus,
                                verificationResult.isValid ? styles.valid : styles.invalid
                            ]}>
                                {verificationResult.isValid ? '✓ Data is Valid' : '✗ Data is Invalid'}
                            </Text>
                            <Text style={styles.hashText}>
                                Current Hash: {verificationResult.currentHash.substring(0, 20)}...
                            </Text>
                            <Text style={styles.hashText}>
                                Stored Hash: {verificationResult.storedHash.substring(0, 20)}...
                            </Text>
                        </View>
                    )}
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
    verifyButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    verifyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    verificationResult: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    verificationStatus: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    valid: {
        color: '#4CAF50',
    },
    invalid: {
        color: '#F44336',
    },
    hashText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        fontFamily: 'monospace',
    },
}); 