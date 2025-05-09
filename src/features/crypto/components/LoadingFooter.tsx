import React, { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';

export const LoadingFooter = memo(() => (
    <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#f4511e" />
    </View>
)); 