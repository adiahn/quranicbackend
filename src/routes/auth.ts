import { Router } from 'express';
import { login, refreshToken, getCurrentUser, changePassword, register, adminLogin, createAdminAccount } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { loginSchema, registerSchema, refreshTokenSchema, changePasswordSchema, adminLoginSchema, createAdminAccountSchema } from '../validations/auth';

const router = Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Auth router is working!' });
});

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.post('/admin/login', validate(adminLoginSchema), adminLogin);

router.post('/admin/create', validate(createAdminAccountSchema), createAdminAccount);

router.post('/refresh', validate(refreshTokenSchema), refreshToken);

router.get('/me', authenticateToken, getCurrentUser);

router.post('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);

export default router; 