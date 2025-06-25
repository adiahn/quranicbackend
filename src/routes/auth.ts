import { Router } from 'express';
import { login, refreshToken, getCurrentUser, changePassword, register, adminLogin, createAdminAccount } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { loginSchema, registerSchema, refreshTokenSchema, changePasswordSchema, adminLoginSchema, createAdminAccountSchema } from '../validations/auth';

const router = Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth router is working!' });
});

// Register
router.post('/register', validate(registerSchema), register);

// Login
router.post('/login', validate(loginSchema), login);

// Admin login
router.post('/admin/login', validate(adminLoginSchema), adminLogin);

// Create admin account
router.post('/admin/create', validate(createAdminAccountSchema), createAdminAccount);

// Refresh token
router.post('/refresh', validate(refreshTokenSchema), refreshToken);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

// Change password
router.post('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);

export default router; 