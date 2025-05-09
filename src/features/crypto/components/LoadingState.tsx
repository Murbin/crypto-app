import React, { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';

export const LoadingState = memo(() => (
    <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f4511e" />
    </View>
)); 