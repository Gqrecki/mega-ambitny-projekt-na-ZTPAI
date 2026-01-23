import express from 'express';
import {
  createGrade,
  updateGrade,
  deleteGrade,
  getGradesByDrink,
  getMyGrades,
  markAsHelpful,
  getGradeStats
} from '../controllers/gradeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/grades:
 *   post:
 *     summary: Create a new review
 *     tags: [Grades]
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
 *               - rating
 *             properties:
 *               drinkId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 */
router.post('/', protect, createGrade);

/**
 * @swagger
 * /api/grades/user:
 *   get:
 *     summary: Get current user's reviews
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's reviews
 */
router.get('/user', protect, getMyGrades);

/**
 * @swagger
 * /api/grades/drink/{drinkId}:
 *   get:
 *     summary: Get reviews for a drink
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: drinkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drink reviews
 */
router.get('/drink/:drinkId', getGradesByDrink);

/**
 * @swagger
 * /api/grades/stats/{drinkId}:
 *   get:
 *     summary: Get rating statistics for a drink
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: drinkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating statistics
 */
router.get('/stats/:drinkId', getGradeStats);

/**
 * @swagger
 * /api/grades/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Grades]
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
 *         description: Review updated
 */
router.put('/:id', protect, updateGrade);

/**
 * @swagger
 * /api/grades/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Grades]
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
 *         description: Review deleted
 */
router.delete('/:id', protect, deleteGrade);

/**
 * @swagger
 * /api/grades/{id}/helpful:
 *   post:
 *     summary: Mark review as helpful
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review marked as helpful
 */
router.post('/:id/helpful', markAsHelpful);

export default router;
