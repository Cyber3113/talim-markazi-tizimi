
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, LoginFormData, AuthContextType } from '@/lib/types';
import { loginUser } from '@/lib/authUtils';
import { useToast } from '@/components/ui/use-toast';

// Create an object to store user data in memory when localStorage is unavailable
const memoryStorage = {
  user: null as User | null,
  setUser: function(user: User | null) {
    this.user = user;
  },
  getUser: function() {
    return this.user;
  },
  removeUser: function() {
    this.user = null;
  }
};

// Safe storage utilities that will fallback to memory storage if localStorage is unavailable
const safeStorage = {
  getItem: function(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage is not available, using memory storage instead');
      if (key === 'eduUser') {
        return memoryStorage.getUser() ? JSON.stringify(memoryStorage.getUser()) : null;
      }
      return null;
    }
  },
  setItem: function(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage is not available, using memory storage instead');
      if (key === 'eduUser') {
        memoryStorage.setUser(JSON.parse(value));
      }
    }
  },
  removeItem: function(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage is not available, using memory storage instead');
      if (key === 'eduUser') {
        memoryStorage.removeUser();
      }
    }
  }
};

// Safe implementation of storage functions
const saveUserToStorage = (user: User): void => {
  safeStorage.setItem('eduUser', JSON.stringify(user));
};

const getUserFromStorage = (): User | null => {
  const userJson = safeStorage.getItem('eduUser');
  if (userJson) {
    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Error parsing user from storage', e);
      return null;
    }
  }
  return null;
};

const removeUserFromStorage = (): void => {
  safeStorage.removeItem('eduUser');
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user on mount
    try {
      const savedUser = getUserFromStorage();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loggedInUser = await loginUser(data);
      if (loggedInUser) {
        setUser(loggedInUser);
        try {
          saveUserToStorage(loggedInUser);
        } catch (error) {
          console.error('Error saving user to storage:', error);
        }
        toast({
          title: "Login successful",
          description: `Welcome back, ${loggedInUser.name}!`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      removeUserFromStorage();
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
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
