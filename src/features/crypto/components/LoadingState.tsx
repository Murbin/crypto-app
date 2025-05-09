import React, { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';

/**
 * LoadingState Component
 * 
 * Displays a centered loading spinner.
 * Used when fetching cryptocurrency data or performing other async operations.
 * 
 * @component
 * @returns {JSX.Element} The rendered component
 */
export const LoadingState = memo(() => (
    <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f4511e" />
    </View>
)); 