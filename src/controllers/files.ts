import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { File } from '../models/File';
import { generateFileUrl, generateUniqueFilename } from '../utils/fileUpload';
import { ApiResponse, AuthRequest } from '../types';
import { config } from '../config';

export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const file = req.file;
    const { relatedToType, relatedToId } = req.body;

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    // Generate unique file ID
    const fileId = `FILE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create file record
    const fileRecord = new File({
      fileId,
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: generateFileUrl(file.filename),
      uploadedBy: user.interviewerId,
      relatedTo: relatedToType && relatedToId ? {
        type: relatedToType,
        id: relatedToId,
      } : undefined,
    });

    await fileRecord.save();

    const response: ApiResponse = {
      success: true,
      message: 'File uploaded successfully',
      data: fileRecord,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getFileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const file = await File.findById(id).lean();
    if (!file) {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'File retrieved successfully',
      data: file,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get file by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    // Find file
    const file = await File.findById(id);
    if (!file) {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
      return;
    }

    // Check permissions (only owner or admin can delete)
    if (file.uploadedBy !== user.interviewerId && user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    // Delete physical file
    const filePath = path.join(config.upload.dir, file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await File.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: 'File deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getFilesByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { page = 1, limit = 10, relatedToType, relatedToId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = { uploadedBy: user.interviewerId };
    if (relatedToType) query['relatedTo.type'] = relatedToType;
    if (relatedToId) query['relatedTo.id'] = relatedToId;

    // Execute query
    const [files, total] = await Promise.all([
      File.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      File.countDocuments(query),
    ]);

    const response = {
      success: true,
      message: 'Files retrieved successfully',
      data: files,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
        hasNext: Number(page) < Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get files by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
      return;
    }

    const filePath = path.join(config.upload.dir, file.filename);
    
    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        message: 'File not found on disk',
      });
      return;
    }

    // Set headers for download
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Length', file.size);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 