import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any;
  tokens: { access: string | null; refresh: string | null } | null;
  login: (data: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  apiRequest: (method: string, url: string, data?: any) => Promise<any>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [tokens, setTokens] = useState<{ access: string | null; refresh: string | null } | null>({
    access: localStorage.getItem('accessToken'),
    refresh: localStorage.getItem('refreshToken'),
  });
  const [loading, setLoading] = useState(false);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: tokens?.refresh,
      });
      const newAccessToken = response.data.access;
      setTokens((prev) => ({ ...prev, access: newAccessToken }));
      localStorage.setItem('accessToken', newAccessToken);
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
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username: data.username,
        password: data.password,
      });

      const { access, refresh, user: userData } = response.data;
      setTokens({ access, refresh });
      setUser(userData);

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const apiRequest = async (method: string, url: string, data: any = null) => {
    try {
      const config = {
        method,
        url: `http://localhost:8000${url}`,
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

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, apiRequest, loading }}>
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