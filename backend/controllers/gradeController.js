import gradeService from '../services/gradeService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Create a new grade/review
 * @route   POST /api/grades
 * @access  Private
 */
export const createGrade = asyncHandler(async (req, res) => {
  const { drinkId, rating, comment } = req.body;

  const grade = await gradeService.createGrade(req.user.id, {
    drinkId,
    rating,
    comment
  });

  res.status(201).json({
    status: 'success',
    data: grade
  });
});

/**
 * @desc    Update a grade/review
 * @route   PUT /api/grades/:id
 * @access  Private
 */
export const updateGrade = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const grade = await gradeService.updateGrade(req.params.id, req.user.id, {
    rating,
    comment
  });

  res.status(200).json({
    status: 'success',
    data: grade
  });
});

/**
 * @desc    Delete a grade/review
 * @route   DELETE /api/grades/:id
 * @access  Private
 */
export const deleteGrade = asyncHandler(async (req, res) => {
  await gradeService.deleteGrade(req.params.id, req.user.id, req.user.role);

  res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully'
  });
});

/**
 * @desc    Get grades for a drink
 * @route   GET /api/grades/drink/:drinkId
 * @access  Public
 */
export const getGradesByDrink = asyncHandler(async (req, res) => {
  const { drinkId } = req.params;
  const { page, limit, sortBy } = req.query;

  const result = await gradeService.getGradesByDrink(drinkId, {
    page,
    limit,
    sortBy
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

/**
 * @desc    Get user's grades
 * @route   GET /api/grades/user
 * @access  Private
 */
export const getMyGrades = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await gradeService.getGradesByUser(req.user.id, {
    page,
    limit
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

/**
 * @desc    Mark review as helpful
 * @route   POST /api/grades/:id/helpful
 * @access  Public
 */
export const markAsHelpful = asyncHandler(async (req, res) => {
  const grade = await gradeService.markAsHelpful(req.params.id);

  res.status(200).json({
    status: 'success',
    data: grade
  });
});

/**
 * @desc    Get grade statistics for a drink
 * @route   GET /api/grades/stats/:drinkId
 * @access  Public
 */
export const getGradeStats = asyncHandler(async (req, res) => {
  const stats = await gradeService.getGradeStats(req.params.drinkId);

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

export default {
  createGrade,
  updateGrade,
  deleteGrade,
  getGradesByDrink,
  getMyGrades,
  markAsHelpful,
  getGradeStats
};
