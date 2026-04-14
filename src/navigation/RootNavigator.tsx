import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  BudgetScreen,
  EditTransactionScreen,
  LoginScreen,
  TransactionDetailScreen,
  OnboardingScreen,
  SignupScreen,
  SplashScreen,
} from '../screens';
import type { RootStackParamList } from '../types';
import { AppTabsNavigator } from './AppTabsNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainTabs" component={AppTabsNavigator} />
      <Stack.Screen name="Budget" component={BudgetScreen} />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
      <Stack.Screen
        name="EditTransaction"
        component={EditTransactionScreen}
      />
    </Stack.Navigator>
  );
}
