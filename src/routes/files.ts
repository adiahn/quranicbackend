import { Router } from 'express';
import { 
  uploadFile, 
  getFileById, 
  deleteFile, 
  getFilesByUser,
  downloadFile
} from '../controllers/files';
import { authenticateToken, requireInterviewer } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = Router();

router.use(authenticateToken);

router.post('/upload', requireInterviewer, upload.single('file'), uploadFile);

router.get('/my-files', getFilesByUser);

router.get('/:id', getFileById);

router.get('/:id/download', downloadFile);

router.delete('/:id', requireInterviewer, deleteFile);

export default router; 