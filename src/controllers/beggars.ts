import { Request, Response } from 'express';
import { Beggar } from '../models/Beggar';
import { createPaginationResponse, buildSearchQuery } from '../utils/pagination';
import { ApiResponse, AuthRequest } from '../types';

export const getAllBeggars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, lga, stateOfOrigin, isBegging, interviewerId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = {};
    
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['name', 'beggarId']);
      Object.assign(query, searchQuery);
    }
    
    if (lga) query.lga = lga;
    if (stateOfOrigin) query.stateOfOrigin = stateOfOrigin;
    if (isBegging !== undefined) query.isBegging = isBegging === 'true';
    if (interviewerId) query.interviewerId = interviewerId;

    // Execute query
    const [beggars, total] = await Promise.all([
      Beggar.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Beggar.countDocuments(query),
    ]);

    const response = createPaginationResponse(
      beggars,
      total,
      Number(page),
      Number(limit)
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Get all beggars error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getBeggarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const beggar = await Beggar.findById(id).lean();
    if (!beggar) {
      res.status(404).json({
        success: false,
        message: 'Beggar not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Beggar retrieved successfully',
      data: beggar,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get beggar by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createBeggar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const beggarData = req.body;
    const user = req.user!;

    // Add interviewer ID
    beggarData.interviewerId = user.interviewerId;

    // Check if beggar ID already exists
    const existingBeggar = await Beggar.findOne({ beggarId: beggarData.beggarId });
    if (existingBeggar) {
      res.status(400).json({
        success: false,
        message: 'Beggar ID already exists',
      });
      return;
    }

    const beggar = new Beggar(beggarData);
    await beggar.save();

    const response: ApiResponse = {
      success: true,
      message: 'Beggar created successfully',
      data: beggar,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create beggar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateBeggar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = req.user!;

    // Find beggar
    const beggar = await Beggar.findById(id);
    if (!beggar) {
      res.status(404).json({
        success: false,
        message: 'Beggar not found',
      });
      return;
    }

    // Check permissions (only owner or admin can update)
    if (beggar.interviewerId !== user.interviewerId && user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    // Check if beggar ID is being changed and if it already exists
    if (updateData.beggarId && updateData.beggarId !== beggar.beggarId) {
      const existingBeggar = await Beggar.findOne({ beggarId: updateData.beggarId });
      if (existingBeggar) {
        res.status(400).json({
          success: false,
          message: 'Beggar ID already exists',
        });
        return;
      }
    }

    // Update beggar
    const updatedBeggar = await Beggar.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    const response: ApiResponse = {
      success: true,
      message: 'Beggar updated successfully',
      data: updatedBeggar,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update beggar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteBeggar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    // Find beggar
    const beggar = await Beggar.findById(id);
    if (!beggar) {
      res.status(404).json({
        success: false,
        message: 'Beggar not found',
      });
      return;
    }

    // Check permissions (only owner or admin can delete)
    if (beggar.interviewerId !== user.interviewerId && user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    await Beggar.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Beggar deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Delete beggar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getBeggarsByInterviewer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { page = 1, limit = 10, isBegging } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = { interviewerId: user.interviewerId };
    if (isBegging !== undefined) query.isBegging = isBegging === 'true';

    // Execute query
    const [beggars, total] = await Promise.all([
      Beggar.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Beggar.countDocuments(query),
    ]);

    const response = createPaginationResponse(
      beggars,
      total,
      Number(page),
      Number(limit)
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Get beggars by interviewer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 

export const getAllBeggarsWithStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, lga, stateOfOrigin, isBegging, interviewerId, ageRange, gender } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = {};
    
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['name', 'beggarId']);
      Object.assign(query, searchQuery);
    }
    
    if (lga) query.lga = lga;
    if (stateOfOrigin) query.stateOfOrigin = stateOfOrigin;
    if (isBegging !== undefined) query.isBegging = isBegging === 'true';
    if (interviewerId) query.interviewerId = interviewerId;
    if (gender) query.sex = gender;

    // Age range filtering
    if (ageRange) {
      const [minAge, maxAge] = (ageRange as string).split('-').map(Number);
      if (minAge && maxAge) {
        query.age = { $gte: minAge, $lte: maxAge };
      } else if (minAge) {
        query.age = { $gte: minAge };
      } else if (maxAge) {
        query.age = { $lte: maxAge };
      }
    }

    // Execute query
    const [beggars, total] = await Promise.all([
      Beggar.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Beggar.countDocuments(query),
    ]);

    // Get statistics
    const stats = await Beggar.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalBeggars: { $sum: 1 },
          activeBeggars: { $sum: { $cond: ['$isBegging', 1, 0] } },
          averageAge: { $avg: '$age' },
          byGender: {
            $push: {
              gender: '$sex',
              count: 1
            }
          },
          byLga: {
            $push: {
              lga: '$lga',
              count: 1
            }
          }
        }
      }
    ]);

    const response = createPaginationResponse(
      beggars,
      total,
      Number(page),
      Number(limit)
    );

    // Add statistics to response
    (response as any).statistics = stats[0] || {
      totalBeggars: 0,
      activeBeggars: 0,
      averageAge: 0,
      byGender: [],
      byLga: []
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get all beggars with stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 