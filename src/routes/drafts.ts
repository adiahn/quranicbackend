import { Router } from 'express';
import { 
  getAllDrafts, 
  getDraftById, 
  createDraft, 
  updateDraft, 
  deleteDraft,
  saveDraft
} from '../controllers/drafts';
import { authenticateToken, requireInterviewer } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { 
  createDraftSchema, 
  updateDraftSchema, 
  getDraftSchema, 
  deleteDraftSchema,
  getDraftsSchema
} from '../validations/drafts';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all drafts
router.get('/', validate(getDraftsSchema), getAllDrafts);

// Get draft by ID
router.get('/:id', validate(getDraftSchema), getDraftById);

// Create new draft
router.post('/', requireInterviewer, validate(createDraftSchema), createDraft);

// Save draft (create or update)
router.post('/save', requireInterviewer, validate(createDraftSchema), saveDraft);

// Update draft
router.put('/:id', requireInterviewer, validate(updateDraftSchema), updateDraft);

// Delete draft
router.delete('/:id', requireInterviewer, validate(deleteDraftSchema), deleteDraft);

export default router; 