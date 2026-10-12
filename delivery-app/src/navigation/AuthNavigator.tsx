import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import StaffLoginScreen from '../screens/auth/StaffLoginScreen';
import StaffOtpScreen from '../screens/auth/StaffOtpScreen';

const Stack = createNativeStackNavigator();

// Customer app: Login, Signup, ForgotPassword mattum
export function CustomerAuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// Driver app: StaffLogin, StaffOtp mattum
export function DriverAuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StaffLogin" component={StaffLoginScreen} />
      <Stack.Screen name="StaffOtp" component={StaffOtpScreen} />
    </Stack.Navigator>
  );
}