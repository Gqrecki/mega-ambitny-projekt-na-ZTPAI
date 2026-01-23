import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import setupSwagger from './config/swagger.js';
import queueService from './services/queueService.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8080;

// Initialize connections
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected');

    // Initialize RabbitMQ
    try {
      await queueService.connect();
      console.log('✅ RabbitMQ connected');
    } catch (error) {
      console.error('⚠️  RabbitMQ connection failed:', error.message);
      console.log('⚠️  API will continue without RabbitMQ functionality');
    }

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
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
