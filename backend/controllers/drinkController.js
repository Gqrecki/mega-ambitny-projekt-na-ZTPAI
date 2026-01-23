import drinkService from '../services/drinkService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all drinks
 * @route   GET /api/drinks
 * @access  Public
 */
export const getAllDrinks = asyncHandler(async (req, res) => {
  const { page, limit, category, search, sortBy } = req.query;

  const result = await drinkService.getAllDrinks({
    page,
    limit,
    category,
    search,
    sortBy
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

/**
 * @desc    Get drink by ID
 * @route   GET /api/drinks/:id
 * @access  Public
 */
export const getDrinkById = asyncHandler(async (req, res) => {
  const drink = await drinkService.getDrinkById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: drink
  });
});

/**
 * @desc    Create a new drink
 * @route   POST /api/drinks
 * @access  Private/Admin
 */
export const createDrink = asyncHandler(async (req, res) => {
  const drink = await drinkService.createDrink(req.body);

  res.status(201).json({
    status: 'success',
    data: drink
  });
});

/**
 * @desc    Update a drink
 * @route   PUT /api/drinks/:id
 * @access  Private/Admin
 */
export const updateDrink = asyncHandler(async (req, res) => {
  const drink = await drinkService.updateDrink(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: drink
  });
});

/**
 * @desc    Delete a drink
 * @route   DELETE /api/drinks/:id
 * @access  Private/Admin
 */
export const deleteDrink = asyncHandler(async (req, res) => {
  await drinkService.deleteDrink(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Drink deleted successfully'
  });
});

/**
 * @desc    Get trending drinks
 * @route   GET /api/drinks/trending
 * @access  Public
 */
export const getTrendingDrinks = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 10;
  const drinks = await drinkService.getTrendingDrinks(limit);

  res.status(200).json({
    status: 'success',
    data: drinks
  });
});

/**
 * @desc    Get drinks by category
 * @route   GET /api/drinks/category/:category
 * @access  Public
 */
export const getDrinksByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const limit = req.query.limit || 20;

  const drinks = await drinkService.getDrinksByCategory(category, limit);

  res.status(200).json({
    status: 'success',
    data: drinks
  });
});

/**
 * @desc    Get drink statistics
 * @route   GET /api/drinks/stats/overview
 * @access  Private/Admin
 */
export const getDrinkStats = asyncHandler(async (req, res) => {
  const stats = await drinkService.getDrinkStats();

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

/**
 * @desc    Search drinks
 * @route   GET /api/drinks/search
 * @access  Public
 */
export const searchDrinks = asyncHandler(async (req, res) => {
  const { q, limit } = req.query;

  const drinks = await drinkService.searchDrinks(q, limit);

  res.status(200).json({
    status: 'success',
    data: drinks
  });
});

export default {
  getAllDrinks,
  getDrinkById,
  createDrink,
  updateDrink,
  deleteDrink,
  getTrendingDrinks,
  getDrinksByCategory,
  getDrinkStats,
  searchDrinks
};
