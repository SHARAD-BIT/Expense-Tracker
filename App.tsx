import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'expo-dev-client';

import { AuthProvider, TransactionsProvider } from './src/hooks';
import { RootNavigator, navigationTheme } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TransactionsProvider>
          <NavigationContainer theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
        </TransactionsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
