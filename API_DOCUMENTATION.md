# Quranic Schools Backend API Documentation

## 🚀 Overview

This is a comprehensive REST API for managing Quranic schools and street beggar census data in Katsina State, Nigeria. The API provides full CRUD operations, authentication, file uploads, analytics, and role-based access control.

## 🔐 Authentication

All API endpoints (except login and refresh token) require authentication using JWT tokens.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "interviewerId": "INT001",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "interviewerId": "INT001",
      "name": "Ahmed Musa",
      "email": "ahmed.musa@example.com",
      "phone": "+2348012345678",
      "lga": "Katsina",
      "role": "INTERVIEWER",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## 🏫 Schools API

### Get All Schools
```http
GET /api/schools?page=1&limit=10&search=Al-Huda&lga=Katsina&status=PUBLISHED
Authorization: Bearer <access_token>
```

### Get Schools by Interviewer
```http
GET /api/schools/my-schools?page=1&limit=10&status=PUBLISHED
Authorization: Bearer <access_token>
```

### Get School by ID
```http
GET /api/schools/:id
Authorization: Bearer <access_token>
```

### Create School
```http
POST /api/schools
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "schoolCode": "SCH003",
  "name": "New Quranic School",
  "address": "123 Main Street, Katsina",
  "phone": "+2348056789012",
  "email": "newschool@example.com",
  "lga": "Katsina",
  "district": "Katsina Central",
  "ward": "Ward C",
  "village": "Katsina Village",
  "community": "Muslim Community",
  "yearsInSchool": 10,
  "headTeacher": {
    "name": "Mallam Ibrahim",
    "phone": "+2348067890123",
    "nationality": "Nigerian",
    "maritalStatus": "MARRIED",
    "numberOfWives": 2,
    "age": 45,
    "educationLevel": "QURANIC",
    "numberOfChildren": 8,
    "sourcesOfIncome": ["TEACHING", "FARMING"],
    "monthlyIncome": 50000
  },
  "schoolStructure": {
    "hasClasses": true,
    "numberOfClasses": 5,
    "studentsPerClass": 20,
    "numberOfTeachers": 3,
    "numberOfPupils": 100,
    "hasIntervention": true,
    "interventionType": "Government Support",
    "hasToilets": true,
    "numberOfToilets": 3,
    "feedsPupils": true,
    "foodSources": ["PARENTS", "DONATIONS"],
    "takesCareOfMedicalBills": false,
    "sanitaryCareProvider": "Parents",
    "lostPupilAction": "Contact Parents",
    "studyTime": "MORNING_AND_EVENING",
    "studyTimes": ["06:00-12:00", "16:00-20:00"],
    "providesSleepingPlace": true,
    "sleepingPlaceLocation": "School Compound",
    "hasOtherStatePupils": true,
    "otherStatesCountries": "Kano, Kaduna",
    "hasParentAgreements": true,
    "agreementType": "VERBAL",
    "allowsBegging": false
  },
  "students": [
    {
      "name": "Aisha Ibrahim",
      "age": 12,
      "gender": "FEMALE",
      "permanentHomeAddress": "456 Home Street, Katsina",
      "nationality": "Nigerian",
      "state": "Katsina",
      "lga": "Katsina",
      "townVillage": "Katsina",
      "fathersContactNumber": "+2348078901234",
      "isBegging": false,
      "parentName": "Ibrahim Musa",
      "parentPhone": "+2348078901234",
      "parentOccupation": "Farmer",
      "familyIncome": 30000,
      "enrollmentDate": "2020-09-01",
      "attendanceRate": 95,
      "academicPerformance": "EXCELLENT",
      "healthStatus": "GOOD"
    }
  ]
}
```

### Update School
```http
PUT /api/schools/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated School Name",
  "status": "PUBLISHED"
}
```

### Delete School
```http
DELETE /api/schools/:id
Authorization: Bearer <access_token>
```

## 🧑‍🦯 Beggars API

### Get All Beggars
```http
GET /api/beggars?page=1&limit=10&search=Ahmed&lga=Katsina&isBegging=true
Authorization: Bearer <access_token>
```

### Get Beggars by Interviewer
```http
GET /api/beggars/my-beggars?page=1&limit=10&isBegging=true
Authorization: Bearer <access_token>
```

### Get Beggar by ID
```http
GET /api/beggars/:id
Authorization: Bearer <access_token>
```

### Create Beggar
```http
POST /api/beggars
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "beggarId": "BEG003",
  "name": "Ahmed Musa",
  "age": 25,
  "sex": "MALE",
  "nationality": "Nigerian",
  "stateOfOrigin": "Katsina",
  "lga": "Katsina",
  "townVillage": "Katsina",
  "permanentHomeAddress": "123 Main Street, Katsina",
  "fathersContactNumber": "+2348012345678",
  "contactNumber": "+2348012345678",
  "isBegging": true,
  "reasonForBegging": "Disability",
  "nin": "12345678901",
  "pictureUrl": "https://example.com/photo.jpg"
}
```

