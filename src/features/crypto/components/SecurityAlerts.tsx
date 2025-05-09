import React, { memo } from 'react';
import { View, Text, Animated } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../../shared/hooks/useRedux';
import { clearSecurityAlerts } from '../redux/cryptoSlice';

export const SecurityAlerts = memo(() => {
    const dispatch = useAppDispatch();
    const { securityAlerts } = useAppSelector((state) => state.crypto);
    const [animation] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (securityAlerts.length > 0) {
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(5000),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                dispatch(clearSecurityAlerts());
            });
        }
    }, [securityAlerts.length]);

    const getAlertColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    if (securityAlerts.length === 0) return null;

    return (
        <View className="absolute top-0 left-0 right-0 z-50">
            {securityAlerts.map((alert) => (
                <Animated.View
                    key={alert.id}
                    style={{
                        opacity: animation,
                        transform: [{
                            translateY: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-100, 0],
                            }),
                        }],
                    }}
                >
                    <View
                        className={`${getAlertColor(alert.severity)} p-4 m-2 rounded-lg shadow-lg`}
                    >
                        <Text className="text-white font-bold">{alert.message}</Text>
                        <Text className="text-white text-sm mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                        </Text>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}); 