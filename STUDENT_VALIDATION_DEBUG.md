# Student Validation Debugging Guide

This guide helps identify and fix student validation issues when adding or updating students in schools.

## Common Validation Issues

### 1. **Age Validation**
- **Requirement**: Must be a number between 0 and 25
- **Common Issues**:
  - String numbers (e.g., "12" instead of 12)
  - Negative numbers
  - Numbers above 25
  - Empty strings or null

**✅ Correct:**
```json
{
  "age": 12
}
```

**❌ Incorrect:**
```json
{
  "age": "12",     // String instead of number
  "age": -5,       // Negative number
  "age": 30,       // Above 25
  "age": null      // Null value
}
```

### 2. **Gender Validation**
- **Requirement**: Must be exactly "MALE" or "FEMALE" (case-insensitive)
- **Common Issues**:
  - Lowercase ("male", "female")
  - Mixed case ("Male", "Female")
  - Abbreviations ("M", "F")
  - Empty strings

**✅ Correct:**
```json
{
  "gender": "MALE",
  "gender": "FEMALE"
}
```

**❌ Incorrect:**
```json
{
  "gender": "male",     // Lowercase
  "gender": "Male",     // Mixed case
  "gender": "M",        // Abbreviation
  "gender": ""          // Empty string
}
```

### 3. **Phone Number Validation**
- **Requirement**: Must be a valid Nigerian phone number
- **Format**: `+234XXXXXXXXX` or `0XXXXXXXXX`
- **Common Issues**:
  - Missing country code
  - Wrong format
  - Invalid characters

**✅ Correct:**
```json
{
  "fathersContactNumber": "+2348012345678",
  "fathersContactNumber": "08012345678"
}
```

**❌ Incorrect:**
```json
{
  "fathersContactNumber": "8012345678",    // Missing +234 or 0
  "fathersContactNumber": "1234567890",    // Wrong format
  "fathersContactNumber": "abc123def"      // Invalid characters
}
```

### 4. **Required Fields**
All these fields are **required** and cannot be empty:

- `name` (2-100 characters)
- `age` (0-25)
- `gender` ("MALE" or "FEMALE")
- `permanentHomeAddress` (5-500 characters)
- `nationality` (non-empty string)
- `state` (non-empty string)
- `lga` (non-empty string)
- `townVillage` (non-empty string)
- `fathersContactNumber` (valid Nigerian phone)

## Example Request Body

### ✅ Complete Student Object
```json
{
  "students": [
    {
      "name": "Ahmad Ibrahim",
      "age": 12,
      "gender": "MALE",
      "permanentHomeAddress": "456 Village Road, Katsina",
      "nationality": "Nigerian",
      "state": "Katsina",
      "lga": "Katsina",
      "townVillage": "Katsina Town",
      "fathersContactNumber": "+2348012345680",
      "isBegging": false,
      "nin": "12345678901",
      "pictureUrl": "https://example.com/student1.jpg",
      "parentName": "Ibrahim Musa",
      "parentPhone": "+2348012345681",
      "parentOccupation": "Farmer",
      "familyIncome": 30000,
      "enrollmentDate": "2023-09-01",
      "attendanceRate": 95,
      "academicPerformance": "GOOD",
      "hasSpecialNeeds": false,
      "specialNeedsType": null,
      "receivesScholarship": false,
      "scholarshipType": null,
      "healthStatus": "GOOD"
    }
  ]
}
```

### ✅ Minimal Student Object (Only Required Fields)
```json
{
  "students": [
    {
      "name": "Ahmad Ibrahim",
      "age": 12,
      "gender": "MALE",
      "permanentHomeAddress": "456 Village Road, Katsina",
      "nationality": "Nigerian",
      "state": "Katsina",
      "lga": "Katsina",
      "townVillage": "Katsina Town",
      "fathersContactNumber": "+2348012345680"
    }
  ]
}
```

## Debugging Steps

### 1. **Check Console Logs**
The backend now provides detailed logging. Look for:
```
🔍 Validating students array with 1 students
📝 Student 1: {
  name: "Ahmad Ibrahim",
  age: 12,
  gender: "MALE",
  phone: "+2348012345680",
  hasRequiredFields: {
    name: true,
    age: true,
    gender: true,
    address: true,
    nationality: true,
    state: true,
    lga: true,
    townVillage: true,
    phone: true
  }
}
```

