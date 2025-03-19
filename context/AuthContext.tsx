import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDatabase } from './DatabaseContext';
import * as SecureStore from 'expo-secure-store';

type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { db } = useDatabase();

  useEffect(() => {
    // Check if user is already logged in
    const checkUserSession = async () => {
      try {
        const userJson = await SecureStore.getItemAsync('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (!db) throw new Error('Database not initialized');

      // In a real app, this would validate credentials against the database
      // For demo purposes, we're using mock data
      
      // Mock login - in a real app, this would query the database
      if (email === 'user@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'user@example.com',
          phoneNumber: '+1234567890'
        };
        
        // Store user in secure storage
        await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phoneNumber: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      if (!db) throw new Error('Database not initialized');

      // In a real app, this would check if email already exists and then create a new user
      // For demo purposes, we're using mock data
      
      // Mock registration
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phoneNumber
      };
      
      // Store user in secure storage
      await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
