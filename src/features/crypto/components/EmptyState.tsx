import React, { memo } from 'react';
import { View, Text } from 'react-native';

/**
 * EmptyState Component
 * 
 * Displays a message when no cryptocurrencies are found.
 * Used as a fallback UI when the cryptocurrency list is empty.
 * 
 * @component
 * @returns {JSX.Element} The rendered component
 */
export const EmptyState = memo(() => (
    <View className="flex-1 justify-center items-center py-5">
        <Text className="text-base text-secondary">No cryptocurrencies found</Text>
    </View>
)); 