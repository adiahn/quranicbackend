import { Request, Response } from 'express';
import { School } from '../models/School';
import { createPaginationResponse, buildSearchQuery } from '../utils/pagination';
import { ApiResponse, AuthRequest } from '../types';

export const getAllSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, lga, status, interviewerId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = {};
    
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['name', 'address', 'schoolCode']);
      Object.assign(query, searchQuery);
    }
    
    if (lga) query.lga = lga;
    if (status) query.status = status;
    if (interviewerId) query.interviewerId = interviewerId;

    // Execute query
    const [schools, total] = await Promise.all([
      School.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      School.countDocuments(query),
    ]);

    const response = createPaginationResponse(
      schools,
      total,
      Number(page),
      Number(limit)
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Get all schools error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getSchoolById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const school = await School.findById(id).lean();
    if (!school) {
      res.status(404).json({
        success: false,
        message: 'School not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'School retrieved successfully',
      data: school,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get school by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createSchool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schoolData = req.body;
    const user = req.user!;

    // Add interviewer ID
    schoolData.interviewerId = user.interviewerId;

    // Check if school code already exists
    const existingSchool = await School.findOne({ schoolCode: schoolData.schoolCode });
    if (existingSchool) {
      res.status(400).json({
        success: false,
        message: 'School code already exists',
      });
      return;
    }

    const school = new School(schoolData);
    await school.save();

    const response: ApiResponse = {
      success: true,
      message: 'School created successfully',
      data: school,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateSchool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = req.user!;

    // Find school
    const school = await School.findById(id);
    if (!school) {
      res.status(404).json({
        success: false,
        message: 'School not found',
      });
      return;
    }

    // Check permissions (only owner or admin can update)
    if (school.interviewerId !== user.interviewerId && user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    // Check if school code is being changed and if it already exists
    if (updateData.schoolCode && updateData.schoolCode !== school.schoolCode) {
      const existingSchool = await School.findOne({ schoolCode: updateData.schoolCode });
      if (existingSchool) {
        res.status(400).json({
          success: false,
          message: 'School code already exists',
        });
        return;
      }
    }

    // Update school
    const updatedSchool = await School.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    const response: ApiResponse = {
      success: true,
      message: 'School updated successfully',
      data: updatedSchool,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update school error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteSchool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    // Find school
    const school = await School.findById(id);
    if (!school) {
      res.status(404).json({
        success: false,
        message: 'School not found',
      });
      return;
    }

    // Check permissions (only owner or admin can delete)
    if (school.interviewerId !== user.interviewerId && user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    await School.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: 'School deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Delete school error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getSchoolsByInterviewer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = { interviewerId: user.interviewerId };
    if (status) query.status = status;

    // Execute query
    const [schools, total] = await Promise.all([
      School.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      School.countDocuments(query),
    ]);

    const response = createPaginationResponse(
      schools,
      total,
      Number(page),
      Number(limit)
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Get schools by interviewer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 