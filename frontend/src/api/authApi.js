import axios from './axios';

/**
 * Auth API Service
 */
const authApi = {
  /**
   * Register a new user
   * @param {Object} userData - {username, email, password, name}
   * @returns {Promise<Object>} - {user, token}
   */
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - {email, password}
   * @returns {Promise<Object>} - {user, token}
   */
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} - User data
   */
  getProfile: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile fields to update
   * @returns {Promise<Object>} - Updated user data
   */
  updateProfile: async (profileData) => {
    const response = await axios.put('/auth/profile', profileData);
    return response.data;
  },

  /**
   * Change password
   * @param {Object} passwords - {currentPassword, newPassword}
   * @returns {Promise<Object>} - Success message
   */
  changePassword: async (passwords) => {
    const response = await axios.put('/auth/password', passwords);
    return response.data;
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} - User stats
   */
  getUserStats: async () => {
    const response = await axios.get('/auth/stats');
    return response.data;
  },
};

export default authApi;
