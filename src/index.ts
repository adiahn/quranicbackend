import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { config } from './config';
import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import beggarsRoutes from './routes/beggars';
import draftsRoutes from './routes/drafts';
import filesRoutes from './routes/files';
import schoolsRoutes from './routes/schools';
import usersRoutes from './routes/users';

const app = express();

// Enhanced startup logging
console.log('🚀 Starting Quranic Schools Backend...');
console.log(`📊 Environment: ${config.server.nodeEnv}`);
console.log(`🔌 Port: ${config.server.port}`);
console.log(`🌐 CORS origins: ${config.cors.origin.join(', ')}`);

// Connect to MongoDB with better error handling
console.log('🔗 Connecting to MongoDB...');
connectDB()
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  });

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static(config.upload.dir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.nodeEnv,
    port: config.server.port,
    version: '1.0.0',
  });
});

// Test route to debug routing
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test route working!',
    environment: config.server.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Quranic Schools Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      test: '/test',
      auth: '/api/auth',
      schools: '/api/schools',
      beggars: '/api/beggars',
      users: '/api/users',
      analytics: '/api/analytics',
    }
  });
});

// API routes
console.log('📋 Loading API routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes loaded');
app.use('/api/schools', schoolsRoutes);
console.log('✅ Schools routes loaded');
app.use('/api/beggars', beggarsRoutes);
console.log('✅ Beggars routes loaded');
app.use('/api/drafts', draftsRoutes);
console.log('✅ Drafts routes loaded');
app.use('/api/files', filesRoutes);
console.log('✅ Files routes loaded');
app.use('/api/analytics', analyticsRoutes);
console.log('✅ Analytics routes loaded');
app.use('/api/users', usersRoutes);
console.log('✅ Users routes loaded');
console.log('🎉 All routes loaded successfully!');

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server with better error handling
const PORT = parseInt(config.server.port.toString());
console.log(`🌐 Attempting to start server on port ${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.server.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test route: http://localhost:${PORT}/test`);
  console.log(`🌐 CORS origins: ${config.cors.origin.join(', ')}`);
  console.log('✅ Server startup complete!');
});

// Handle server errors
server.on('error', (error: any) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else if (error.code === 'EACCES') {
    console.error(`❌ Permission denied to bind to port ${PORT}`);
    process.exit(1);
  } else {
    console.error('❌ Unknown server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app; 