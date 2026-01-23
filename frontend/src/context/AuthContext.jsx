import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      
      // Verify token is still valid
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Verify if stored token is still valid
   */
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await authApi.getProfile();
      if (response.status === 'success') {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token invalid, clear auth
      logout();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      
      if (response.status === 'success') {
        const { user: newUser, token: newToken } = response.data;
        
        // Save to state and localStorage
        setUser(newUser);
        setToken(newToken);
        setIsAuthenticated(true);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast.success('Registration successful!');
        return { success: true, user: newUser };
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      
      if (response.status === 'success') {
        const { user: loggedUser, token: newToken } = response.data;
        
        // Save to state and localStorage
        setUser(loggedUser);
        setToken(newToken);
        setIsAuthenticated(true);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        
        toast.success(`Welcome back, ${loggedUser.username}!`);
        return { success: true, user: loggedUser };
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    try {
      const response = await authApi.updateProfile(profileData);
      
      if (response.status === 'success') {
        const updatedUser = response.data.user || response.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile updated successfully');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      return { success: false, error: error.message };
    }
  };

  /**
   * Change password
   */
  const changePassword = async (passwords) => {
    try {
      const response = await authApi.changePassword(passwords);
      
      if (response.status === 'success') {
        toast.success('Password changed successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Password change failed');
      return { success: false, error: error.message };
    }
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user && user.role === role;
  };

  /**
   * Check if user is admin
   */
  const isAdmin = () => {
    return hasRole('admin');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
