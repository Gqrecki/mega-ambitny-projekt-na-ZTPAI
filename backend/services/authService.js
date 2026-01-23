import User from '../models/User.js';
import UserInfo from '../models/UserInfo.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} User object and token
   */
  async register({ username, email, password }) {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error(
        existingUser.email === email
          ? 'Email already registered'
          : 'Username already taken'
      );
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    // Create empty user info
    await UserInfo.create({
      user: user._id
    });

    // Generate JWT token
    const token = user.generateAuthToken();

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Object} User object and token
   */
  async login({ email, password }) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Get user profile with extended info
   * @param {String} userId - User ID
   * @returns {Object} User profile
   */
  async getProfile(userId) {
    const user = await User.findById(userId).populate('userInfo');

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      userInfo: user.userInfo
    };
  }

  /**
   * Update user profile info
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user info
   */
  async updateProfile(userId, updateData) {
    const userInfo = await UserInfo.findOne({ user: userId });

    if (!userInfo) {
      throw new Error('User info not found');
    }

    // Update allowed fields
    const allowedFields = [
      'firstName',
      'lastName',
      'bio',
      'avatar',
      'location',
      'dateOfBirth',
      'phoneNumber',
      'favoriteCategory'
    ];

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        userInfo[field] = updateData[field];
      }
    });

    await userInfo.save();

    return userInfo;
  }

  /**
   * Change user password
   * @param {String} userId - User ID
   * @param {Object} passwords - Current and new password
   * @returns {Boolean} Success status
   */
  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return true;
  }

  /**
   * Get user statistics
   * @param {String} userId - User ID
   * @returns {Object} User statistics
   */
  async getUserStats(userId) {
    const Grade = (await import('../models/Grade.js')).default;
    const FavoriteDrink = (await import('../models/FavoriteDrink.js')).default;

    const [reviewCount, favoriteCount] = await Promise.all([
      Grade.countDocuments({ user: userId }),
      FavoriteDrink.countDocuments({ user: userId })
    ]);

    return {
      totalReviews: reviewCount,
      totalFavorites: favoriteCount
    };
  }
}

export default new AuthService();
