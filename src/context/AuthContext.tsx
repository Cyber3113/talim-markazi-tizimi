
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from '@/lib/apiConfig';

interface AuthContextType {
  user: any;
  tokens: { access: string | null; refresh: string | null } | null;
  login: (data: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  apiRequest: (method: string, url: string, data?: any) => Promise<any>;
  loading: boolean;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe localStorage access function with memory fallback
const memoryStorage: Record<string, string> = {};
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    } catch (error) {
      console.warn('localStorage access denied:', error);
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
      memoryStorage[key] = value;
    } catch (error) {
      console.warn('localStorage access denied:', error);
      memoryStorage[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
      delete memoryStorage[key];
    } catch (error) {
      console.warn('localStorage access denied:', error);
      delete memoryStorage[key];
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [tokens, setTokens] = useState<{ access: string | null; refresh: string | null } | null>({
    access: safeLocalStorage.getItem('accessToken'),
    refresh: safeLocalStorage.getItem('refreshToken'),
  });
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = getApiBaseUrl();

  useEffect(() => {
    // Check if we already have tokens and try to get user data
    const checkAuth = async () => {
      setLoading(true);
      if (tokens?.access) {
        try {
          const response = await apiRequest('get', '/auth/user/');
          setUser(response);
        } catch (error) {
          console.error('User verification failed:', error);
          setTokens(null);
          safeLocalStorage.removeItem('accessToken');
          safeLocalStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/token/refresh/`, {
        refresh: tokens?.refresh,
      });
      const newAccessToken = response.data.access;
      setTokens((prev) => ({ ...prev, access: newAccessToken }));
      safeLocalStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Token yangilash xatosi:', error);
      logout();
      return null;
    }
  };

  const login = async (data: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login/`, {
        username: data.username,
        password: data.password,
      });

      const { access, refresh, user: userData } = response.data;
      setTokens({ access, refresh });
      setUser(userData);

      safeLocalStorage.setItem('accessToken', access);
      safeLocalStorage.setItem('refreshToken', refresh);

      console.log('Foydalanuvchi ma\'lumotlari:', userData);
      console.log('Access Token:', access);
      console.log('Refresh Token:', refresh);

      return true;
    } catch (error) {
      console.error('Login xatosi:', error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    safeLocalStorage.removeItem('accessToken');
    safeLocalStorage.removeItem('refreshToken');
  };

  const apiRequest = async (method: string, url: string, data: any = null) => {
    try {
      const config = {
        method,
        url: `${apiBaseUrl}${url}`,
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
        data,
      };

      let response = await axios(config);

      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          response = await axios(config);
        }
      }

      return response.data;
    } catch (error) {
      console.error('API so\'rov xatosi:', error.response?.data || error.message);
      throw error;
    }
  };

  const isAuthenticated = !!tokens?.access && !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      tokens, 
      login, 
      logout, 
      apiRequest, 
      loading, 
      isAuthenticated,
      isLoading: loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
