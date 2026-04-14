import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  AddScreen,
  AnalyticsScreen,
  DashboardScreen,
  ProfileScreen,
  TransactionsScreen,
} from '../screens';
import { theme } from '../theme';
import type { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function AppTabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          ...theme.typography.tiny,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 78,
          paddingBottom: theme.spacing.sm,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            color={color}
            name={getTabIcon(route.name, focused)}
            size={size}
          />
        ),
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function getTabIcon(name: keyof MainTabParamList, focused: boolean) {
  switch (name) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Transactions':
      return focused ? 'receipt' : 'receipt-outline';
    case 'Add':
      return focused ? 'add-circle' : 'add-circle-outline';
    case 'Analytics':
      return focused ? 'stats-chart' : 'stats-chart-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    default:
      return 'ellipse-outline';
  }
}
