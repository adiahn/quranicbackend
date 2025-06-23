import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { createPaginationResponse, buildSearchQuery } from '../utils/pagination';
import { ApiResponse, AuthRequest } from '../types';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, role, lga, isActive } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = {};
    
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['name', 'interviewerId', 'email']);
      Object.assign(query, searchQuery);
    }
    
    if (role) query.role = role;
    if (lga) query.lga = lga;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Execute query
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    const response = createPaginationResponse(
      users,
      total,
      Number(page),
      Number(limit)
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-passwordHash').lean();
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    const currentUser = req.user!;

    // Check if current user is admin
    if (currentUser.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    // Check if interviewer ID already exists
    const existingUser = await User.findOne({ interviewerId: userData.interviewerId });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Interviewer ID already exists',
      });
      return;
    }

    // Check if email already exists
    if (userData.email) {
      const existingEmail = await User.findOne({ email: userData.email });
      if (existingEmail) {
        res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
        return;
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);

    const user = new User({
      ...userData,
      passwordHash,
    });

    await user.save();

    // Remove password from response
    const userResponse = {
      _id: user._id,
      interviewerId: user.interviewerId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      lga: user.lga,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response: ApiResponse = {
      success: true,
      message: 'User created successfully',
      data: userResponse,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const currentUser = req.user!;

    // Check if current user is admin
    if (currentUser.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if interviewer ID is being changed and if it already exists
    if (updateData.interviewerId && updateData.interviewerId !== user.interviewerId) {
      const existingUser = await User.findOne({ interviewerId: updateData.interviewerId });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Interviewer ID already exists',
        });
        return;
      }
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = await User.findOne({ email: updateData.email });
      if (existingEmail) {
        res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
        return;
      }
    }

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 12);
      delete updateData.password;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    const response: ApiResponse = {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    // Check if current user is admin
    if (currentUser.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    // Prevent self-deletion
    if (currentUser._id === id) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
      return;
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    await User.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    // Check if current user is admin
    if (currentUser.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    // Prevent self-deactivation
    if (currentUser._id === id) {
      res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
      return;
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Toggle status
    user.isActive = !user.isActive;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: user._id,
        interviewerId: user.interviewerId,
        name: user.name,
        isActive: user.isActive,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 