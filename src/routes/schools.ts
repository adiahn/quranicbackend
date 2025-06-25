import { Router } from 'express';
import { 
  getAllSchools, 
  getSchoolById, 
  createSchool, 
  updateSchool, 
  deleteSchool,
  getSchoolsByInterviewer,
  getAllStudentsBySchools
} from '../controllers/schools';
import { authenticateToken, requireInterviewer } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { 
  createSchoolSchema, 
  updateSchoolSchema, 
  getSchoolSchema, 
  deleteSchoolSchema,
  getSchoolsSchema,
  getAllStudentsBySchoolsSchema
} from '../validations/schools';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all schools (with filtering)
router.get('/', validate(getSchoolsSchema), getAllSchools);

// Get schools by interviewer
router.get('/my-schools', validate(getSchoolsSchema), getSchoolsByInterviewer);

// Get all students by schools
router.get('/students', validate(getAllStudentsBySchoolsSchema), getAllStudentsBySchools);

// Get school by ID
router.get('/:id', validate(getSchoolSchema), getSchoolById);

// Create new school
router.post('/', requireInterviewer, validate(createSchoolSchema), createSchool);

// Update school
router.put('/:id', requireInterviewer, validate(updateSchoolSchema), updateSchool);

// Delete school
router.delete('/:id', requireInterviewer, validate(deleteSchoolSchema), deleteSchool);

export default router; 