### 2. **Check Error Response**
The error response now includes debug information:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "body.students.0.age: Student age must be between 0 and 25 years. Received: invalid value"
  ],
  "debug": {
    "endpoint": "/api/schools/123",
    "method": "PUT",
    "bodyKeys": ["students"],
    "hasStudents": true,
    "studentsCount": 1
  }
}
```

### 3. **Common Frontend Issues**

#### **String Numbers**
**Problem**: Frontend sends age as string
```json
{
  "age": "12"  // String instead of number
}
```

**Solution**: Convert to number before sending
```javascript
const studentData = {
  ...formData,
  age: parseInt(formData.age) || 0
};
```

#### **Case Sensitivity**
**Problem**: Frontend sends gender in wrong case
```json
{
  "gender": "male"  // Lowercase
}
```

**Solution**: Convert to uppercase
```javascript
const studentData = {
  ...formData,
  gender: formData.gender.toUpperCase()
};
```

#### **Phone Number Format**
**Problem**: Frontend sends phone without proper format
```json
{
  "fathersContactNumber": "8012345678"  // Missing +234 or 0
}
```

**Solution**: Ensure proper format
```javascript
const formatPhone = (phone) => {
  if (phone.startsWith('+234')) return phone;
  if (phone.startsWith('0')) return phone;
  return `+234${phone}`;
};

const studentData = {
  ...formData,
  fathersContactNumber: formatPhone(formData.fathersContactNumber)
};
```

## Testing Endpoints

### **Add Students to Existing School**
```
PUT /api/schools/{schoolId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "students": [
    {
      "name": "Test Student",
      "age": 10,
      "gender": "MALE",
      "permanentHomeAddress": "123 Test Street",
      "nationality": "Nigerian",
      "state": "Katsina",
      "lga": "Katsina",
      "townVillage": "Test Town",
      "fathersContactNumber": "+2348012345678"
    }
  ]
}
```

### **Create School with Students**
```
POST /api/schools
Authorization: Bearer {token}
Content-Type: application/json

{
  "schoolCode": "TEST001",
  "name": "Test School",
  "address": "123 Test Address",
  "phone": "+2348012345678",
  "lga": "Katsina",
  "district": "Test District",
  "ward": "Test Ward",
  "students": [
    {
      "name": "Test Student",
      "age": 10,
      "gender": "MALE",
      "permanentHomeAddress": "123 Test Street",
      "nationality": "Nigerian",
      "state": "Katsina",
      "lga": "Katsina",
      "townVillage": "Test Town",
      "fathersContactNumber": "+2348012345678"
    }
  ]
}
```

## Validation Rules Summary

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | ✅ | 2-100 characters |
| age | number | ✅ | 0-25 |
| gender | string | ✅ | "MALE" or "FEMALE" |
| permanentHomeAddress | string | ✅ | 5-500 characters |
| nationality | string | ✅ | non-empty |
| state | string | ✅ | non-empty |
| lga | string | ✅ | non-empty |
| townVillage | string | ✅ | non-empty |
| fathersContactNumber | string | ✅ | Nigerian phone format |
| isBegging | boolean | ❌ | defaults to false |
| nin | string | ❌ | optional |
| pictureUrl | string | ❌ | valid URL |
| parentName | string | ❌ | optional |
| parentPhone | string | ❌ | Nigerian phone format |
| parentOccupation | string | ❌ | optional |
| familyIncome | number | ❌ | ≥ 0 |
| enrollmentDate | string/date | ❌ | valid date |
| attendanceRate | number | ❌ | 0-100 |
| academicPerformance | string | ❌ | "EXCELLENT", "GOOD", "AVERAGE", "POOR" |
| hasSpecialNeeds | boolean | ❌ | defaults to false |
| specialNeedsType | string | ❌ | optional |
| receivesScholarship | boolean | ❌ | defaults to false |
| scholarshipType | string | ❌ | optional |
| healthStatus | string | ❌ | "GOOD", "FAIR", "POOR" |

## Quick Fix Checklist

- [ ] All required fields are present
- [ ] Age is a number (not string) between 0-25
- [ ] Gender is "MALE" or "FEMALE" (uppercase)
- [ ] Phone numbers follow Nigerian format (+234XXXXXXXXX or 0XXXXXXXXX)
- [ ] String fields are not empty
- [ ] Optional fields are either provided or omitted (not null/empty strings)
- [ ] Dates are in valid format (YYYY-MM-DD)
- [ ] Numbers are actual numbers (not strings) 