import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setItem, getItem, removeItem } from '@/utils/secureStore';
import { mockUsers } from '@/data/mockUsers';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data when the app starts
    const loadUser = async () => {
      try {
        const userToken = await getItem('userToken');
        if (userToken) {
          const userData = await getItem('userData');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we're using mock data
      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          phone: foundUser.phone,
        };
        
        // Save user token and data
        await setItem('userToken', foundUser.id);
        await setItem('userData', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we're simulating user creation
      
      // Check if user already exists
      const userExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        // User already exists
        return false;
      }
      
      // Create a new user (in a real app this would be done on the server)
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        password, // In a real app, this would be hashed on the server
      };
      
      // Save user token and data
      await setItem('userToken', newUser.id);
      await setItem('userData', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      }));
      
      // Update state
      setUser({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Remove user data from secure storage
      await removeItem('userToken');
      await removeItem('userData');
      
      // Update state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}