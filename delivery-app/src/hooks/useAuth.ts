import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from '../types';

/**
 * Custom hook to access authentication context
 * Provides authentication state and methods
 * 
 * @returns {Object} Auth context values
 * @property {boolean} isAuthenticated - Current authentication status
 * @property {User | null} user - Current user data
 * @property {boolean} loading - Loading state
 * @property {Function} login - Login function
 * @property {Function} signup - Signup function
 * @property {Function} logout - Logout function
 * @property {Function} updateUser - Update user profile function
 * 
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * const handleLogin = async () => {
 *   const success = await login({ email, password });
 *   if (success) {
 *     navigate('/home');
 *   }
 * };
 * ```
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Type guard to check if user is authenticated
 * 
 * @param {Object} auth - Auth context object
 * @returns {boolean} True if user is authenticated
 * 
 * @example
 * ```tsx
 * const auth = useAuth();
 * if (isAuthenticated(auth)) {
 *   // User is logged in
 * }
 * ```
 */
export const isAuthenticated = (auth: ReturnType<typeof useAuth>): boolean => {
  return auth.isAuthenticated && auth.user !== null;
};

/**
 * Get current user's full name or fallback
 * 
 * @param {Object} auth - Auth context object
 * @returns {string} User's name or 'Guest'
 * 
 * @example
 * ```tsx
 * const auth = useAuth();
 * const userName = getUserName(auth);
 * ```
 */
export const getUserName = (auth: ReturnType<typeof useAuth>): string => {
  if (auth.user && auth.user.name) {
    return auth.user.name;
  }
  return 'Guest';
};

/**
 * Get current user's email or fallback
 * 
 * @param {Object} auth - Auth context object
 * @returns {string} User's email or 'No email'
 * 
 * @example
 * ```tsx
 * const auth = useAuth();
 * const userEmail = getUserEmail(auth);
 * ```
 */
export const getUserEmail = (auth: ReturnType<typeof useAuth>): string => {
  if (auth.user && auth.user.email) {
    return auth.user.email;
  }
  return 'No email';
};

/**
 * Get current user's avatar or initials
 * 
 * @param {Object} auth - Auth context object
 * @returns {string} User's avatar URL or initials
 * 
 * @example
 * ```tsx
 * const auth = useAuth();
 * const avatar = getUserAvatar(auth);
 * ```
 */
export const getUserAvatar = (auth: ReturnType<typeof useAuth>): string => {
  if (auth.user && auth.user.avatar) {
    return auth.user.avatar;
  }
  // Return initials as fallback
  if (auth.user && auth.user.name) {
    const nameParts = auth.user.name.split(' ');
    if (nameParts.length >= 2) {
      return nameParts[0][0] + nameParts[1][0];
    }
    return nameParts[0][0];
  }
  return 'U';
};

/**
 * Check if user has a specific role
 * 
 * @param {Object} auth - Auth context object
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 * 
 * @example
 * ```tsx
 * const auth = useAuth();
 * const isAdmin = userHasRole(auth, 'admin');
 * ```
 */
export const userHasRole = (auth: ReturnType<typeof useAuth>, role: string): boolean => {
  // Implement role checking logic based on your user structure
  // For now, return false if no user
  if (!auth.user) return false;
  // You can extend this based on your user model
  return false;
};

/**
 * Get user's default address
 * 
 * @param {Object} auth - Auth context object
 * @returns {Object | null} Default address or null
 * 
 * @example
 * ```tsx
 * const auth = useAuth();
 * const defaultAddress = getUserDefaultAddress(auth);
 * ```
 */
export const getUserDefaultAddress = (auth: ReturnType<typeof useAuth>) => {
  if (auth.user && auth.user.addresses) {
    return auth.user.addresses.find(addr => addr.isDefault) || null;
  }
  return null;
};

/**
 * Check if user is logged in and has completed profile
 * 
 * @param {Object} auth - Auth context object
 * @returns {boolean} True if profile is complete
 * 
 * @example
 * ```tsx
 * const auth = useAuth();
 * const hasCompleteProfile = isProfileComplete(auth);
 * ```
 */
export const isProfileComplete = (auth: ReturnType<typeof useAuth>): boolean => {
  if (!auth.user) return false;
  
  const { name, email, phone, addresses } = auth.user;
  
  // Check required fields
  if (!name || name.length < 2) return false;
  if (!email || !email.includes('@')) return false;
  if (!phone || phone.length < 10) return false;
  
  // Check if at least one address exists
  if (!addresses || addresses.length === 0) return false;
  
  return true;
};

/**
 * Get user's full profile data
 * 
 * @param {Object} auth - Auth context object
 * @returns {User | null} Full user data
 * 
 * @example
 * ```tsx
 * const auth = useAuth();
 * const userProfile = getUserProfile(auth);
 * ```
 */
export const getUserProfile = (auth: ReturnType<typeof useAuth>): User | null => {
  return auth.user;
};