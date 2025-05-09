import React, { memo } from 'react';
import { View, Text } from 'react-native';

/**
 * Props interface for the ErrorState component
 * @interface ErrorStateProps
 * @property {string} message - The error message to display
 */
interface ErrorStateProps {
    message: string;
}

/**
 * ErrorState Component
 * 
 * Displays an error message in a centered container.
 * Used when there's an error fetching or displaying cryptocurrency data.
 * 
 * @component
 * @param {ErrorStateProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export const ErrorState = memo(({ message }: ErrorStateProps) => (
    <View className="flex-1 justify-center items-center">
        <Text className="text-base text-danger">{message}</Text>
    </View>
)); 