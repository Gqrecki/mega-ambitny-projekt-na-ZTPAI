import axios from './axios';

/**
 * Drinks API Service
 */
const drinksApi = {
  /**
   * Get all drinks with pagination and filters
   * @param {Object} params - {page, limit, category, sort, search}
   * @returns {Promise<Object>} - {drinks, pagination}
   */
  getAllDrinks: async (params = {}) => {
    const response = await axios.get('/drinks', { params });
    return response.data;
  },

  /**
   * Get single drink by ID
   * @param {string} id - Drink ID
   * @returns {Promise<Object>} - Drink details with reviews
   */
  getDrinkById: async (id) => {
    const response = await axios.get(`/drinks/${id}`);
    return response.data;
  },

  /**
   * Create new drink (admin only)
   * @param {Object} drinkData - Drink information
   * @returns {Promise<Object>} - Created drink
   */
  createDrink: async (drinkData) => {
    const response = await axios.post('/drinks', drinkData);
    return response.data;
  },

  /**
   * Update drink (admin only)
   * @param {string} id - Drink ID
   * @param {Object} drinkData - Updated fields
   * @returns {Promise<Object>} - Updated drink
   */
  updateDrink: async (id, drinkData) => {
    const response = await axios.put(`/drinks/${id}`, drinkData);
    return response.data;
  },

  /**
   * Delete drink (admin only)
   * @param {string} id - Drink ID
   * @returns {Promise<Object>} - Success message
   */
  deleteDrink: async (id) => {
    const response = await axios.delete(`/drinks/${id}`);
    return response.data;
  },

  /**
   * Get trending drinks (high rated)
   * @returns {Promise<Object>} - Trending drinks
   */
  getTrendingDrinks: async () => {
    const response = await axios.get('/drinks/trending');
    return response.data;
  },

  /**
   * Get drinks by category
   * @param {string} category - Drink category
   * @param {Object} params - Additional params
   * @returns {Promise<Object>} - Drinks in category
   */
  getDrinksByCategory: async (category, params = {}) => {
    const response = await axios.get(`/drinks/category/${category}`, { params });
    return response.data;
  },

  /**
   * Search drinks
   * @param {string} query - Search query
   * @param {Object} params - Additional params
   * @returns {Promise<Object>} - Search results
   */
  searchDrinks: async (query, params = {}) => {
    const response = await axios.get('/drinks/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  /**
   * Get drink statistics (admin only)
   * @returns {Promise<Object>} - Platform statistics
   */
  getDrinkStats: async () => {
    const response = await axios.get('/drinks/stats');
    return response.data;
  },
};

export default drinksApi;
