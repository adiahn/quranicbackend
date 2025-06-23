import { Request, Response } from 'express';
import { School } from '../models/School';
import { Beggar } from '../models/Beggar';
import { User } from '../models/User';
import { ApiResponse } from '../types';

export const getSchoolStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lga, status } = req.query;

    // Build query
    const query: any = {};
    if (lga) query.lga = lga;
    if (status) query.status = status;

    // Get basic counts
    const totalSchools = await School.countDocuments(query);
    const publishedSchools = await School.countDocuments({ ...query, status: 'PUBLISHED' });
    const draftSchools = await School.countDocuments({ ...query, status: 'DRAFT' });
    const incompleteSchools = await School.countDocuments({ ...query, status: 'INCOMPLETE' });

    // Get LGA distribution
    const lgaDistribution = await School.aggregate([
      { $match: query },
      { $group: { _id: '$lga', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get status distribution
    const statusDistribution = await School.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get total students
    const totalStudents = await School.aggregate([
      { $match: query },
      { $unwind: '$students' },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);

    // Get students by gender
    const studentsByGender = await School.aggregate([
      { $match: query },
      { $unwind: '$students' },
      { $group: { _id: '$students.gender', count: { $sum: 1 } } },
    ]);

    // Get begging students
    const beggingStudents = await School.aggregate([
      { $match: query },
      { $unwind: '$students' },
      { $match: { 'students.isBegging': true } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    // Get schools with facilities
    const schoolsWithToilets = await School.countDocuments({ ...query, 'schoolStructure.hasToilets': true });
    const schoolsWithFeeding = await School.countDocuments({ ...query, 'schoolStructure.feedsPupils': true });
    const schoolsWithSleeping = await School.countDocuments({ ...query, 'schoolStructure.providesSleepingPlace': true });

    const response: ApiResponse = {
      success: true,
      message: 'School statistics retrieved successfully',
      data: {
        overview: {
          totalSchools,
          publishedSchools,
          draftSchools,
          incompleteSchools,
          completionRate: totalSchools > 0 ? ((publishedSchools / totalSchools) * 100).toFixed(2) : 0,
        },
        students: {
          total: totalStudents[0]?.total || 0,
          byGender: studentsByGender,
          begging: beggingStudents[0]?.count || 0,
          beggingPercentage: totalStudents[0]?.total > 0 ? 
            (((beggingStudents[0]?.count || 0) / totalStudents[0].total) * 100).toFixed(2) : 0,
        },
        facilities: {
          withToilets: schoolsWithToilets,
          withFeeding: schoolsWithFeeding,
          withSleeping: schoolsWithSleeping,
        },
        distribution: {
          byLga: lgaDistribution,
          byStatus: statusDistribution,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get school statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getBeggarStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lga, stateOfOrigin } = req.query;

    // Build query
    const query: any = {};
    if (lga) query.lga = lga;
    if (stateOfOrigin) query.stateOfOrigin = stateOfOrigin;

    // Get basic counts
    const totalBeggars = await Beggar.countDocuments(query);
    const activeBeggars = await Beggar.countDocuments({ ...query, isBegging: true });
    const inactiveBeggars = await Beggar.countDocuments({ ...query, isBegging: false });

    // Get age distribution
    const ageDistribution = await Beggar.aggregate([
      { $match: query },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 5, 10, 15, 18, 25, 35, 50, 65, 100],
          default: '65+',
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    // Get gender distribution
    const genderDistribution = await Beggar.aggregate([
      { $match: query },
      { $group: { _id: '$sex', count: { $sum: 1 } } },
    ]);

    // Get LGA distribution
    const lgaDistribution = await Beggar.aggregate([
      { $match: query },
      { $group: { _id: '$lga', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get state of origin distribution
    const stateDistribution = await Beggar.aggregate([
      { $match: query },
      { $group: { _id: '$stateOfOrigin', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get nationality distribution
    const nationalityDistribution = await Beggar.aggregate([
      { $match: query },
      { $group: { _id: '$nationality', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get average age
    const averageAge = await Beggar.aggregate([
      { $match: query },
      { $group: { _id: null, avgAge: { $avg: '$age' } } },
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Beggar statistics retrieved successfully',
      data: {
        overview: {
          totalBeggars,
          activeBeggars,
          inactiveBeggars,
          activePercentage: totalBeggars > 0 ? ((activeBeggars / totalBeggars) * 100).toFixed(2) : 0,
          averageAge: averageAge[0]?.avgAge ? Math.round(averageAge[0].avgAge) : 0,
        },
        demographics: {
          byAge: ageDistribution,
          byGender: genderDistribution,
          byNationality: nationalityDistribution,
        },
        location: {
          byLga: lgaDistribution,
          byState: stateDistribution,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get beggar statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get overall statistics
    const totalSchools = await School.countDocuments();
    const totalBeggars = await Beggar.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalStudents = await School.aggregate([
      { $unwind: '$students' },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);

    // Get recent activity
    const recentSchools = await School.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name lga status createdAt')
      .lean();

    const recentBeggars = await Beggar.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name lga isBegging createdAt')
      .lean();

    // Get status breakdown
    const schoolStatusBreakdown = await School.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const beggarStatusBreakdown = await Beggar.aggregate([
      { $group: { _id: '$isBegging', count: { $sum: 1 } } },
    ]);

    // Get top LGAs
    const topLgas = await School.aggregate([
      { $group: { _id: '$lga', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        overview: {
          totalSchools,
          totalBeggars,
          totalUsers,
          totalStudents: totalStudents[0]?.total || 0,
        },
        recentActivity: {
          schools: recentSchools,
          beggars: recentBeggars,
        },
        breakdowns: {
          schoolStatus: schoolStatusBreakdown,
          beggarStatus: beggarStatusBreakdown,
        },
        topLgas,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getInterviewerStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewerId } = req.params;

    // Get interviewer's schools
    const schools = await School.find({ interviewerId });
    const totalSchools = schools.length;
    const publishedSchools = schools.filter(s => s.status === 'PUBLISHED').length;
    const draftSchools = schools.filter(s => s.status === 'DRAFT').length;

    // Get total students
    const totalStudents = schools.reduce((sum, school) => sum + school.students.length, 0);
    const beggingStudents = schools.reduce((sum, school) => 
      sum + school.students.filter(s => s.isBegging).length, 0
    );

    // Get interviewer's beggars
    const beggars = await Beggar.find({ interviewerId });
    const totalBeggars = beggars.length;
    const activeBeggars = beggars.filter(b => b.isBegging).length;

    // Get recent activity
    const recentSchools = await School.find({ interviewerId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name status createdAt')
      .lean();

    const recentBeggars = await Beggar.find({ interviewerId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name isBegging createdAt')
      .lean();

    const response: ApiResponse = {
      success: true,
      message: 'Interviewer statistics retrieved successfully',
      data: {
        schools: {
          total: totalSchools,
          published: publishedSchools,
          draft: draftSchools,
          completionRate: totalSchools > 0 ? ((publishedSchools / totalSchools) * 100).toFixed(2) : 0,
        },
        students: {
          total: totalStudents,
          begging: beggingStudents,
          beggingPercentage: totalStudents > 0 ? ((beggingStudents / totalStudents) * 100).toFixed(2) : 0,
        },
        beggars: {
          total: totalBeggars,
          active: activeBeggars,
          activePercentage: totalBeggars > 0 ? ((activeBeggars / totalBeggars) * 100).toFixed(2) : 0,
        },
        recentActivity: {
          schools: recentSchools,
          beggars: recentBeggars,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get interviewer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 