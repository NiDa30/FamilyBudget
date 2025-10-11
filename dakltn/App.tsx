import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Trangchu from './src/Trangchu';
import Login from './src/Login';
import Signup from './src/Signup';
import Home from './src/Home';
import Nhappl from './src/Nhappl';
import NhapGiaoDich from './src/Nhap';

export type RootStackParamList = {
  Trangchu: undefined;
  Login: undefined;
  Signup: undefined;
  Home: { newCategory?: Category; updatedCategories?: Category[] } | undefined;
  Nhappl: undefined;
  Nhap: { selectedCategory?: Category; transactionType?: 'expense' | 'income' } | undefined; // Thêm params
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Trangchu" component={Trangchu} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Nhappl" component={Nhappl} options={{ headerShown: false }} />
          <Stack.Screen name="Nhap" component={NhapGiaoDich} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}