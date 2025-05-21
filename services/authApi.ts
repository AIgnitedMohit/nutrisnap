import {
  signInWithEmail,
  signInWithGoogle,
  registerWithEmail,
  logOut,
  User,
  auth
} from './firebaseService';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Authentication API service
 * This service provides methods for authentication operations
 */
class AuthApi {
  /**
   * Check if a user is currently authenticated
   * @returns {Promise<User | null>} The authenticated user or null
   */
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  /**
   * Register a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} displayName - User's display name (optional)
   * @returns {Promise<User>} The registered user
   */
  async register(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const user = await registerWithEmail(email, password, displayName);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in a user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<User>} The authenticated user
   */
  async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const user = await signInWithEmail(email, password);
      return user;
    } catch (error) {
      console.error('Email login error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in a user with Google
   * @returns {Promise<User>} The authenticated user
   */
  async loginWithGoogle(): Promise<User> {
    try {
      const user = await signInWithGoogle();
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handle authentication errors and format them for clients
   * @param {any} error - The error object
   * @returns {Error} A formatted error
   * @private
   */
  private handleAuthError(error: any): Error {
    // Firebase error codes: https://firebase.google.com/docs/auth/admin/errors
    const errorMessage = error.message || 'Authentication failed';
    
    if (errorMessage.includes('auth/user-not-found') || 
        errorMessage.includes('auth/wrong-password')) {
      return new Error('Invalid email or password');
    }
    
    if (errorMessage.includes('auth/email-already-in-use')) {
      return new Error('Email is already in use');
    }
    
    if (errorMessage.includes('auth/weak-password')) {
      return new Error('Password is too weak');
    }
    
    if (errorMessage.includes('auth/invalid-email')) {
      return new Error('Invalid email format');
    }
    
    if (errorMessage.includes('auth/network-request-failed')) {
      return new Error('Network error. Please check your connection');
    }
    
    return new Error(errorMessage);
  }
}

// Create and export a singleton instance
const authApi = new AuthApi();
export default authApi; 