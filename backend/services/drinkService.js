import Drink from '../models/Drink.js';

class DrinkService {
  /**
   * Get all drinks with filtering, sorting, and pagination
   * @param {Object} options - Query options
   * @returns {Object} Drinks and pagination info
   */
  async getAllDrinks({ page = 1, limit = 20, category, search, sortBy = '-averageRating' }) {
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by availability
    query.isAvailable = true;

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [drinks, total] = await Promise.all([
      Drink.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean(),
      Drink.countDocuments(query)
    ]);

    return {
      drinks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get drink by ID with reviews
   * @param {String} drinkId - Drink ID
   * @returns {Object} Drink details
   */
  async getDrinkById(drinkId) {
    const drink = await Drink.findById(drinkId)
      .populate({
        path: 'grades',
        populate: {
          path: 'user',
          select: 'username'
        },
        options: { sort: { createdAt: -1 }, limit: 10 }
      })
      .lean();

    if (!drink) {
      throw new Error('Drink not found');
    }

    return drink;
  }

  /**
   * Create a new drink (Admin only)
   * @param {Object} drinkData - Drink data
   * @returns {Object} Created drink
   */
  async createDrink(drinkData) {
    const drink = await Drink.create(drinkData);
    return drink;
  }

  /**
   * Update a drink (Admin only)
   * @param {String} drinkId - Drink ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated drink
   */
  async updateDrink(drinkId, updateData) {
    const drink = await Drink.findByIdAndUpdate(
      drinkId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!drink) {
      throw new Error('Drink not found');
    }

    return drink;
  }

  /**
   * Delete a drink (Admin only)
   * @param {String} drinkId - Drink ID
   * @returns {Boolean} Success status
   */
  async deleteDrink(drinkId) {
    const drink = await Drink.findByIdAndDelete(drinkId);

    if (!drink) {
      throw new Error('Drink not found');
    }

    // Also delete related grades and favorites
    const Grade = (await import('../models/Grade.js')).default;
    const FavoriteDrink = (await import('../models/FavoriteDrink.js')).default;

    await Promise.all([
      Grade.deleteMany({ drink: drinkId }),
      FavoriteDrink.deleteMany({ drink: drinkId })
    ]);

    return true;
  }

  /**
   * Get trending drinks (highest rated recently)
   * @param {Number} limit - Number of drinks to return
   * @returns {Array} Trending drinks
   */
  async getTrendingDrinks(limit = 10) {
    const drinks = await Drink.find({ isAvailable: true })
      .sort({ averageRating: -1, numberOfRatings: -1 })
      .limit(limit)
      .lean();

    return drinks;
  }

  /**
   * Get drinks by category
   * @param {String} category - Drink category
   * @param {Number} limit - Number of drinks to return
   * @returns {Array} Drinks in category
   */
  async getDrinksByCategory(category, limit = 20) {
    const drinks = await Drink.find({ category, isAvailable: true })
      .sort({ averageRating: -1 })
      .limit(limit)
      .lean();

    return drinks;
  }

  /**
   * Get drink statistics
   * @returns {Object} Statistics
   */
  async getDrinkStats() {
    const stats = await Drink.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$averageRating' },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalDrinks = await Drink.countDocuments();

    return {
      totalDrinks,
      byCategory: stats
    };
  }

  /**
   * Search drinks by name or description
   * @param {String} searchTerm - Search term
   * @param {Number} limit - Max results
   * @returns {Array} Matching drinks
   */
  async searchDrinks(searchTerm, limit = 20) {
    const drinks = await Drink.find(
      { $text: { $search: searchTerm }, isAvailable: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();

    return drinks;
  }
}

export default new DrinkService();
