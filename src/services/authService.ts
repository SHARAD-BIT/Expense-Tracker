import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  type ConfigureParams,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

import { mockUser } from '../data';
import type { AuthProvider, AuthSession } from '../types';

const AUTH_SESSION_STORAGE_KEY = '@spendwise/auth-session';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
const GOOGLE_IOS_URL_SCHEME =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME?.trim();

let isGoogleConfigured = false;

type LocalSignInParams = {
  fullName?: string;
  email?: string;
};

export type AuthActionResult =
  | { status: 'success'; session: AuthSession }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

export function configureGoogleSignIn() {
  if (isGoogleConfigured) {
    return;
  }

  const options: ConfigureParams =
    Platform.OS === 'ios' && GOOGLE_IOS_CLIENT_ID
      ? {
          scopes: ['email', 'profile'],
          profileImageSize: 160,
          ...(GOOGLE_WEB_CLIENT_ID
            ? {
                webClientId: GOOGLE_WEB_CLIENT_ID,
              }
            : {}),
          iosClientId: GOOGLE_IOS_CLIENT_ID,
        }
      : {
          scopes: ['email', 'profile'],
          profileImageSize: 160,
          ...(GOOGLE_WEB_CLIENT_ID
            ? {
                webClientId: GOOGLE_WEB_CLIENT_ID,
              }
            : {}),
        };

  GoogleSignin.configure(options);
  isGoogleConfigured = true;
}

export async function getStoredSession() {
  const rawValue = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as AuthSession;
}

export async function signInWithLocalAccount({
  fullName,
  email,
}: LocalSignInParams = {}) {
  const finalEmail = email?.trim() || mockUser.email;
  const isMockUser = finalEmail.toLowerCase() === mockUser.email.toLowerCase();

  const session: AuthSession = {
    id: isMockUser ? mockUser.id : `user-${Date.now()}`,
    provider: 'local',
    fullName: fullName?.trim() || mockUser.fullName,
    email: finalEmail,
    authenticatedAt: new Date().toISOString(),
  };

  await persistSession(session);

  return session;
}

export async function signInWithGoogle(): Promise<AuthActionResult> {
  configureGoogleSignIn();

  if (Platform.OS === 'ios' && !hasConfiguredIosGoogleScheme()) {
    return {
      status: 'error',
      message:
        'Google Sign-In is not configured for iOS yet. Set EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME and rebuild the app.',
    };
  }

  try {
    if (Platform.OS === 'android') {
      const playServicesAvailable = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      if (!playServicesAvailable) {
        return {
          status: 'error',
          message:
            'Google Play Services are unavailable on this device. Please update them and try again.',
        };
      }
    }

    const response = await GoogleSignin.signIn();

    if (isCancelledResponse(response)) {
      return {
        status: 'cancelled',
      };
    }

    if (!isSuccessResponse(response)) {
      return {
        status: 'error',
        message: 'Google Sign-In did not complete successfully. Please try again.',
      };
    }

    const session = mapGoogleUserToSession(response.data.user);

    await persistSession(session);

    return {
      status: 'success',
      session,
    };
  } catch (error) {
    return {
      status: 'error',
      message: getGoogleSignInErrorMessage(error),
    };
  }
}

export async function signOut(session: AuthSession | null) {
  if (session?.provider === 'google') {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Keep local sign-out resilient even if the native Google session is gone.
    }
  }

  await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

function mapGoogleUserToSession(user: {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}): AuthSession {
  return {
    id: user.id,
    provider: 'google',
    fullName: user.name?.trim() || buildFallbackName(user.email),
    email: user.email,
    photoUrl: user.photo,
    givenName: user.givenName,
    familyName: user.familyName,
    authenticatedAt: new Date().toISOString(),
  };
}

async function persistSession(session: AuthSession) {
  await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

function buildFallbackName(email: string) {
  const [rawValue] = email.split('@');

  return rawValue
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function hasConfiguredIosGoogleScheme() {
  return Boolean(
    GOOGLE_IOS_URL_SCHEME &&
      GOOGLE_IOS_URL_SCHEME.startsWith('com.googleusercontent.apps.') &&
      !GOOGLE_IOS_URL_SCHEME.includes('REPLACE_ME')
  );
}

function getGoogleSignInErrorMessage(error: unknown) {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.IN_PROGRESS:
        return 'Google Sign-In is already in progress.';
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services are not available on this device.';
      case statusCodes.SIGN_IN_CANCELLED:
        return 'Google Sign-In was cancelled.';
      default:
        if (error.message.toLowerCase().includes('expo go')) {
          return 'Google Sign-In requires a development build or EAS build. It will not work in Expo Go.';
        }

        return error.message;
    }
  }

  return 'Google Sign-In failed. Please try again.';
}
