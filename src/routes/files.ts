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

// Apply authentication to all routes
router.use(authenticateToken);

// Upload file
router.post('/upload', requireInterviewer, upload.single('file'), uploadFile);

// Get files by user
router.get('/my-files', getFilesByUser);

// Get file by ID
router.get('/:id', getFileById);

// Download file
router.get('/:id/download', downloadFile);

// Delete file
router.delete('/:id', requireInterviewer, deleteFile);

export default router; 