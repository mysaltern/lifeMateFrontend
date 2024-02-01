// AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '../utils/auth';

interface AuthContextProps {
  userToken: string | null;
  isAuthenticated: boolean;
  checkAuthentication: () => void;
  isRouteAuthenticated: (route: string) => boolean;
}

const nonAuthenticatedRoutes = ['/signin', '/signup'];

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }: React.PropsWithChildren<{}>) => {
  const router = useRouter();
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await getToken();
        setUserToken(token);
        setIsAuthenticated(!!token);

        if (!token && !isRouteAuthenticated(router.pathname)) {
          router.push('/signin');
        }

        // Additional authentication checks can be performed here

      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/signin');
      }
    };

    checkAuthentication();
  }, [router.pathname]);

  const isRouteAuthenticated = (route: string) => {
    return nonAuthenticatedRoutes.includes(route);
  };

  const contextValue: AuthContextProps = {
    userToken,
    isAuthenticated,
    checkAuthentication: () => checkAuthentication(),
    isRouteAuthenticated: (route) => isRouteAuthenticated(route),
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
function checkAuthentication(): void {
    throw new Error('Function not implemented.');
}

