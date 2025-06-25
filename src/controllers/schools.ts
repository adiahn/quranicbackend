import { Request, Response } from 'express';
import { School } from '../models/School';
import { createPaginationResponse, buildSearchQuery } from '../utils/pagination';
import { ApiResponse, AuthRequest } from '../types';

export const getAllSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, lga, status, interviewerId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

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

export const getAllStudentsBySchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, lga, status, schoolId, gender, isBegging, ageRange } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build school query
    const schoolQuery: any = {};
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['name', 'schoolCode']);
      Object.assign(schoolQuery, searchQuery);
    }
    if (lga) schoolQuery.lga = lga;
    if (status) schoolQuery.status = status;
    if (schoolId) schoolQuery._id = schoolId;

    // Build student query
    const studentQuery: any = {};
    if (gender) studentQuery['students.gender'] = gender;
    if (isBegging !== undefined) studentQuery['students.isBegging'] = isBegging === 'true';
    
    // Age range filtering for students
    if (ageRange) {
      const [minAge, maxAge] = (ageRange as string).split('-').map(Number);
      if (minAge && maxAge) {
        studentQuery['students.age'] = { $gte: minAge, $lte: maxAge };
      } else if (minAge) {
        studentQuery['students.age'] = { $gte: minAge };
      } else if (maxAge) {
        studentQuery['students.age'] = { $lte: maxAge };
      }
    }

    // Execute query with aggregation
    const pipeline: any[] = [
      { $match: schoolQuery },
      { $unwind: '$students' },
      { $match: studentQuery },
      {
        $project: {
          _id: 1,
          schoolCode: 1,
          schoolName: '$name',
          schoolLga: '$lga',
          schoolStatus: '$status',
          student: '$students',
          interviewerId: 1,
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(limit) }
          ],
          total: [{ $count: 'count' }]
        }
      }
    ];

    const result = await School.aggregate(pipeline);
    const students = result[0].data;
    const total = result[0].total[0]?.count || 0;

    // Get statistics
    const statsPipeline: any[] = [
      { $match: schoolQuery },
      { $unwind: '$students' },
      { $match: studentQuery },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          beggingStudents: { $sum: { $cond: ['$students.isBegging', 1, 0] } },
          averageAge: { $avg: '$students.age' },
          byGender: {
            $push: {
              gender: '$students.gender',
              count: 1
            }
          },
          bySchool: {
            $push: {
              schoolName: '$name',
              schoolCode: '$schoolCode',
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
    ];

    const stats = await School.aggregate(statsPipeline);

    const response = createPaginationResponse(
      students,
      total,
      Number(page),
      Number(limit)
    );

    // Add statistics to response
    (response as any).statistics = stats[0] || {
      totalStudents: 0,
      beggingStudents: 0,
      averageAge: 0,
      byGender: [],
      bySchool: [],
      byLga: []
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get all students by schools error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 