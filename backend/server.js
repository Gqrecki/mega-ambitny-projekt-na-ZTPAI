import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import setupSwagger from './config/swagger.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Setup Swagger Documentation
setupSwagger(app);

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        🍸 DrinkAdvisor API Server Running            ║
║                                                       ║
║        Environment: ${(process.env.NODE_ENV || 'development').padEnd(10)}                      ║
║        Port: ${PORT}                                     ║
║        URL: http://localhost:${PORT}                    ║
║        Health: http://localhost:${PORT}/health          ║
║        Docs: http://localhost:${PORT}/api-docs          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
