import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../core/supabaseClient';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem('authUser', JSON.stringify(session.user));
          localStorage.setItem('authToken', session.access_token);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('authUser', JSON.stringify(session.user));
        localStorage.setItem('authToken', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.signup(fullName, email, password);
      if (result.success) {
        return { 
          success: true, 
          requiresOTP: result.requiresOTP,
          user: result.user 
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.verifyOTP(email, otp);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await authService.logout();
      if (success) {
        setUser(null);
        return { success: true };
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      signup,
      verifyOTP,
      forgotPassword,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