### Update Beggar
```http
PUT /api/beggars/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "isBegging": false,
  "reasonForBegging": "Found employment"
}
```

### Delete Beggar
```http
DELETE /api/beggars/:id
Authorization: Bearer <access_token>
```

## 📝 Drafts API

### Get All Drafts
```http
GET /api/drafts?page=1&limit=10&type=SCHOOL
Authorization: Bearer <access_token>
```

### Get Draft by ID
```http
GET /api/drafts/:id
Authorization: Bearer <access_token>
```

### Create Draft
```http
POST /api/drafts
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "draftId": "DRAFT001",
  "type": "SCHOOL",
  "data": {
    "schoolCode": "SCH004",
    "name": "Draft School",
    "address": "Draft Address"
  }
}
```

### Save Draft (Create or Update)
```http
POST /api/drafts/save
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "draftId": "DRAFT001",
  "type": "SCHOOL",
  "data": {
    "schoolCode": "SCH004",
    "name": "Updated Draft School",
    "address": "Updated Draft Address"
  }
}
```

### Update Draft
```http
PUT /api/drafts/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "data": {
    "schoolCode": "SCH004",
    "name": "Updated Draft School",
    "address": "Updated Draft Address"
  }
}
```

### Delete Draft
```http
DELETE /api/drafts/:id
Authorization: Bearer <access_token>
```

## 📁 Files API

### Upload File
```http
POST /api/files/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: [binary file data]
relatedToType: "SCHOOL"
relatedToId: "school_id_here"
```

### Get Files by User
```http
GET /api/files/my-files?page=1&limit=10&relatedToType=SCHOOL
Authorization: Bearer <access_token>
```

### Get File by ID
```http
GET /api/files/:id
Authorization: Bearer <access_token>
```

### Download File
```http
GET /api/files/:id/download
Authorization: Bearer <access_token>
```

### Delete File
```http
DELETE /api/files/:id
Authorization: Bearer <access_token>
```

## 👥 Users API (Admin Only)

### Get All Users
```http
GET /api/users?page=1&limit=10&search=Ahmed&role=INTERVIEWER&lga=Katsina
Authorization: Bearer <access_token>
```

### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <access_token>
```

### Create User
```http
POST /api/users
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "interviewerId": "INT003",
  "name": "New User",
  "email": "newuser@example.com",
  "phone": "+2348012345678",
  "lga": "Katsina",
  "role": "INTERVIEWER",
  "password": "password123",
  "isActive": true
}
```

### Update User
```http
PUT /api/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated User Name",
  "role": "SUPERVISOR"
}
```

### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <access_token>
```

### Toggle User Status
```http
PATCH /api/users/:id/toggle-status
Authorization: Bearer <access_token>
```

## 📊 Analytics API (Supervisor/Admin Only)

### Get School Statistics
```http
GET /api/analytics/schools?lga=Katsina&status=PUBLISHED
Authorization: Bearer <access_token>
```

### Get Beggar Statistics
```http
GET /api/analytics/beggars?lga=Katsina&stateOfOrigin=Katsina
Authorization: Bearer <access_token>
```

### Get Dashboard Data
```http
GET /api/analytics/dashboard
Authorization: Bearer <access_token>
```

### Get Interviewer Statistics
```http
GET /api/analytics/interviewer/INT001
Authorization: Bearer <access_token>
```

## 🔒 Role-Based Access Control

### Roles:
- **INTERVIEWER**: Can create, read, update, delete their own schools and beggars
- **SUPERVISOR**: Can view all data and access analytics
- **ADMIN**: Full access to all features including user management

### Permission Matrix:

| Endpoint | INTERVIEWER | SUPERVISOR | ADMIN |
|----------|-------------|------------|-------|
| Schools (own) | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| Schools (all) | ❌ | ✅ Read | ✅ CRUD |
| Beggars (own) | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| Beggars (all) | ❌ | ✅ Read | ✅ CRUD |
| Drafts | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| Files (own) | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| Files (all) | ❌ | ✅ Read | ✅ CRUD |
| Users | ❌ | ❌ | ✅ CRUD |
| Analytics | ❌ | ✅ Read | ✅ Read |

## 📋 Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🚨 Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "error": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🔧 Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Seed Database (Optional):**
   ```bash
   npm run seed
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## 📝 Notes

- All timestamps are in ISO 8601 format
- File uploads support images, documents, and spreadsheets
- Pagination is available on all list endpoints
- Search functionality supports text search across relevant fields
- Draft system allows saving incomplete forms for later completion
- Analytics provide comprehensive data insights for decision making 