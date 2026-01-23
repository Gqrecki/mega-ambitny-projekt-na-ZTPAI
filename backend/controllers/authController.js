import authService from '../services/authService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const result = await authService.register({ username, email, password });

  res.status(201).json({
    status: 'success',
    data: result
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);

  res.status(200).json({
    status: 'success',
    data: profile
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const updatedInfo = await authService.updateProfile(req.user.id, req.body);

  res.status(200).json({
    status: 'success',
    data: updatedInfo
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await authService.changePassword(req.user.id, {
    currentPassword,
    newPassword
  });

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

/**
 * @desc    Get user statistics
 * @route   GET /api/auth/stats
 * @access  Private
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await authService.getUserStats(req.user.id);

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getUserStats
};
