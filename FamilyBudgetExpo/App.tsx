import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Bieudo from "./src/Bieudo";
import Home from "./src/Home";
import Login from "./src/Login";
import NhapGiaoDich from "./src/Nhap";
import Nhappl from "./src/Nhappl";
import Setting from "./src/Setting";
import Signup from "./src/Signup";
import Timkiem from "./src/Timkiem";
import Trangchu from "./src/Trangchu";

export type RootStackParamList = {
  Trangchu: undefined;
  Login: undefined;
  Signup: undefined;
  Home: { newCategory?: Category; updatedCategories?: Category[] } | undefined;
  Nhappl: undefined;
  Nhap:
    | { selectedCategory?: Category; transactionType?: "expense" | "income" }
    | undefined;
  Bieudo: undefined;
  Setting: undefined;
  Timkiem: undefined;
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
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Trangchu"
            component={Trangchu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Nhappl"
            component={Nhappl}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Nhap"
            component={NhapGiaoDich}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Bieudo"
            component={Bieudo}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Setting"
            component={Setting}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Timkiem"
            component={Timkiem}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
