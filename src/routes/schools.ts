import express from 'express';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByInterviewer,
  getAllStudentsBySchools,
} from '../controllers/schools';
import {
  createSchoolSchema,
  updateSchoolSchema,
  getSchoolSchema,
  deleteSchoolSchema,
  getSchoolsSchema,
  getAllStudentsBySchoolsSchema,
} from '../validations/schools';

const router = express.Router();

// Debug endpoint for student validation testing
router.post('/debug/validate-student', (req, res) => {
  try {
    const { student } = req.body;
    
    if (!student) {
      res.status(400).json({
        success: false,
        message: 'Student object is required',
        errors: ['Please provide a student object in the request body']
      });
      return;
    }

    // Manual validation checks
    const errors: string[] = [];
    const validationDetails: any = {};

    // Check required fields
    if (!student.name || student.name.length < 2 || student.name.length > 100) {
      errors.push('name: Must be 2-100 characters');
    }
    validationDetails.name = { 
      valid: !errors.some(e => e.includes('name')), 
      value: student.name, 
      length: student.name?.length 
    };

    // Check age
    const age = typeof student.age === 'string' ? parseInt(student.age) : student.age;
    if (typeof age !== 'number' || isNaN(age) || age < 0 || age > 25) {
      errors.push('age: Must be a number between 0-25');
    }
    validationDetails.age = { 
      valid: !errors.some(e => e.includes('age')), 
      value: student.age, 
      parsedValue: age 
    };

    // Check gender
    const gender = student.gender?.toUpperCase();
    if (!['MALE', 'FEMALE'].includes(gender)) {
      errors.push('gender: Must be MALE or FEMALE');
    }
    validationDetails.gender = { 
      valid: !errors.some(e => e.includes('gender')), 
      value: student.gender, 
      normalized: gender 
    };

    // Check address
    if (!student.permanentHomeAddress || student.permanentHomeAddress.length < 5 || student.permanentHomeAddress.length > 500) {
      errors.push('permanentHomeAddress: Must be 5-500 characters');
    }
    validationDetails.permanentHomeAddress = { 
      valid: !errors.some(e => e.includes('permanentHomeAddress')), 
      value: student.permanentHomeAddress, 
      length: student.permanentHomeAddress?.length 
    };

    // Check required string fields
    const requiredStrings = ['nationality', 'state', 'lga', 'townVillage'];
    requiredStrings.forEach(field => {
      if (!student[field] || student[field].trim().length === 0) {
        errors.push(`${field}: Must be a non-empty string`);
      }
      validationDetails[field] = { 
        valid: !errors.some(e => e.includes(field)), 
        value: student[field] 
      };
    });

    // Check phone number
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!student.fathersContactNumber || !phoneRegex.test(student.fathersContactNumber)) {
      errors.push('fathersContactNumber: Must be a valid Nigerian phone number (+234XXXXXXXXX or 0XXXXXXXXX)');
    }
    validationDetails.fathersContactNumber = { 
      valid: !errors.some(e => e.includes('fathersContactNumber')), 
      value: student.fathersContactNumber,
      format: 'Nigerian phone format'
    };

    if (errors.length === 0) {
      res.json({
        success: true,
        message: 'Student validation passed',
        data: {
          original: student,
          validationDetails,
          requiredFields: {
            name: !!student.name,
            age: typeof age === 'number',
            gender: ['MALE', 'FEMALE'].includes(gender),
            address: !!student.permanentHomeAddress,
            nationality: !!student.nationality,
            state: !!student.state,
            lga: !!student.lga,
            townVillage: !!student.townVillage,
            phone: !!student.fathersContactNumber
          }
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Student validation failed',
        errors,
        validationDetails,
        debug: {
          originalData: student,
          validationRules: {
            name: 'string, 2-100 characters',
            age: 'number 0-25 (or string that converts to number)',
            gender: 'MALE or FEMALE (case-insensitive)',
            permanentHomeAddress: 'string, 5-500 characters',
            nationality: 'non-empty string',
            state: 'non-empty string',
            lga: 'non-empty string',
            townVillage: 'non-empty string',
            fathersContactNumber: 'Nigerian phone format (+234XXXXXXXXX or 0XXXXXXXXX)',
            isBegging: 'boolean (defaults to false)'
          }
        }
      });
    }
  } catch (error: any) {
    console.error('Debug validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message
    });
  }
});

// Regular routes
router.get('/', validate(getSchoolsSchema), getAllSchools);
router.get('/my-schools', authenticateToken, getSchoolsByInterviewer);
router.get('/students', validate(getAllStudentsBySchoolsSchema), getAllStudentsBySchools);
router.get('/:id', validate(getSchoolSchema), getSchoolById);
router.post('/', authenticateToken, validate(createSchoolSchema), createSchool);
router.put('/:id', authenticateToken, validate(updateSchoolSchema), updateSchool);
router.delete('/:id', authenticateToken, validate(deleteSchoolSchema), deleteSchool);

export default router; 