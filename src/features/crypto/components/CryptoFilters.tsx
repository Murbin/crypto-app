import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface CryptoFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export const CryptoFilters = memo(({ activeFilter, onFilterChange }: CryptoFiltersProps) => {
    const filters = [
        { id: 'all', label: 'All' },
        { id: 'top', label: 'Top' },
        { id: 'gainers', label: 'Gainers' },
        { id: 'losers', label: 'Losers' },
    ];

    return (
        <View className="flex-row justify-between px-4 py-2 bg-white">
            {filters.map((filter) => (
                <TouchableOpacity
                    key={filter.id}
                    onPress={() => onFilterChange(filter.id)}
                    className={`px-4 py-2 rounded-full ${activeFilter === filter.id
                            ? 'bg-primary'
                            : 'bg-gray-100'
                        }`}
                >
                    <Text
                        className={`text-sm font-medium ${activeFilter === filter.id
                                ? 'text-white'
                                : 'text-gray-600'
                            }`}
                    >
                        {filter.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}); 