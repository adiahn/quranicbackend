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
  getDraftsSchema,
  saveDraftSchema
} from '../validations/drafts';

const router = Router();

router.use(authenticateToken);

router.get('/', validate(getDraftsSchema), getAllDrafts);

router.get('/:id', validate(getDraftSchema), getDraftById);

router.post('/', requireInterviewer, validate(createDraftSchema), createDraft);

router.post('/save', requireInterviewer, validate(saveDraftSchema), saveDraft);

router.put('/:id', requireInterviewer, validate(updateDraftSchema), updateDraft);

router.delete('/:id', requireInterviewer, validate(deleteDraftSchema), deleteDraft);

export default router; 