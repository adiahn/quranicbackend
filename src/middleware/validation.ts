import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Enhanced debugging for student validation
      if (req.body.students && Array.isArray(req.body.students)) {
        console.log('🔍 Validating students array with', req.body.students.length, 'students');
        req.body.students.forEach((student: any, index: number) => {
          console.log(`📝 Student ${index + 1}:`, {
            name: student.name,
            age: student.age,
            gender: student.gender,
            phone: student.fathersContactNumber,
            hasRequiredFields: {
              name: !!student.name,
              age: typeof student.age === 'number',
              gender: ['MALE', 'FEMALE'].includes(student.gender),
              address: !!student.permanentHomeAddress,
              nationality: !!student.nationality,
              state: !!student.state,
              lga: !!student.lga,
              townVillage: !!student.townVillage,
              phone: !!student.fathersContactNumber
            }
          });
        });
      }

      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('❌ Validation errors:', error.errors);
        
        // Enhanced error messages for student validation
        const errors = error.errors.map(err => {
          const path = err.path.join('.');
          let message = err.message;
          
          // Provide more helpful error messages for common student validation issues
          if (path.includes('students') && path.includes('age')) {
            message = `Student age must be between 0 and 25 years. Received: ${(err as any).received || 'invalid value'}`;
          } else if (path.includes('students') && path.includes('gender')) {
            message = `Student gender must be exactly 'MALE' or 'FEMALE'. Received: ${(err as any).received || 'invalid value'}`;
          } else if (path.includes('students') && path.includes('fathersContactNumber')) {
            message = `Student phone number must be a valid Nigerian number (format: +234XXXXXXXXX or 0XXXXXXXXX). Received: ${(err as any).received || 'invalid value'}`;
          } else if (path.includes('students') && path.includes('name')) {
            message = `Student name must be between 2 and 100 characters. Received: ${(err as any).received || 'invalid value'}`;
          } else if (path.includes('students') && path.includes('permanentHomeAddress')) {
            message = `Student address must be between 5 and 500 characters. Received: ${(err as any).received || 'invalid value'}`;
          }
          
          return `${path}: ${message}`;
        });

        console.error('🚨 Validation failed with errors:', errors);
        
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
          debug: {
            endpoint: req.path,
            method: req.method,
            bodyKeys: Object.keys(req.body),
            hasStudents: !!req.body.students,
            studentsCount: req.body.students ? req.body.students.length : 0
          }
        });
        return;
      }
      // If it's not a ZodError, pass it to the next error handler
      next(error);
    }
  };
}; 