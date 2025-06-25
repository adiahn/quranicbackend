import { z } from 'zod';

// Head Teacher validation
const headTeacherSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/),
  nationality: z.string().min(1),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),
  numberOfWives: z.number().min(0).max(10).default(0),
  age: z.number().min(18).max(120),
  educationLevel: z.enum(['EARLY_CHILDHOOD', 'PRIMARY', 'LOWER_SECONDARY', 'UPPER_SECONDARY', 'HIGHER', 'QURANIC', 'OTHER']),
  otherEducation: z.string().optional(),
  numberOfChildren: z.number().min(0).max(50).default(0),
  sourcesOfIncome: z.array(z.string()).default([]),
  otherIncome: z.string().optional(),
  monthlyIncome: z.number().min(0),
  pictureUrl: z.string().url().optional(),
});

// School Structure validation
const schoolStructureSchema = z.object({
  hasClasses: z.boolean().default(false),
  numberOfClasses: z.number().min(0).max(100).optional(),
  studentsPerClass: z.number().min(0).max(100).optional(),
  numberOfTeachers: z.number().min(0).max(1000),
  numberOfPupils: z.number().min(0).max(10000),
  hasIntervention: z.boolean().default(false),
  interventionType: z.string().optional(),
  hasToilets: z.boolean().default(false),
  numberOfToilets: z.number().min(0).max(100).optional(),
  toiletPictureUrl: z.string().url().optional(),
  feedsPupils: z.boolean().default(false),
  foodSources: z.array(z.string()).default([]),
  otherFoodSource: z.string().optional(),
  takesCareOfMedicalBills: z.boolean().default(false),
  medicalFundsSource: z.string().optional(),
  medicalCareProvider: z.string().optional(),
  sanitaryCareProvider: z.string().min(1),
  lostPupilAction: z.string().min(1),
  studyTime: z.string().min(1),
  studyTimes: z.array(z.string()).default([]),
  providesSleepingPlace: z.boolean().default(false),
  sleepingPlaceLocation: z.string().optional(),
  sleepingPlacePictureUrl: z.string().url().optional(),
  hasOtherStatePupils: z.boolean().default(false),
  otherStatesCountries: z.string().optional(),
  hasParentAgreements: z.boolean().default(false),
  agreementType: z.enum(['WRITTEN', 'VERBAL']).optional(),
  allowsBegging: z.boolean().default(false),
  beggingReason: z.string().optional(),
});

// Student validation
const studentSchema = z.object({
  name: z.string().min(2).max(100),
  age: z.number().min(0).max(25),
  gender: z.enum(['MALE', 'FEMALE']),
  permanentHomeAddress: z.string().min(5).max(500),
  nationality: z.string().min(1),
  state: z.string().min(1),
  lga: z.string().min(1),
  townVillage: z.string().min(1),
  fathersContactNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/),
  isBegging: z.boolean().default(false),
  nin: z.string().optional(),
  pictureUrl: z.string().url().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).optional(),
  parentOccupation: z.string().optional(),
  familyIncome: z.number().min(0).optional(),
  enrollmentDate: z.string().transform((val) => new Date(val)).optional(),
  attendanceRate: z.number().min(0).max(100).optional(),
  academicPerformance: z.enum(['EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE']).optional(),
  hasSpecialNeeds: z.boolean().default(false),
  specialNeedsType: z.string().optional(),
  receivesScholarship: z.boolean().default(false),
  scholarshipType: z.string().optional(),
  healthStatus: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']).optional(),
});

// Main school validation schemas
export const createSchoolSchema = z.object({
  body: z.object({
    schoolCode: z.string().min(1),
    name: z.string().min(2).max(200),
    address: z.string().min(5).max(500),
    phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/),
    email: z.string().email().optional(),
    lga: z.string().min(1),
    district: z.string().min(1),
    ward: z.string().min(1),
    village: z.string().optional(),
    community: z.string().optional(),
    yearsInSchool: z.number().min(0).max(100).optional(),
    headTeacher: headTeacherSchema.optional(),
    schoolStructure: schoolStructureSchema.optional(),
    students: z.array(studentSchema).default([]),
  }),
});

export const updateSchoolSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    schoolCode: z.string().min(1).optional(),
    name: z.string().min(2).max(200).optional(),
    address: z.string().min(5).max(500).optional(),
    phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).optional(),
    email: z.string().email().optional(),
    lga: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    ward: z.string().min(1).optional(),
    village: z.string().optional(),
    community: z.string().optional(),
    yearsInSchool: z.number().min(0).max(100).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'INCOMPLETE']).optional(),
    headTeacher: headTeacherSchema.optional(),
    schoolStructure: schoolStructureSchema.optional(),
    students: z.array(studentSchema).optional(),
  }),
});

export const getSchoolSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const deleteSchoolSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getSchoolsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    search: z.string().optional(),
    lga: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'INCOMPLETE']).optional(),
    interviewerId: z.string().optional(),
  }),
});

export const getAllStudentsBySchoolsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    search: z.string().optional(),
    lga: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'INCOMPLETE']).optional(),
    schoolId: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    isBegging: z.string().transform(val => val === 'true').optional(),
    ageRange: z.string().optional(),
  }),
}); 