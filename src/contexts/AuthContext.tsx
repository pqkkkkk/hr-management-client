import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { AuthApi, MockAuthApi, RestAuthApi } from 'services/api/auth.api';
import { User, SignInRequest, ApiType } from 'shared/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (req: SignInRequest) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
  authApiType?: ApiType;
}

const createAuthApi = (type: ApiType): AuthApi => {
  switch (type) {
    case 'REST':
      return new RestAuthApi();
    case 'MOCK':
    default:
      return new MockAuthApi();
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, authApiType = 'MOCK' }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authApi = useMemo(() => createAuthApi(authApiType), [authApiType]);

  const login = async (req: SignInRequest): Promise<void> => {
    try {
      const response = await authApi.signIn(req);

      if (response.data.user) {
        response.data.user.role = req.role;
        setUser(response.data.user);
        setIsAuthenticated(true);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
        sessionStorage.setItem('isAuthenticated', 'true');
      }
      else {
        throw new Error(response.error?.message || response.message || 'Authentication failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
