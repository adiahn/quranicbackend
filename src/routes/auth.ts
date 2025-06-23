import { Router } from 'express';
import { login, refreshToken, getCurrentUser, changePassword, register } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { loginSchema, registerSchema, refreshTokenSchema, changePasswordSchema } from '../validations/auth';

const router = Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth router is working!' });
});

// Register
router.post('/register', validate(registerSchema), register);

// Login
router.post('/login', validate(loginSchema), login);

// Refresh token
router.post('/refresh', validate(refreshTokenSchema), refreshToken);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

// Change password
router.post('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);

export default router; 