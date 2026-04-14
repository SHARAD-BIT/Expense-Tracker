import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { PropsWithChildren } from 'react';

import * as authService from '../services';
import type { AuthActionResult } from '../services';
import type { AuthSession } from '../types';

type LocalSignInParams = {
  fullName?: string;
  email?: string;
};

type AuthContextValue = {
  session: AuthSession | null;
  isHydrating: boolean;
  activeAuthMethod: 'local' | 'google' | null;
  restoreSession: () => Promise<void>;
  signInWithLocalAccount: (
    params?: LocalSignInParams
  ) => Promise<AuthSession>;
  signInWithGoogle: () => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [activeAuthMethod, setActiveAuthMethod] = useState<
    'local' | 'google' | null
  >(null);

  const restoreSession = useCallback(async () => {
    setIsHydrating(true);
    authService.configureGoogleSignIn();

    try {
      const storedSession = await authService.getStoredSession();
      setSession(storedSession);
    } finally {
      setIsHydrating(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const signInWithLocalAccount = useCallback(
    async (params?: LocalSignInParams) => {
      setActiveAuthMethod('local');

      try {
        const nextSession = await authService.signInWithLocalAccount(params);
        setSession(nextSession);

        return nextSession;
      } finally {
        setActiveAuthMethod(null);
      }
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    setActiveAuthMethod('google');

    try {
      const result = await authService.signInWithGoogle();

      if (result.status === 'success') {
        setSession(result.session);
      }

      return result;
    } finally {
      setActiveAuthMethod(null);
    }
  }, []);

  const clearSession = useCallback(async () => {
    const currentSession = session;
    setActiveAuthMethod(currentSession?.provider ?? 'local');

    try {
      await authService.signOut(currentSession);
      setSession(null);
    } finally {
      setActiveAuthMethod(null);
    }
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      isHydrating,
      activeAuthMethod,
      restoreSession,
      signInWithLocalAccount,
      signInWithGoogle,
      signOut: clearSession,
    }),
    [
      session,
      isHydrating,
      activeAuthMethod,
      restoreSession,
      signInWithLocalAccount,
      signInWithGoogle,
      clearSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
