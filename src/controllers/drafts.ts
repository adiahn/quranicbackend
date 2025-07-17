import { Request, Response } from 'express';
import { Draft } from '../models/Draft';
import { createPaginationResponse } from '../utils/pagination';
import { ApiResponse, AuthRequest } from '../types';

export const getAllDrafts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { page = 1, limit = 10, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = { interviewerId: user.interviewerId };
    if (type) query.type = type;

    // Execute query
    const [drafts, total] = await Promise.all([
      Draft.find(query)
        .sort({ lastSaved: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Draft.countDocuments(query),
    ]);

    const response = createPaginationResponse(
      drafts,
      total,
      Number(page),
      Number(limit)
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Get all drafts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['Failed to retrieve drafts'],
    });
  }
};

export const getDraftById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const draft = await Draft.findOne({ _id: id, interviewerId: user.interviewerId }).lean();
    if (!draft) {
      res.status(404).json({
        success: false,
        message: 'Draft not found',
        errors: ['Draft with the specified ID does not exist'],
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Draft retrieved successfully',
      data: draft,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get draft by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['Failed to retrieve draft'],
    });
  }
};

export const createDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { draftId, type, data } = req.body;
    const user = req.user!;

    // Check if draft ID already exists for this user
    const existingDraft = await Draft.findOne({ 
      draftId, 
      interviewerId: user.interviewerId 
    });
    
    if (existingDraft) {
      res.status(400).json({
        success: false,
        message: 'Draft ID already exists',
        errors: ['Draft ID must be unique for this user'],
      });
      return;
    }

    const draft = new Draft({
      draftId,
      type,
      data,
      interviewerId: user.interviewerId,
      lastSaved: new Date(),
    });

    await draft.save();

    const response: ApiResponse = {
      success: true,
      message: 'Draft created successfully',
      data: draft,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['Failed to create draft'],
    });
  }
};

export const updateDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const user = req.user!;

    // Find draft
    const draft = await Draft.findOne({ _id: id, interviewerId: user.interviewerId });
    if (!draft) {
      res.status(404).json({
        success: false,
        message: 'Draft not found',
        errors: ['Draft with the specified ID does not exist'],
      });
      return;
    }

    // Update draft
    draft.data = data;
    draft.lastSaved = new Date();
    await draft.save();

    const response: ApiResponse = {
      success: true,
      message: 'Draft updated successfully',
      data: draft,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['Failed to update draft'],
    });
  }
};

export const deleteDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    // Find and delete draft
    const draft = await Draft.findOneAndDelete({ 
      _id: id, 
      interviewerId: user.interviewerId 
    });
    
    if (!draft) {
      res.status(404).json({
        success: false,
        message: 'Draft not found',
        errors: ['Draft with the specified ID does not exist'],
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Draft deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Delete draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['Failed to delete draft'],
    });
  }
};

export const saveDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { draftId, type, data } = req.body;
    const user = req.user!;

    // Try to find existing draft
    let draft = await Draft.findOne({ 
      draftId, 
      interviewerId: user.interviewerId 
    });

    if (draft) {
      // Update existing draft
      draft.data = data;
      draft.lastSaved = new Date();
      await draft.save();
    } else {
      // Create new draft
      draft = new Draft({
        draftId,
        type,
        data,
        interviewerId: user.interviewerId,
        lastSaved: new Date(),
      });
      await draft.save();
    }

    const response: ApiResponse = {
      success: true,
      message: 'Draft saved successfully',
      data: draft,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['Failed to save draft'],
    });
  }
}; 