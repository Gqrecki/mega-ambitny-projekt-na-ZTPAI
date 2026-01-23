import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
  checkFavorite,
  getFavoriteCount,
  getFavoriteStats,
  getPopularFavorites
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get current user's favorite drinks
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's favorites
 */
router.get('/', protect, getMyFavorites);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add drink to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - drinkId
 *             properties:
 *               drinkId:
 *                 type: string
 *               notes:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Added to favorites
 */
router.post('/', protect, addFavorite);

/**
 * @swagger
 * /api/favorites/stats:
 *   get:
 *     summary: Get user's favorite statistics
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 */
router.get('/stats', protect, getFavoriteStats);

/**
 * @swagger
 * /api/favorites/popular:
 *   get:
 *     summary: Get popular favorited drinks
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Popular drinks
 */
router.get('/popular', getPopularFavorites);

/**
 * @swagger
 * /api/favorites/check/{drinkId}:
 *   get:
 *     summary: Check if drink is favorited
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drinkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite status
 */
router.get('/check/:drinkId', protect, checkFavorite);

/**
 * @swagger
 * /api/favorites/count/{drinkId}:
 *   get:
 *     summary: Get favorite count for a drink
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: drinkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite count
 */
router.get('/count/:drinkId', getFavoriteCount);

/**
 * @swagger
 * /api/favorites/{drinkId}:
 *   delete:
 *     summary: Remove drink from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drinkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from favorites
 */
router.delete('/:drinkId', protect, removeFavorite);

export default router;
