import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern Mongoose doesn't need these options anymore (v6+)
      // useNewUrlParser and useUnifiedTopology are now defaults
    });

    console.log(`
╔═══════════════════════════════════════════════════════╗
║  ✅ MongoDB Connected Successfully                    ║
║  Host: ${conn.connection.host.padEnd(43)}║
║  Database: ${conn.connection.name.padEnd(39)}║
╚═══════════════════════════════════════════════════════╝
    `);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
