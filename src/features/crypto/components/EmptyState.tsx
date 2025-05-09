import React, { memo } from 'react';
import { View, Text } from 'react-native';

export const EmptyState = memo(() => (
    <View className="flex-1 justify-center items-center py-5">
        <Text className="text-base text-secondary">No cryptocurrencies found</Text>
    </View>
)); 