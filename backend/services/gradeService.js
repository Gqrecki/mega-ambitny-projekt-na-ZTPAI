import Grade from '../models/Grade.js';
import Drink from '../models/Drink.js';
import queueService from './queueService.js';

class GradeService {
  /**
   * Create a new grade/review
   * @param {String} userId - User ID
   * @param {Object} gradeData - Grade data
   * @returns {Object} Created grade
   */
  async createGrade(userId, { drinkId, rating, comment }) {
    // Check if drink exists
    const drink = await Drink.findById(drinkId);
    if (!drink) {
      throw new Error('Drink not found');
    }

    // Check if user already reviewed this drink
    const existingGrade = await Grade.findOne({
      user: userId,
      drink: drinkId
    });

    if (existingGrade) {
      throw new Error('You have already reviewed this drink');
    }

    // Create grade
    const grade = await Grade.create({
      user: userId,
      drink: drinkId,
      rating,
      comment
    });

    // Populate user info
    await grade.populate('user', 'username');

    // Send notification via RabbitMQ (async task)
    await queueService.sendNotification({
      type: 'new_review',
      drinkId,
      userId,
      rating
    });

    return grade;
  }

  /**
   * Update an existing grade/review
   * @param {String} gradeId - Grade ID
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated grade
   */
  async updateGrade(gradeId, userId, { rating, comment }) {
    const grade = await Grade.findById(gradeId);

    if (!grade) {
      throw new Error('Review not found');
    }

    // Check ownership
    if (grade.user.toString() !== userId) {
      throw new Error('You can only update your own reviews');
    }

    // Update fields
    if (rating !== undefined) grade.rating = rating;
    if (comment !== undefined) grade.comment = comment;

    await grade.save();
    await grade.populate('user', 'username');

    return grade;
  }

  /**
   * Delete a grade/review
   * @param {String} gradeId - Grade ID
   * @param {String} userId - User ID
   * @param {String} userRole - User role
   * @returns {Boolean} Success status
   */
  async deleteGrade(gradeId, userId, userRole) {
    const grade = await Grade.findById(gradeId);

    if (!grade) {
      throw new Error('Review not found');
    }

    // Check ownership or admin
    if (grade.user.toString() !== userId && userRole !== 'admin') {
      throw new Error('You can only delete your own reviews');
    }

    await Grade.findByIdAndDelete(gradeId);

    return true;
  }

  /**
   * Get grades for a specific drink
   * @param {String} drinkId - Drink ID
   * @param {Object} options - Query options
   * @returns {Object} Grades and pagination
   */
  async getGradesByDrink(drinkId, { page = 1, limit = 10, sortBy = '-createdAt' }) {
    const skip = (page - 1) * limit;

    const [grades, total] = await Promise.all([
      Grade.find({ drink: drinkId })
        .populate('user', 'username')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean(),
      Grade.countDocuments({ drink: drinkId })
    ]);

    return {
      grades,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get grades by a specific user
   * @param {String} userId - User ID
   * @param {Object} options - Query options
   * @returns {Object} Grades and pagination
   */
  async getGradesByUser(userId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [grades, total] = await Promise.all([
      Grade.find({ user: userId })
        .populate('drink', 'name category imageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Grade.countDocuments({ user: userId })
    ]);

    return {
      grades,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Mark review as helpful
   * @param {String} gradeId - Grade ID
   * @returns {Object} Updated grade
   */
  async markAsHelpful(gradeId) {
    const grade = await Grade.findByIdAndUpdate(
      gradeId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    ).populate('user', 'username');

    if (!grade) {
      throw new Error('Review not found');
    }

    return grade;
  }

  /**
   * Get review statistics for a drink
   * @param {String} drinkId - Drink ID
   * @returns {Object} Statistics
   */
  async getGradeStats(drinkId) {
    const stats = await Grade.aggregate([
      { $match: { drink: drinkId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    stats.forEach((stat) => {
      ratingDistribution[stat._id] = stat.count;
    });

    return ratingDistribution;
  }
}

export default new GradeService();
