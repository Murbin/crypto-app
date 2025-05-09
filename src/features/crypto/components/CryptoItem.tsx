import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Crypto } from '../redux/cryptoSlice';

/**
 * Props interface for the CryptoItem component
 * @interface CryptoItemProps
 * @property {Crypto} item - The cryptocurrency data to display
 * @property {() => void} onPress - Callback function when the item is pressed
 */
interface CryptoItemProps {
    item: Crypto;
    onPress: () => void;
}

/**
 * CryptoItem Component
 * 
 * Displays a single cryptocurrency item in the list with its:
 * - Logo
 * - Name
 * - Symbol
 * - Current price
 * - 24h price change percentage
 * 
 * @component
 * @param {CryptoItemProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export const CryptoItem = memo(({ item, onPress }: CryptoItemProps) => (
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