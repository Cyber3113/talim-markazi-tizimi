
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
      console.log("Checking authentication status...");
      
      if (tokens?.access) {
        console.log("Token found, verifying user...");
        try {
          const response = await apiRequest('get', '/auth/user/');
          console.log("User verification successful:", response);
          setUser(response);
        } catch (error) {
          console.error('User verification failed:', error);
          // Clear invalid tokens
          setTokens(null);
          safeLocalStorage.removeItem('accessToken');
          safeLocalStorage.removeItem('refreshToken');
        }
      } else {
        console.log("No tokens found");
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const refreshAccessToken = async () => {
    try {
      console.log("Attempting to refresh access token...");
      const response = await axios.post(`${apiBaseUrl}/token/refresh/`, {
        refresh: tokens?.refresh,
      });
      
      const newAccessToken = response.data.access;
      console.log("Token refresh successful");
      
      setTokens((prev) => ({ ...prev, access: newAccessToken }));
      safeLocalStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
  };

  const login = async (data: { username: string; password: string }) => {
    setLoading(true);
    console.log("Login attempt for:", data.username);
    
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login/`, {
        username: data.username,
        password: data.password,
      });

      const { access, refresh, user: userData } = response.data;
      
      console.log("Login successful. User role:", userData?.role);
      
      setTokens({ access, refresh });
      setUser(userData);

      safeLocalStorage.setItem('accessToken', access);
      safeLocalStorage.setItem('refreshToken', refresh);

      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out user");
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

      console.log(`Making API request: ${method.toUpperCase()} ${url}`);
      let response = await axios(config);

      if (response.status === 401) {
        console.log("Token expired, attempting refresh");
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          response = await axios(config);
        }
      }

      return response.data;
    } catch (error) {
      console.error('API request error:', error.response?.data || error.message);
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
