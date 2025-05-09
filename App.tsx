import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/shared/redux/store';
import { CryptoListScreen } from './src/features/crypto/screens/CryptoListScreen';
import { CryptoDetailScreen } from './src/features/crypto/screens/CryptoDetailScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="CryptoList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="CryptoList"
            component={CryptoListScreen}
            options={{ title: 'Cryptocurrency List' }}
          />
          <Stack.Screen
            name="CryptoDetail"
            component={CryptoDetailScreen}
            options={{ title: 'Cryptocurrency Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
