const iosBundleIdentifier =
  process.env.EXPO_PUBLIC_APP_IOS_BUNDLE_IDENTIFIER || 'com.spendwise.app';
const androidPackage =
  process.env.EXPO_PUBLIC_APP_ANDROID_PACKAGE || 'com.spendwise.app';
const googleIosUrlScheme =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME ||
  'com.googleusercontent.apps.REPLACE_ME';

module.exports = ({ config }) => ({
  expo: {
    name: 'SpendWise',
    slug: 'SpendWise',
    version: '1.0.0',
    description:
      'Frontend-only expense tracker built with Expo, React Native, and TypeScript.',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: iosBundleIdentifier,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: androidPackage,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '3614e244-45b9-4c21-9ebb-31371e004863',
      },
    },
    plugins: [
      'expo-font',
      'expo-dev-client',
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: googleIosUrlScheme,
        },
      ],
    ],
  },
});
