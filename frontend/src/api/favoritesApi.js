import axios from './axios';

/**
 * Favorites API Service
 */
const favoritesApi = {
  /**
   * Add drink to favorites
   * @param {Object} favoriteData - {drinkId}
   * @returns {Promise<Object>} - Created favorite
   */
  addFavorite: async (favoriteData) => {
    const response = await axios.post('/favorites', favoriteData);
    return response.data;
  },

  /**
   * Remove drink from favorites
   * @param {string} drinkId - Drink ID
   * @returns {Promise<Object>} - Success message
   */
  removeFavorite: async (drinkId) => {
    const response = await axios.delete(`/favorites/${drinkId}`);
    return response.data;
  },

  /**
   * Get current user's favorites
   * @param {Object} params - {category}
   * @returns {Promise<Object>} - Favorites list
   */
  getMyFavorites: async (params = {}) => {
    const response = await axios.get('/favorites', { params });
    return response.data;
  },

  /**
   * Check if drink is favorited
   * @param {string} drinkId - Drink ID
   * @returns {Promise<Object>} - {isFavorited}
   */
  checkFavorite: async (drinkId) => {
    const response = await axios.get(`/favorites/check/${drinkId}`);
    return response.data;
  },

  /**
   * Get favorite count for a drink
   * @param {string} drinkId - Drink ID
   * @returns {Promise<Object>} - {count}
   */
  getFavoriteCount: async (drinkId) => {
    const response = await axios.get(`/favorites/count/${drinkId}`);
    return response.data;
  },

  /**
   * Get user's favorite statistics
   * @returns {Promise<Object>} - Favorite stats
   */
  getMyFavoriteStats: async () => {
    const response = await axios.get('/favorites/stats');
    return response.data;
  },

  /**
   * Get popular favorites (public)
   * @param {Object} params - {limit}
   * @returns {Promise<Object>} - Popular drinks
   */
  getPopularFavorites: async (params = {}) => {
    const response = await axios.get('/favorites/popular', { params });
    return response.data;
  },
};

export default favoritesApi;
