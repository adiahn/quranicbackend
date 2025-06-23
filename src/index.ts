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

// Connect to MongoDB
connectDB();

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
  });
});

// Test route to debug routing
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// API routes
console.log('Loading API routes...');
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
console.log('All routes loaded successfully!');

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.server.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test route: http://localhost:${PORT}/test`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app; 