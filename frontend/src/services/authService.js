

import { supabase, signOutUser } from '../core/supabaseClient';

export const authService = {
  
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
      if (data.user) {
        localStorage.setItem('authUser', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.session.access_token);
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Login error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  
  signup: async (fullName, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user,
        requiresOTP: data.user?.confirmed_at === null,
      };
    } catch (error) {
      console.error('Signup error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  
  verifyOTP: async (email, otp) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp,
        type: 'email',
      });

      if (error) throw error;
      if (data.user) {
        localStorage.setItem('authUser', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.session.access_token);
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('OTP verification error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  
  forgotPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password reset link sent to your email',
      };
    } catch (error) {
      console.error('Forgot password error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  
  resetPassword: async (newPassword, token) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password has been reset successfully',
      };
    } catch (error) {
      console.error('Reset password error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  
  logout: async () => {
    try {
      const success = await signOutUser();
      if (success) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      }
      return success;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  
  getCurrentUser: () => {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  },

  
  getToken: () => {
    return localStorage.getItem('authToken');
  },
};
