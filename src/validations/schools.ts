import { z } from 'zod';

// Head Teacher validation - Updated to match frontend requirements
const headTeacherSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).trim(),
  nationality: z.string().min(1).trim(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),
  numberOfWives: z.number().min(0).max(10),
  age: z.number().min(18).max(120),
  educationLevel: z.enum(['EARLY_CHILDHOOD', 'PRIMARY', 'LOWER_SECONDARY', 'UPPER_SECONDARY', 'HIGHER', 'QURANIC', 'OTHER']),
  otherEducation: z.string().nullable().optional(),
  numberOfChildren: z.number().min(0).max(50),
  sourcesOfIncome: z.array(z.string()).min(1), // At least one source required
  otherIncome: z.string().nullable().optional(),
  monthlyIncome: z.number().min(0),
  alarammaCode: z.string().nullable().optional(),
  yearsTutoring: z.number().min(0).max(100).nullable().optional(),
  picture: z.string().url().nullable().optional(), // Changed from pictureUrl to picture
});

// School Structure validation - Updated to match frontend requirements
const schoolStructureSchema = z.object({
  hasClasses: z.boolean(),
  numberOfClasses: z.number().min(0).max(100).nullable().optional(),
  studentsPerClass: z.number().min(0).max(100).nullable().optional(),
  numberOfTeachers: z.number().min(0).max(1000),
  numberOfPupils: z.number().min(0).max(10000),
  hasIntervention: z.boolean(),
  interventionType: z.string().nullable().optional(),
  hasToilets: z.boolean(),
  numberOfToilets: z.number().min(0).max(100).nullable().optional(),
  toiletPicture: z.string().url().nullable().optional(), // Changed from toiletPictureUrl to toiletPicture
  feedsPupils: z.boolean(),
  foodSources: z.array(z.string()).min(1), // At least one source required
  otherFoodSource: z.string().nullable().optional(),
  takesCareOfMedicalBills: z.boolean(),
  medicalFundsSource: z.string().nullable().optional(),
  medicalCareProvider: z.string().nullable().optional(),
  sanitaryCareProvider: z.string().min(1).trim(),
  lostPupilAction: z.string().min(1).trim(),
  studyTime: z.string().min(1).trim(),
  studyTimes: z.array(z.string()).min(1), // At least one study time required
  providesSleepingPlace: z.boolean(),
  sleepingPlaceLocation: z.string().nullable().optional(),
  sleepingPlacePicture: z.string().url().nullable().optional(), // Changed from sleepingPlacePictureUrl to sleepingPlacePicture
  hasOtherStatePupils: z.boolean(),
  otherStatesCountries: z.string().nullable().optional(),
  hasParentAgreements: z.boolean(),
  agreementType: z.enum(['WRITTEN', 'VERBAL']).nullable().optional(),
  allowsBegging: z.boolean(),
  beggingReason: z.string().nullable().optional(),
  alarammaTeachesMultipleGroups: z.boolean().nullable().optional(),
  hasCashTransferBeneficiaries: z.boolean().nullable().optional(),
  numberOfCashTransferBeneficiaries: z.number().min(0).max(1000).nullable().optional(),
  infrastructurePictures: z.array(z.string()).default([]),
  medicalCareSource: z.string().nullable().optional(),
  sanitaryCareSource: z.string().nullable().optional(),
  accessibility: z.enum(['ALL_SEASONS', 'DRY_SEASON', 'RAINY_SEASON']).nullable().optional(),
  hasManagementCommittee: z.boolean().nullable().optional(),
  hasDevelopmentPlan: z.boolean().nullable().optional(),
  hasSecurityGuard: z.boolean().nullable().optional(),
  ownershipType: z.enum(['COMMUNITY', 'INDIVIDUAL', 'OTHER']).nullable().optional(),
  ownershipOther: z.string().nullable().optional(),
  studyPeriods: z.object({
    morning: z.string().nullable().optional(),
    evening: z.string().nullable().optional(),
    night: z.string().nullable().optional(),
  }).nullable().optional(),
  hasCrossBorderStudents: z.boolean().nullable().optional(),
  crossBorderStatesCountries: z.string().nullable().optional(),
  parentAgreementType: z.enum(['WRITTEN', 'VERBAL']).nullable().optional(),
  allowsBeggingWithConsent: z.boolean().nullable().optional(),
  beggingConsentReason: z.string().nullable().optional(),
});

