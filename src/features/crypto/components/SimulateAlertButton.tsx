import React, { memo } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAppDispatch } from '../../../shared/hooks/useRedux';
import { COLORS } from '../../../shared/constants';
import { generateRandomAlert } from '../../../shared/utils';

export const SimulateAlertButton = memo(() => {
    const dispatch = useAppDispatch();

    const simulateAlert = () => {
        const alert = generateRandomAlert();
        dispatch({ type: 'crypto/addSecurityAlert', payload: alert });
    };

    return (
        <TouchableOpacity
            onPress={simulateAlert}
            style={{
                backgroundColor: COLORS.WARNING,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                marginRight: 16
            }}
        >
            <Text style={{
                color: COLORS.WHITE,
                fontSize: 14,
                fontWeight: 'bold'
            }}>
                Simulate Alert
            </Text>
        </TouchableOpacity>
    );
}); 