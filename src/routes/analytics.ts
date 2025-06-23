import { Router } from 'express';
import { 
  getSchoolStatistics, 
  getBeggarStatistics, 
  getDashboardData,
  getInterviewerStats
} from '../controllers/analytics';
import { authenticateToken, requireSupervisor } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get school statistics
router.get('/schools', requireSupervisor, getSchoolStatistics);

// Get beggar statistics
router.get('/beggars', requireSupervisor, getBeggarStatistics);

// Get dashboard data
router.get('/dashboard', requireSupervisor, getDashboardData);

// Get interviewer statistics
router.get('/interviewer/:interviewerId', requireSupervisor, getInterviewerStats);

export default router; 