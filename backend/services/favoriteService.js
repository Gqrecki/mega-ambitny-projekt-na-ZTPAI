import FavoriteDrink from '../models/FavoriteDrink.js';
import Drink from '../models/Drink.js';

class FavoriteService {
  /**
   * Add drink to favorites
   * @param {String} userId - User ID
   * @param {String} drinkId - Drink ID
   * @returns {Object} Created favorite
   */
  async addFavorite(userId, drinkId) {
    // Check if drink exists
    const drink = await Drink.findById(drinkId);
    if (!drink) {
      throw new Error('Drink not found');
    }

    // Check if already favorited
    const existingFavorite = await FavoriteDrink.findOne({
      user: userId,
      drink: drinkId
    });

    if (existingFavorite) {
      throw new Error('Drink already in favorites');
    }

    // Create favorite
    const favorite = await FavoriteDrink.create({
      user: userId,
      drink: drinkId
    });

    await favorite.populate('drink', 'name category imageUrl price averageRating');

    return favorite;
  }

  /**
   * Remove drink from favorites
   * @param {String} userId - User ID
   * @param {String} drinkId - Drink ID
   * @returns {Boolean} Success status
   */
  async removeFavorite(userId, drinkId) {
    const favorite = await FavoriteDrink.findOneAndDelete({
      user: userId,
      drink: drinkId
    });

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    return true;
  }

  /**
   * Get user's favorite drinks
   * @param {String} userId - User ID
   * @param {Object} options - Query options
   * @returns {Object} Favorites and pagination
   */
  async getUserFavorites(userId, { page = 1, limit = 20, category } = {}) {
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: userId };

    // Get favorites with drink population
    let favoritesQuery = FavoriteDrink.find(query)
      .populate('drink')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const [favorites, total] = await Promise.all([
      favoritesQuery.lean(),
      FavoriteDrink.countDocuments(query)
    ]);

    // Filter by category if specified (after population)
    let filteredFavorites = favorites;
    if (category) {
      filteredFavorites = favorites.filter(
        (fav) => fav.drink && fav.drink.category === category
      );
    }

    return {
      favorites: filteredFavorites,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Check if drink is favorited by user
   * @param {String} userId - User ID
   * @param {String} drinkId - Drink ID
   * @returns {Boolean} Is favorited
   */
  async isFavorited(userId, drinkId) {
    const favorite = await FavoriteDrink.findOne({
      user: userId,
      drink: drinkId
    });

    return !!favorite;
  }

  /**
   * Get favorite count for a drink
   * @param {String} drinkId - Drink ID
   * @returns {Number} Favorite count
   */
  async getFavoriteCount(drinkId) {
    const count = await FavoriteDrink.countDocuments({ drink: drinkId });
    return count;
  }

  /**
   * Get user's favorite categories statistics
   * @param {String} userId - User ID
   * @returns {Object} Statistics by category
   */
  async getFavoriteStats(userId) {
    const favorites = await FavoriteDrink.find({ user: userId }).populate(
      'drink',
      'category'
    );

    const stats = {};
    favorites.forEach((fav) => {
      if (fav.drink && fav.drink.category) {
        stats[fav.drink.category] = (stats[fav.drink.category] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Get popular favorited drinks
   * @param {Number} limit - Number of drinks to return
   * @returns {Array} Popular drinks
   */
  async getPopularFavorites(limit = 10) {
    const popularDrinks = await FavoriteDrink.aggregate([
      {
        $group: {
          _id: '$drink',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'drinks',
          localField: '_id',
          foreignField: '_id',
          as: 'drink'
        }
      },
      { $unwind: '$drink' },
      {
        $project: {
          drink: 1,
          favoriteCount: '$count'
        }
      }
    ]);

    return popularDrinks;
  }
}

export default new FavoriteService();
