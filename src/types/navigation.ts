import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: { prefillEmail?: string } | undefined;
  Signup: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Budget: undefined;
  TransactionDetail: { transactionId: string };
  EditTransaction: { transactionId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Add: undefined;
  Analytics: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
