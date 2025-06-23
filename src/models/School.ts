import mongoose, { Document, Schema } from 'mongoose';
import { IHeadTeacher, ISchool, ISchoolStructure, IStudent } from '../types';

export interface ISchoolDocument extends Omit<ISchool, '_id'>, Document {}

// Head Teacher Schema
const headTeacherSchema = new Schema<IHeadTeacher>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^(\+234|0)[789][01]\d{8}$/,
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
  },
  maritalStatus: {
    type: String,
    enum: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'],
    required: true,
  },
  numberOfWives: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 120,
  },
  educationLevel: {
    type: String,
    enum: ['EARLY_CHILDHOOD', 'PRIMARY', 'LOWER_SECONDARY', 'UPPER_SECONDARY', 'HIGHER', 'QURANIC', 'OTHER'],
    required: true,
  },
  otherEducation: {
    type: String,
    trim: true,
  },
  numberOfChildren: {
    type: Number,
    default: 0,
    min: 0,
    max: 50,
  },
  sourcesOfIncome: {
    type: [String],
    default: [],
  },
  otherIncome: {
    type: String,
    trim: true,
  },
  monthlyIncome: {
    type: Number,
    required: true,
    min: 0,
  },
  pictureUrl: {
    type: String,
  },
}, { _id: false });

// School Structure Schema
const schoolStructureSchema = new Schema<ISchoolStructure>({
  hasClasses: {
    type: Boolean,
    default: false,
  },
  numberOfClasses: {
    type: Number,
    min: 0,
    max: 100,
  },
  studentsPerClass: {
    type: Number,
    min: 0,
    max: 100,
  },
  numberOfTeachers: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  numberOfPupils: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  hasIntervention: {
    type: Boolean,
    default: false,
  },
  interventionType: {
    type: String,
    trim: true,
  },
  hasToilets: {
    type: Boolean,
    default: false,
  },
  numberOfToilets: {
    type: Number,
    min: 0,
    max: 100,
  },
  toiletPictureUrl: {
    type: String,
  },
  feedsPupils: {
    type: Boolean,
    default: false,
  },
  foodSources: {
    type: [String],
    default: [],
  },
  otherFoodSource: {
    type: String,
    trim: true,
  },
  takesCareOfMedicalBills: {
    type: Boolean,
    default: false,
  },
  medicalFundsSource: {
    type: String,
    trim: true,
  },
  medicalCareProvider: {
    type: String,
    trim: true,
  },
  sanitaryCareProvider: {
    type: String,
    required: true,
    trim: true,
  },
  lostPupilAction: {
    type: String,
    required: true,
    trim: true,
  },
  studyTime: {
    type: String,
    required: true,
    trim: true,
  },
  studyTimes: {
    type: [String],
    default: [],
  },
  providesSleepingPlace: {
    type: Boolean,
    default: false,
  },
  sleepingPlaceLocation: {
    type: String,
    trim: true,
  },
  sleepingPlacePictureUrl: {
    type: String,
  },
  hasOtherStatePupils: {
    type: Boolean,
    default: false,
  },
  otherStatesCountries: {
    type: String,
    trim: true,
  },
  hasParentAgreements: {
    type: Boolean,
    default: false,
  },
  agreementType: {
    type: String,
    enum: ['WRITTEN', 'VERBAL'],
  },
  allowsBegging: {
    type: Boolean,
    default: false,
  },
  beggingReason: {
    type: String,
    trim: true,
  },
}, { _id: false });

// Student Schema
const studentSchema = new Schema<IStudent>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 25,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    required: true,
  },
  permanentHomeAddress: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 500,
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  lga: {
    type: String,
    required: true,
    trim: true,
  },
  townVillage: {
    type: String,
    required: true,
    trim: true,
  },
  fathersContactNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^(\+234|0)[789][01]\d{8}$/,
  },
  isBegging: {
    type: Boolean,
    default: false,
  },
  nin: {
    type: String,
    trim: true,
  },
  pictureUrl: {
    type: String,
  },
  parentName: {
    type: String,
    trim: true,
  },
  parentPhone: {
    type: String,
    trim: true,
    match: /^(\+234|0)[789][01]\d{8}$/,
  },
  parentOccupation: {
    type: String,
    trim: true,
  },
  familyIncome: {
    type: Number,
    min: 0,
  },
  enrollmentDate: {
    type: Date,
  },
  attendanceRate: {
    type: Number,
    min: 0,
    max: 100,
  },
  academicPerformance: {
    type: String,
    enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE'],
  },
  hasSpecialNeeds: {
    type: Boolean,
    default: false,
  },
  specialNeedsType: {
    type: String,
    trim: true,
  },
  receivesScholarship: {
    type: Boolean,
    default: false,
  },
  scholarshipType: {
    type: String,
    trim: true,
  },
  healthStatus: {
    type: String,
    enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'],
  },
}, { _id: true });

// Main School Schema
const schoolSchema = new Schema<ISchoolDocument>({
  schoolCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 500,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^(\+234|0)[789][01]\d{8}$/,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  lga: {
    type: String,
    required: true,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  ward: {
    type: String,
    required: true,
    trim: true,
  },
  village: {
    type: String,
    trim: true,
  },
  community: {
    type: String,
    trim: true,
  },
  yearsInSchool: {
    type: Number,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'INCOMPLETE'],
    default: 'DRAFT',
  },
  interviewerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  headTeacher: headTeacherSchema,
  schoolStructure: schoolStructureSchema,
  students: [studentSchema],
}, {
  timestamps: true,
});

// Indexes
schoolSchema.index({ interviewerId: 1 });
schoolSchema.index({ lga: 1 });
schoolSchema.index({ status: 1 });
schoolSchema.index({ name: 'text', address: 'text' });

export const School = mongoose.model<ISchoolDocument>('School', schoolSchema); 