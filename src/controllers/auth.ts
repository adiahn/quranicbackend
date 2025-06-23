import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { ApiResponse, IUser } from '../types';

function generateInterviewerId(): string {
  // Generate a random 5-digit number and prefix with INT
  const random = Math.floor(10000 + Math.random() * 90000);
  return `INT${random}`;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
      return;
    }

    // Generate unique interviewerId
    let interviewerId;
    let exists = true;
    while (exists) {
      interviewerId = generateInterviewerId();
      const existingUser = await User.findOne({ interviewerId });
      exists = !!existingUser;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      interviewerId,
      name,
      email,
      role: 'INTERVIEWER',
      isActive: true,
      passwordHash,
      lga: '', // LGA can be updated later
    });
    await user.save();

    // Prepare response user object
    const userResponse = {
      _id: user._id,
      interviewerId: user.interviewerId,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    // Generate tokens
    const userObj: IUser = {
      _id: user._id?.toString(),
      interviewerId: user.interviewerId,
      name: user.name,
      email: user.email,
      lga: user.lga,
      role: user.role,
      isActive: user.isActive,
    };
    const accessToken = generateAccessToken(userObj);
    const refreshToken = generateRefreshToken(userObj);

    const response: ApiResponse = {
      success: true,
      message: 'Registration successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewerId, password } = req.body;

    // Find user by interviewer ID
    const user = await User.findOne({ interviewerId });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create user object for token generation
    const userObj: IUser = {
      _id: user._id?.toString(),
      interviewerId: user.interviewerId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      lga: user.lga,
      role: user.role,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generate tokens
    const accessToken = generateAccessToken(userObj);
    const refreshToken = generateRefreshToken(userObj);

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
    };

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
      return;
    }

    // Create user object for token generation
    const userObj: IUser = {
      _id: user._id?.toString(),
      interviewerId: user.interviewerId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      lga: user.lga,
      role: user.role,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generate new tokens
    const newAccessToken = generateAccessToken(userObj);
    const newRefreshToken = generateRefreshToken(userObj);

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already attached to req by auth middleware
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: {
          _id: user._id,
          interviewerId: user.interviewerId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          lga: user.lga,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user;

    // Find user
    const userDoc = await User.findById(user._id);
    if (!userDoc) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userDoc.passwordHash!);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    userDoc.passwordHash = newPasswordHash;
    await userDoc.save();

    const response: ApiResponse = {
      success: true,
      message: 'Password changed successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 