import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (config.upload.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

// Generate file URL
export const generateFileUrl = (filename: string): string => {
  return `${config.server.port ? `http://localhost:${config.server.port}` : ''}/uploads/${filename}`;
};

// Validate file size
export const validateFileSize = (size: number): boolean => {
  return size <= config.upload.maxFileSize;
};

// Get file extension
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

// Generate unique filename
export const generateUniqueFilename = (originalName: string): string => {
  const extension = path.extname(originalName);
  return `${uuidv4()}-${Date.now()}${extension}`;
}; 