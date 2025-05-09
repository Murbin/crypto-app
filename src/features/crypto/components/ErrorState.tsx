import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * Props interface for the ErrorState component
 * @interface ErrorStateProps
 * @property {string} message - The error message to display
 * @property {function} onRetry - The function to call when the retry button is pressed
 * @property {boolean} showRetry - Whether to show the retry button
 */
interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
    showRetry?: boolean;
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
export const ErrorState = memo(({ message, onRetry, showRetry = false }: ErrorStateProps) => (
    <View className="flex-1 justify-center items-center p-4">
        <Text className="text-base text-danger text-center mb-4">{message}</Text>
        {showRetry && onRetry && (
            <TouchableOpacity
                onPress={onRetry}
                className="bg-primary px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
        )}
    </View>
)); 