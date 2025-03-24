
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import mockDatabase from '@/utils/mockDatabase';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ecoCredits: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Use mock database instead of API call
      const result = mockDatabase.loginUser(email, password);
      
      if (result.error) {
        toast({
          title: 'Login failed',
          description: result.error,
          variant: 'destructive',
        });
        return { error: result.error };
      }
      
      // Save user to state and localStorage
      setUser(result.user as User);
      setToken(result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to Green Byte!',
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string }) => {
    try {
      // Use mock database instead of API call
      const result = mockDatabase.registerUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email,
        password,
      });
      
      if (result.error) {
        toast({
          title: 'Sign up failed',
          description: result.error,
          variant: 'destructive',
        });
        return { error: result.error };
      }
      
      toast({
        title: 'Account created successfully!',
        description: 'You can now log in with your credentials. As a welcome bonus, 5000 EcoCredits have been added to your account!',
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clear user from state and localStorage
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message || 'An error occurred during sign out.',
        variant: 'destructive',
      });
    }
  };

  const refreshUser = async () => {
    if (!token || !user) return;
    
    try {
      // Use mock database instead of API call
      const result = mockDatabase.getUserById(user.id);
      
      if (result.user) {
        setUser(result.user as User);
        localStorage.setItem('user', JSON.stringify(result.user));
      } else {
        // If the user is not found, sign out
        signOut();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
