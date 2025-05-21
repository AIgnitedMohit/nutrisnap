import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import authApi from '../services/authApi';

const UserProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      setError('');
      setIsLoggingOut(true);
      await authApi.logout();
      // Auth context will handle redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log out');
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 text-slate-200 hover:text-white focus:outline-none"
        aria-label="User profile"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
          {currentUser?.displayName 
            ? currentUser.displayName.charAt(0).toUpperCase()
            : currentUser.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden md:inline-block">
          {currentUser?.displayName || currentUser.email?.split('@')[0] || 'User'}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-10 border border-slate-700">
          <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
            Signed in as<br />
            <span className="font-semibold text-white truncate block">
              {currentUser.email}
            </span>
          </div>
          
          {error && (
            <div className="px-4 py-2 text-xs text-red-400">
              {error}
            </div>
          )}
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 