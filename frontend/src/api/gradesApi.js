import axios from './axios';

/**
 * Grades/Reviews API Service
 */
const gradesApi = {
  /**
   * Create a new review
   * @param {Object} gradeData - {drink, rating, comment}
   * @returns {Promise<Object>} - Created grade
   */
  createGrade: async (gradeData) => {
    const response = await axios.post('/grades', gradeData);
    return response.data;
  },

  /**
   * Update existing review
   * @param {string} id - Grade ID
   * @param {Object} gradeData - {rating, comment}
   * @returns {Promise<Object>} - Updated grade
   */
  updateGrade: async (id, gradeData) => {
    const response = await axios.put(`/grades/${id}`, gradeData);
    return response.data;
  },

  /**
   * Delete review
   * @param {string} id - Grade ID
   * @returns {Promise<Object>} - Success message
   */
  deleteGrade: async (id) => {
    const response = await axios.delete(`/grades/${id}`);
    return response.data;
  },

  /**
   * Get reviews for a specific drink
   * @param {string} drinkId - Drink ID
   * @param {Object} params - {page, limit}
   * @returns {Promise<Object>} - Reviews list
   */
  getGradesByDrink: async (drinkId, params = {}) => {
    const response = await axios.get(`/grades/drink/${drinkId}`, { params });
    return response.data;
  },

  /**
   * Get current user's reviews
   * @returns {Promise<Object>} - User's reviews
   */
  getMyGrades: async () => {
    const response = await axios.get('/grades/user');
    return response.data;
  },

  /**
   * Mark review as helpful
   * @param {string} id - Grade ID
   * @returns {Promise<Object>} - Updated grade
   */
  markAsHelpful: async (id) => {
    const response = await axios.post(`/grades/${id}/helpful`);
    return response.data;
  },

  /**
   * Get review statistics for a drink
   * @param {string} drinkId - Drink ID
   * @returns {Promise<Object>} - Review stats
   */
  getGradeStats: async (drinkId) => {
    const response = await axios.get(`/grades/stats/drink/${drinkId}`);
    return response.data;
  },
};

export default gradesApi;
