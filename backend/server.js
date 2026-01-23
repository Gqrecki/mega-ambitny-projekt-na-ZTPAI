import app from './app.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Database connection will be added in Phase 2
// RabbitMQ connection will be added in Phase 3

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        🍸 DrinkAdvisor API Server Running            ║
║                                                       ║
║        Environment: ${process.env.NODE_ENV?.padEnd(10) || 'development'.padEnd(10)}                      ║
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
