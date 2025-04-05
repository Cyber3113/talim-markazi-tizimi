
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, LoginFormData, AuthContextType } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { apiLogin, apiGetCurrentUser, apiLogout } from '@/lib/api';

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved tokens and get current user on mount
    const fetchCurrentUser = async () => {
      try {
        // Only attempt to fetch user if we have an access token
        if (localStorage.getItem('eduAccessToken')) {
          const currentUser = await apiGetCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            console.log("Current user role:", currentUser.role);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear any invalid tokens
        localStorage.removeItem('eduAccessToken');
        localStorage.removeItem('eduRefreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiLogin(data);
      if (response && response.user) {
        setUser(response.user);
        console.log("Login successful. User role:", response.user.role);
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.user.name}!`,
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

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
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
