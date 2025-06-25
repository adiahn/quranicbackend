import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  toggleUserStatus,
  changeUserPassword,
  deactivateUser
} from '../controllers/users';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { 
  createUserSchema, 
  updateUserSchema, 
  getUserSchema, 
  deleteUserSchema,
  getUsersSchema,
  changePasswordSchema,
  deactivateUserSchema
} from '../validations/users';

const router = Router();

// Apply authentication and admin role to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users (with filtering)
router.get('/', validate(getUsersSchema), getAllUsers);

// Get user by ID
router.get('/:id', validate(getUserSchema), getUserById);

// Create new user
router.post('/', validate(createUserSchema), createUser);

// Update user
router.put('/:id', validate(updateUserSchema), updateUser);

// Delete user
router.delete('/:id', validate(deleteUserSchema), deleteUser);

// Toggle user status
router.patch('/:id/toggle-status', validate(getUserSchema), toggleUserStatus);

// Change user password
router.patch('/:id/change-password', validate(changePasswordSchema), changeUserPassword);

// Deactivate user
router.patch('/:id/deactivate', validate(deactivateUserSchema), deactivateUser);

export default router; 