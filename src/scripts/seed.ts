import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Beggar } from '../models/Beggar';
import { School } from '../models/School';
import { User } from '../models/User';

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://admin:admin123@cluster0.tbfk6vr.mongodb.net/quranic_schools_db?retryWrites=true&w=majority&appName=Cluster0';

const seedData = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB Atlas for seeding');

    // Clear existing data
    await User.deleteMany({});
    await School.deleteMany({});
    await Beggar.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await User.create([
      {
        interviewerId: 'INT001',
        name: 'Ahmed Musa',
        email: 'ahmed.musa@example.com',
        phone: '+2348012345678',
        lga: 'Katsina',
        role: 'INTERVIEWER',
        passwordHash: hashedPassword,
        isActive: true,
      },
      {
        interviewerId: 'INT002',
        name: 'Fatima Hassan',
        email: 'fatima.hassan@example.com',
        phone: '+2348023456789',
        lga: 'Daura',
        role: 'INTERVIEWER',
        passwordHash: hashedPassword,
        isActive: true,
      },
      {
        interviewerId: 'SUP001',
        name: 'Muhammad Bello',
        email: 'muhammad.bello@example.com',
        phone: '+2348034567890',
        lga: 'Katsina',
        role: 'SUPERVISOR',
        passwordHash: hashedPassword,
        isActive: true,
      },
      {
        interviewerId: 'ADM001',
        name: 'Admin User',
        email: 'admin@quranicschools.com',
        phone: '+2348045678901',
        lga: 'Katsina',
        role: 'ADMIN',
        passwordHash: hashedPassword,
        isActive: true,
      },
    ]);

    console.log('Created users:', users.length);

    // Create sample schools
    const schools = await School.create([
      {
        schoolCode: 'SCH001',
        name: 'Al-Huda Quranic School',
        address: '123 Main Street, Katsina',
        phone: '+2348056789012',
        email: 'alhuda@example.com',
        lga: 'Katsina',
        district: 'Katsina Central',
        ward: 'Ward A',
        village: 'Katsina Village',
        community: 'Muslim Community',
        yearsInSchool: 15,
        status: 'PUBLISHED',
        interviewerId: 'INT001',
        headTeacher: {
          name: 'Mallam Ibrahim',
          phone: '+2348067890123',
          nationality: 'Nigerian',
          maritalStatus: 'MARRIED',
          numberOfWives: 2,
          age: 45,
          educationLevel: 'QURANIC',
          numberOfChildren: 8,
          sourcesOfIncome: ['TEACHING', 'FARMING'],
          monthlyIncome: 50000,
        },
        schoolStructure: {
          hasClasses: true,
          numberOfClasses: 5,
          studentsPerClass: 20,
          numberOfTeachers: 3,
          numberOfPupils: 100,
          hasIntervention: true,
          interventionType: 'Government Support',
          hasToilets: true,
          numberOfToilets: 3,
          feedsPupils: true,
          foodSources: ['PARENTS', 'DONATIONS'],
          takesCareOfMedicalBills: false,
          sanitaryCareProvider: 'Parents',
          lostPupilAction: 'Contact Parents',
          studyTime: 'MORNING_AND_EVENING',
          studyTimes: ['06:00-12:00', '16:00-20:00'],
          providesSleepingPlace: true,
          sleepingPlaceLocation: 'School Compound',
          hasOtherStatePupils: true,
          otherStatesCountries: 'Kano, Kaduna',
          hasParentAgreements: true,
          agreementType: 'VERBAL',
          allowsBegging: false,
        },
        students: [
          {
            name: 'Aisha Ibrahim',
            age: 12,
            gender: 'FEMALE',
            permanentHomeAddress: '456 Home Street, Katsina',
            nationality: 'Nigerian',
            state: 'Katsina',
            lga: 'Katsina',
            townVillage: 'Katsina',
            fathersContactNumber: '+2348078901234',
            isBegging: false,
            parentName: 'Ibrahim Musa',
            parentPhone: '+2348078901234',
            parentOccupation: 'Farmer',
            familyIncome: 30000,
            enrollmentDate: new Date('2020-09-01'),
            attendanceRate: 95,
            academicPerformance: 'EXCELLENT',
            healthStatus: 'GOOD',
          },
          {
            name: 'Hassan Ali',
            age: 10,
            gender: 'MALE',
            permanentHomeAddress: '789 Village Road, Katsina',
            nationality: 'Nigerian',
            state: 'Katsina',
            lga: 'Katsina',
            townVillage: 'Katsina',
            fathersContactNumber: '+2348089012345',
            isBegging: false,
            parentName: 'Ali Hassan',
            parentPhone: '+2348089012345',
            parentOccupation: 'Trader',
            familyIncome: 25000,
            enrollmentDate: new Date('2021-01-15'),
            attendanceRate: 88,
            academicPerformance: 'GOOD',
            healthStatus: 'GOOD',
          },
        ],
      },
      {
        schoolCode: 'SCH002',
        name: 'Nurul Islam Academy',
        address: '456 Islamic Street, Daura',
        phone: '+2348090123456',
        lga: 'Daura',
        district: 'Daura Central',
        ward: 'Ward B',
        village: 'Daura Village',
        community: 'Islamic Community',
        yearsInSchool: 8,
        status: 'DRAFT',
        interviewerId: 'INT002',
        headTeacher: {
          name: 'Mallam Yusuf',
          phone: '+2348091234567',
          nationality: 'Nigerian',
          maritalStatus: 'MARRIED',
          numberOfWives: 1,
          age: 38,
          educationLevel: 'QURANIC',
          numberOfChildren: 5,
          sourcesOfIncome: ['TEACHING'],
          monthlyIncome: 35000,
        },
        schoolStructure: {
          hasClasses: true,
          numberOfClasses: 3,
          studentsPerClass: 15,
          numberOfTeachers: 2,
          numberOfPupils: 45,
          hasIntervention: false,
          hasToilets: true,
          numberOfToilets: 2,
          feedsPupils: false,
          takesCareOfMedicalBills: false,
          sanitaryCareProvider: 'Parents',
          lostPupilAction: 'Contact Parents',
          studyTime: 'MORNING_ONLY',
          studyTimes: ['07:00-12:00'],
          providesSleepingPlace: false,
          hasOtherStatePupils: false,
          hasParentAgreements: true,
          agreementType: 'WRITTEN',
          allowsBegging: false,
        },
        students: [
          {
            name: 'Fatima Yusuf',
            age: 9,
            gender: 'FEMALE',
            permanentHomeAddress: '321 Home Avenue, Daura',
            nationality: 'Nigerian',
            state: 'Katsina',
            lga: 'Daura',
            townVillage: 'Daura',
            fathersContactNumber: '+2348092345678',
            isBegging: false,
            parentName: 'Yusuf Ahmed',
            parentPhone: '+2348092345678',
            parentOccupation: 'Teacher',
            familyIncome: 40000,
            enrollmentDate: new Date('2022-03-01'),
            attendanceRate: 92,
            academicPerformance: 'EXCELLENT',
            healthStatus: 'EXCELLENT',
          },
        ],
      },
    ]);

    console.log('Created schools:', schools.length);

    // Create sample beggars
    const beggars = await Beggar.create([
      {
        beggarId: 'BEG001',
        name: 'Aminu Suleiman',
        age: 15,
        sex: 'MALE',
        nationality: 'Nigerian',
        stateOfOrigin: 'Katsina',
        lga: 'Katsina',
        townVillage: 'Katsina',
        permanentHomeAddress: '123 Street, Katsina',
        fathersContactNumber: '+2348093456789',
        isBegging: true,
        reasonForBegging: 'Poverty',
        interviewerId: 'INT001',
      },
      {
        beggarId: 'BEG002',
        name: 'Hauwa Musa',
        age: 12,
        sex: 'FEMALE',
        nationality: 'Nigerian',
        stateOfOrigin: 'Katsina',
        lga: 'Daura',
        townVillage: 'Daura',
        permanentHomeAddress: '456 Avenue, Daura',
        fathersContactNumber: '+2348094567890',
        isBegging: true,
        reasonForBegging: 'Orphan',
        interviewerId: 'INT002',
      },
    ]);

    console.log('Created beggars:', beggars.length);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Schools: ${schools.length}`);
    console.log(`   - Beggars: ${beggars.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

// Run the seed function
seedData(); 