import { Router } from 'express';
import { 
  getAllBeggars, 
  getBeggarById, 
  createBeggar, 
  updateBeggar, 
  deleteBeggar,
  getBeggarsByInterviewer
} from '../controllers/beggars';
import { authenticateToken, requireInterviewer } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { 
  createBeggarSchema, 
  updateBeggarSchema, 
  getBeggarSchema, 
  deleteBeggarSchema,
  getBeggarsSchema
} from '../validations/beggars';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all beggars (with filtering)
router.get('/', validate(getBeggarsSchema), getAllBeggars);

// Get beggars by interviewer
router.get('/my-beggars', validate(getBeggarsSchema), getBeggarsByInterviewer);

// Get beggar by ID
router.get('/:id', validate(getBeggarSchema), getBeggarById);

// Create new beggar
router.post('/', requireInterviewer, validate(createBeggarSchema), createBeggar);

// Update beggar
router.put('/:id', requireInterviewer, validate(updateBeggarSchema), updateBeggar);

// Delete beggar
router.delete('/:id', requireInterviewer, validate(deleteBeggarSchema), deleteBeggar);

export default router; 