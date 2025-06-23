# Quranic Schools Backend API

A comprehensive backend API for census data collection on Quranic schools and street beggars in Katsina State, Nigeria.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **School Management**: Complete CRUD operations for Quranic schools with nested data
- **Beggar Registration**: Street beggar data collection and management
- **Draft System**: Save and manage incomplete forms
- **File Upload**: Image and document upload functionality
- **Analytics**: Data analysis and reporting capabilities
- **Offline Sync**: Support for offline data collection with sync capabilities

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.tbfk6vr.mongodb.net/quranic_schools_db?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

### 3. Database Setup

Make sure MongoDB is running on your system. The application will automatically connect to the database when started.

### 4. Seed Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

### Schools
- `GET /api/schools` - Get all schools
- `GET /api/schools/:id` - Get school by ID
- `POST /api/schools` - Create new school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school

### Beggars
- `GET /api/beggars` - Get all beggars
- `GET /api/beggars/:id` - Get beggar by ID
- `POST /api/beggars` - Create new beggar
- `PUT /api/beggars/:id` - Update beggar
- `DELETE /api/beggars/:id` - Delete beggar

### Drafts
- `GET /api/drafts` - Get user drafts
- `GET /api/drafts/:id` - Get draft by ID
- `POST /api/drafts` - Save draft
- `PUT /api/drafts/:id` - Update draft
- `DELETE /api/drafts/:id` - Delete draft

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file by ID
- `DELETE /api/files/:id` - Delete file

### Analytics
- `GET /api/analytics/schools` - School statistics
- `GET /api/analytics/beggars` - Beggar statistics
- `GET /api/analytics/dashboard` - Dashboard data

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🗄️ Database Schema

### Users
- Interviewer ID, name, email, phone, LGA, role, password hash

### Schools
- School code, name, address, contact info, location details
- Head teacher information (embedded)
- School structure details (embedded)
- Student list (embedded array)

### Beggars
- Beggar ID, personal info, location, contact details, begging status

### Drafts
- Draft ID, type, data, interviewer ID, last saved timestamp

### Files
- File ID, metadata, upload info, related entity references

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run test         # Run tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── validations/     # Input validation schemas
└── index.ts         # Application entry point
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation with Zod
- Rate limiting
- CORS protection
- Helmet security headers
- Password hashing with bcrypt

## 📊 Sample Data

The seed script creates:

- **4 Users**: Interviewers, supervisors, and admin
- **2 Schools**: Complete with head teachers, structure, and students
- **2 Beggars**: Sample beggar records

Default login credentials:
- Interviewer: `INT001` / `password123`
- Supervisor: `SUP001` / `password123`
- Admin: `ADM001` / `password123`

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set all required environment variables in production, especially:
- Strong JWT secrets
- Production MongoDB URI
- Proper CORS origins
- File upload limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team. 