import React, { memo } from 'react';
import { View, Text } from 'react-native';

interface ErrorStateProps {
    message: string;
}

export const ErrorState = memo(({ message }: ErrorStateProps) => (
    <View className="flex-1 justify-center items-center">
        <Text className="text-base text-danger">{message}</Text>
    </View>
)); 