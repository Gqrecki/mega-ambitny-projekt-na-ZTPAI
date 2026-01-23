import express from 'express';
import {
  getAllDrinks,
  getDrinkById,
  createDrink,
  updateDrink,
  deleteDrink,
  getTrendingDrinks,
  getDrinksByCategory,
  getDrinkStats,
  searchDrinks
} from '../controllers/drinkController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/drinks:
 *   get:
 *     summary: Get all drinks
 *     tags: [Drinks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of drinks
 */
router.get('/', getAllDrinks);

/**
 * @swagger
 * /api/drinks/trending:
 *   get:
 *     summary: Get trending drinks
 *     tags: [Drinks]
 *     responses:
 *       200:
 *         description: Trending drinks
 */
router.get('/trending', getTrendingDrinks);

/**
 * @swagger
 * /api/drinks/search:
 *   get:
 *     summary: Search drinks
 *     tags: [Drinks]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', searchDrinks);

/**
 * @swagger
 * /api/drinks/stats/overview:
 *   get:
 *     summary: Get drink statistics (Admin)
 *     tags: [Drinks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 */
router.get('/stats/overview', protect, restrictTo('admin'), getDrinkStats);

/**
 * @swagger
 * /api/drinks/category/{category}:
 *   get:
 *     summary: Get drinks by category
 *     tags: [Drinks]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drinks in category
 */
router.get('/category/:category', getDrinksByCategory);

/**
 * @swagger
 * /api/drinks:
 *   post:
 *     summary: Create a new drink (Admin)
 *     tags: [Drinks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Drink created
 */
router.post('/', protect, restrictTo('admin'), createDrink);

/**
 * @swagger
 * /api/drinks/{id}:
 *   get:
 *     summary: Get drink by ID
 *     tags: [Drinks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drink details
 */
router.get('/:id', getDrinkById);

/**
 * @swagger
 * /api/drinks/{id}:
 *   put:
 *     summary: Update drink (Admin)
 *     tags: [Drinks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drink updated
 */
router.put('/:id', protect, restrictTo('admin'), updateDrink);

/**
 * @swagger
 * /api/drinks/{id}:
 *   delete:
 *     summary: Delete drink (Admin)
 *     tags: [Drinks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drink deleted
 */
router.delete('/:id', protect, restrictTo('admin'), deleteDrink);

export default router;
