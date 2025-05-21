import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './firebaseService';
import { auth } from './firebaseService';
import { onAuthStateChanged } from 'firebase/auth';
import authApi from './authApi';

// Define the Auth context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  checkAuthStatus: () => Promise<User | null>;
}

// Create the Auth context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  checkAuthStatus: async () => null,
});

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to check authentication status and get current user
  const checkAuthStatus = async (): Promise<User | null> => {
    try {
      const user = await authApi.getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up the auth state listener when the component mounts
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts
    return unsubscribe;
  }, []);

  // Value object to be passed to the context provider
  const value = {
    currentUser,
    loading,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 