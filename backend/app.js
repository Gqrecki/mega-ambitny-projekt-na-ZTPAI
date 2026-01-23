import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/authRoutes.js';
import drinkRoutes from './routes/drinkRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Import Swagger
import setupSwagger from './config/swagger.js';

// Load environment variables
dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'DrinkAdvisor API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Setup Swagger Documentation
setupSwagger(app);

// API Welcome
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to DrinkAdvisor API',
    version: '1.0.0',
    docs: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      drinks: '/api/drinks',
      grades: '/api/grades',
      favorites: '/api/favorites'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/drinks', drinkRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/favorites', favoriteRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
