import { Router } from 'express';
import { 
  getAllBeggars, 
  getBeggarById, 
  createBeggar, 
  updateBeggar, 
  deleteBeggar,
  getBeggarsByInterviewer,
  getAllBeggarsWithStats
} from '../controllers/beggars';
import { authenticateToken, requireInterviewer } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { 
  createBeggarSchema, 
  updateBeggarSchema, 
  getBeggarSchema, 
  deleteBeggarSchema,
  getBeggarsSchema,
  getAllBeggarsWithStatsSchema
} from '../validations/beggars';

const router = Router();

router.use(authenticateToken);

router.get('/', validate(getBeggarsSchema), getAllBeggars);

router.get('/with-stats', validate(getAllBeggarsWithStatsSchema), getAllBeggarsWithStats);

router.get('/my-beggars', validate(getBeggarsSchema), getBeggarsByInterviewer);

router.get('/:id', validate(getBeggarSchema), getBeggarById);

router.post('/', requireInterviewer, validate(createBeggarSchema), createBeggar);

router.put('/:id', requireInterviewer, validate(updateBeggarSchema), updateBeggar);

router.delete('/:id', requireInterviewer, validate(deleteBeggarSchema), deleteBeggar);

export default router; 