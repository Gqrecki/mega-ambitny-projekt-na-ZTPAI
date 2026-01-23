import favoriteService from '../services/favoriteService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Add drink to favorites
 * @route   POST /api/favorites
 * @access  Private
 */
export const addFavorite = asyncHandler(async (req, res) => {
  const { drinkId, notes, tags } = req.body;

  const favorite = await favoriteService.addFavorite(req.user.id, drinkId, {
    notes,
    tags
  });

  res.status(201).json({
    status: 'success',
    data: favorite
  });
});

/**
 * @desc    Remove drink from favorites
 * @route   DELETE /api/favorites/:drinkId
 * @access  Private
 */
export const removeFavorite = asyncHandler(async (req, res) => {
  await favoriteService.removeFavorite(req.user.id, req.params.drinkId);

  res.status(200).json({
    status: 'success',
    message: 'Removed from favorites'
  });
});

/**
 * @desc    Get user's favorite drinks
 * @route   GET /api/favorites
 * @access  Private
 */
export const getMyFavorites = asyncHandler(async (req, res) => {
  const { page, limit, category } = req.query;

  const result = await favoriteService.getUserFavorites(req.user.id, {
    page,
    limit,
    category
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

/**
 * @desc    Update favorite notes/tags
 * @route   PUT /api/favorites/:drinkId
 * @access  Private
 */
export const updateFavorite = asyncHandler(async (req, res) => {
  const { notes, tags } = req.body;

  const favorite = await favoriteService.updateFavorite(
    req.user.id,
    req.params.drinkId,
    { notes, tags }
  );

  res.status(200).json({
    status: 'success',
    data: favorite
  });
});

/**
 * @desc    Check if drink is favorited
 * @route   GET /api/favorites/check/:drinkId
 * @access  Private
 */
export const checkFavorite = asyncHandler(async (req, res) => {
  const isFavorited = await favoriteService.isFavorited(
    req.user.id,
    req.params.drinkId
  );

  res.status(200).json({
    status: 'success',
    data: { isFavorited }
  });
});

/**
 * @desc    Get favorite count for a drink
 * @route   GET /api/favorites/count/:drinkId
 * @access  Public
 */
export const getFavoriteCount = asyncHandler(async (req, res) => {
  const count = await favoriteService.getFavoriteCount(req.params.drinkId);

  res.status(200).json({
    status: 'success',
    data: { count }
  });
});

/**
 * @desc    Get user's favorite statistics
 * @route   GET /api/favorites/stats
 * @access  Private
 */
export const getFavoriteStats = asyncHandler(async (req, res) => {
  const stats = await favoriteService.getFavoriteStats(req.user.id);

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

/**
 * @desc    Get popular favorited drinks
 * @route   GET /api/favorites/popular
 * @access  Public
 */
export const getPopularFavorites = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 10;
  const drinks = await favoriteService.getPopularFavorites(limit);

  res.status(200).json({
    status: 'success',
    data: drinks
  });
});

export default {
  addFavorite,
  removeFavorite,
  getMyFavorites,
  updateFavorite,
  checkFavorite,
  getFavoriteCount,
  getFavoriteStats,
  getPopularFavorites
};
