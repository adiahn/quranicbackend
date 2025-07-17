import { Request } from 'express';

// User types
export interface IUser {
  _id?: string;
  interviewerId: string;
  name: string;
  email?: string;
  phone?: string;
  lga: string;
  role: 'INTERVIEWER' | 'SUPERVISOR' | 'ADMIN';
  passwordHash?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Head Teacher types
export interface IHeadTeacher {
  name: string;
  phone: string;
  nationality: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  numberOfWives: number;
  age: number;
  educationLevel: 'EARLY_CHILDHOOD' | 'PRIMARY' | 'LOWER_SECONDARY' | 'UPPER_SECONDARY' | 'HIGHER' | 'QURANIC' | 'OTHER';
  otherEducation?: string;
  numberOfChildren: number;
  sourcesOfIncome: string[];
  otherIncome?: string;
  monthlyIncome: number;
  picture?: string;
  alarammaCode?: string;
  yearsTutoring?: number;
}

// School Structure types
export interface ISchoolStructure {
  hasClasses: boolean;
  numberOfClasses?: number;
  studentsPerClass?: number;
  numberOfTeachers: number;
  numberOfPupils: number;
  hasIntervention: boolean;
  interventionType?: string;
  hasToilets: boolean;
  numberOfToilets?: number;
  toiletPicture?: string;
  feedsPupils: boolean;
  foodSources: string[];
  otherFoodSource?: string;
  takesCareOfMedicalBills: boolean;
  medicalFundsSource?: string;
  medicalCareProvider?: string;
  sanitaryCareProvider: string;
  lostPupilAction: string;
  studyTime: string;
  studyTimes: string[];
  providesSleepingPlace: boolean;
  sleepingPlaceLocation?: string;
  sleepingPlacePicture?: string;
  hasOtherStatePupils: boolean;
  otherStatesCountries?: string;
  hasParentAgreements: boolean;
  agreementType?: 'WRITTEN' | 'VERBAL';
  allowsBegging: boolean;
  beggingReason?: string;
  alarammaTeachesMultipleGroups?: boolean;
  hasCashTransferBeneficiaries?: boolean;
  numberOfCashTransferBeneficiaries?: number;
  infrastructurePictures?: string[];
  medicalCareSource?: string;
  sanitaryCareSource?: string;
  accessibility?: 'ALL_SEASONS' | 'DRY_SEASON' | 'RAINY_SEASON';
  hasManagementCommittee?: boolean;
  hasDevelopmentPlan?: boolean;
  hasSecurityGuard?: boolean;
  ownershipType?: 'COMMUNITY' | 'INDIVIDUAL' | 'OTHER';
  ownershipOther?: string;
  studyPeriods?: {
    morning?: string;
    evening?: string;
    night?: string;
  };
  hasCrossBorderStudents?: boolean;
  crossBorderStatesCountries?: string;
  parentAgreementType?: 'WRITTEN' | 'VERBAL';
  allowsBeggingWithConsent?: boolean;
  beggingConsentReason?: string;
}

// Student types
export interface IStudent {
  _id?: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  permanentHomeAddress: string;
  nationality: string;
  state: string;
  lga: string;
  townVillage: string;
  fathersContactNumber: string;
  isBegging: boolean;
  parentName: string;
  parentPhone: string;
  parentOccupation: string;
  familyIncome: number;
  enrollmentDate: string;
  attendanceRate: number;
  academicPerformance: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  hasSpecialNeeds: boolean;
  receivesScholarship: boolean;
  healthStatus: 'GOOD' | 'FAIR' | 'POOR';
  nin?: string;
  picture?: string;
  specialNeedsType?: string;
  scholarshipType?: string;
}

// School types
export interface ISchool {
  _id?: string;
  schoolCode: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  lga: string;
  district: string;
  ward: string;
  village?: string;
  community?: string;
  yearsInSchool?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'INCOMPLETE';
  interviewerId: string;
  headTeacher?: IHeadTeacher;
  schoolStructure?: ISchoolStructure;
  students: IStudent[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Beggar types
export interface IBeggar {
  _id?: string;
  beggarId: string;
  name: string;
  age: number;
  sex: 'MALE' | 'FEMALE';
  nationality: string;
  stateOfOrigin: string;
  lga: string;
  townVillage: string;
  permanentHomeAddress: string;
  fathersContactNumber?: string;
  contactNumber?: string;
  isBegging: boolean;
  reasonForBegging?: string;
  nin?: string;
  pictureUrl?: string;
  interviewerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Draft types
export interface IDraft {
  _id?: string;
  draftId: string;
  type: 'SCHOOL' | 'BEGGAR';
  data: any;
  interviewerId: string;
  lastSaved: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// File types
export interface IFile {
  _id?: string;
  fileId: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: string;
  relatedTo?: {
    type: 'SCHOOL' | 'BEGGAR' | 'USER';
    id: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Authentication types
export interface AuthRequest extends Request {
  user?: IUser;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} 