// Student validation - Updated to match frontend requirements
const studentSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  age: z.union([
    z.number().min(0).max(25),
    z.string().transform((val) => {
      const num = parseInt(val);
      if (isNaN(num)) throw new Error('Age must be a valid number');
      return num;
    }).pipe(z.number().min(0).max(25))
  ]),
  gender: z.enum(['MALE', 'FEMALE'])
    .transform(val => val?.toUpperCase())
    .refine((val) => val && ['MALE', 'FEMALE'].includes(val), {
      message: 'Gender must be MALE or FEMALE (received undefined or invalid value)'
    }),
  permanentHomeAddress: z.string().min(5).max(500).trim(),
  nationality: z.string().min(1).trim(),
  state: z.string().min(1).trim(),
  lga: z.string().min(1).trim(),
  townVillage: z.string().min(1).trim(),
  fathersContactNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).trim(),
  isBegging: z.boolean(),
  parentName: z.string().min(1).trim(), // Made required
  parentPhone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).trim(), // Made required
  parentOccupation: z.string().min(1).trim(), // Made required
  familyIncome: z.union([
    z.number().min(0),
    z.string().transform((val) => {
      if (!val || val === '') throw new Error('Family income is required');
      const num = parseInt(val);
      if (isNaN(num)) throw new Error('Family income must be a valid number');
      return num;
    }).pipe(z.number().min(0))
  ]),
  enrollmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format required
  attendanceRate: z.union([
    z.number().min(0).max(100),
    z.string().transform((val) => {
      if (!val || val === '') throw new Error('Attendance rate is required');
      const num = parseInt(val);
      if (isNaN(num)) throw new Error('Attendance rate must be a valid number');
      return num;
    }).pipe(z.number().min(0).max(100))
  ]),
  academicPerformance: z.enum(['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR']),
  hasSpecialNeeds: z.boolean(),
  receivesScholarship: z.boolean(),
  healthStatus: z.enum(['GOOD', 'FAIR', 'POOR']),
  nin: z.string().nullable().optional(),
  picture: z.string().url().nullable().optional(), // Changed from pictureUrl to picture
  // Optional fields that were in the original schema but not in frontend spec
  specialNeedsType: z.string().nullable().optional(),
  scholarshipType: z.string().nullable().optional(),
});

// Main school validation schemas - Updated to match frontend requirements
export const createSchoolSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).trim(),
    schoolCode: z.string().min(1).trim(),
    address: z.string().min(5).max(500).trim(),
    phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).trim(),
    email: z.string().email().nullable().optional(),
    lga: z.string().min(1).trim(),
    district: z.string().min(1).trim(),
    ward: z.string().min(1).trim(),
    village: z.string().nullable().optional(),
    community: z.string().nullable().optional(),
    yearsInSchool: z.union([
      z.number().min(0).max(100),
      z.string().transform((val) => {
        const num = parseInt(val);
        if (isNaN(num)) throw new Error('Years in school must be a valid number');
        return num;
      }).pipe(z.number().min(0).max(100))
    ]),
    headTeacher: headTeacherSchema, // Made required
    schoolStructure: schoolStructureSchema, // Made required
    students: z.array(studentSchema).min(1), // At least one student required
  }),
});

export const updateSchoolSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(2).max(200).trim().optional(),
    schoolCode: z.string().min(1).trim().optional(),
    address: z.string().min(5).max(500).trim().optional(),
    phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).trim().optional(),
    email: z.string().email().nullable().optional(),
    lga: z.string().min(1).trim().optional(),
    district: z.string().min(1).trim().optional(),
    ward: z.string().min(1).trim().optional(),
    village: z.string().nullable().optional(),
    community: z.string().nullable().optional(),
    yearsInSchool: z.union([
      z.number().min(0).max(100),
      z.string().transform((val) => {
        const num = parseInt(val);
        if (isNaN(num)) throw new Error('Years in school must be a valid number');
        return num;
      }).pipe(z.number().min(0).max(100))
    ]).optional(),
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