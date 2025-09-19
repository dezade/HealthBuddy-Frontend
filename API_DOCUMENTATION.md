# HealthBuddy Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the access token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

---

## Health Check

### GET /health
Check server status (no authentication required)

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-19T05:50:35.412Z",
  "uptime": 33.649613561,
  "environment": "development"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15", // optional, ISO date string
  "gender": "MALE" // optional, enum: MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false
    }
  }
}
```

### POST /api/auth/login
Authenticate user and receive tokens

**Request Body:**
```json
{
  "email": "user@example.com",
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
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isEmailVerified": true
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "refresh_token_string"
    }
  }
}
```

### POST /api/auth/refresh
Refresh access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "new_jwt_access_token",
      "refreshToken": "new_refresh_token_string"
    }
  }
}
```

### POST /api/auth/logout
Logout user and invalidate refresh token (requires authentication)

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /api/auth/forgot-password
Request password reset email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST /api/auth/reset-password
Reset password using token from email

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### POST /api/auth/verify-email
Verify email address

**Request Body:**
```json
{
  "token": "email_verification_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## User Management Endpoints
*All endpoints require authentication*

### GET /api/users/profile
Get current user's profile

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-15",
      "gender": "MALE",
      "height": 175.5,
      "activityLevel": "MODERATELY_ACTIVE",
      "medicalConditions": ["hypertension"],
      "allergies": ["peanuts"],
      "role": "USER",
      "isEmailVerified": true,
      "profilePictureUrl": null,
      "profile": {
        "currentWeight": 70.5,
        "goalWeight": 65.0,
        "fitnessGoals": ["weight_loss", "muscle_gain"],
        "dietaryPreferences": ["vegetarian"],
        "emergencyContactName": "Jane Doe",
        "emergencyContactPhone": "+1234567890",
        "preferredLanguage": "en",
        "timezone": "America/New_York"
      },
      "healthcareProfessionalProfile": null,
      "createdAt": "2025-09-19T05:50:35.412Z",
      "updatedAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### PUT /api/users/profile
Update user profile

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "height": 175.5,
  "activityLevel": "MODERATELY_ACTIVE", // enum: SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTREMELY_ACTIVE
  "medicalConditions": ["hypertension"],
  "allergies": ["peanuts"],
  "profileData": {
    "currentWeight": 70.5,
    "goalWeight": 65.0,
    "fitnessGoals": ["weight_loss", "muscle_gain"],
    "dietaryPreferences": ["vegetarian"],
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1234567890",
    "preferredLanguage": "en",
    "timezone": "America/New_York"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

### PUT /api/users/change-password
Change user password

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### DELETE /api/users/account
Delete user account

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## Health Data Endpoints
*All endpoints require authentication*

### POST /api/health/metrics
Add health metric entry

**Request Body:**
```json
{
  "date": "2025-09-19",
  "weight": 70.5, // optional
  "bodyFatPercentage": 15.2, // optional
  "muscleMass": 45.8, // optional
  "bloodPressureSystolic": 120, // optional
  "bloodPressureDiastolic": 80, // optional
  "heartRate": 75, // optional
  "sleepHours": 8.5, // optional
  "waterIntake": 2.5, // liters, optional
  "stressLevel": 3, // 1-10 scale, optional
  "moodRating": 7, // 1-10 scale, optional
  "energyLevel": 6, // 1-10 scale, optional
  "notes": "Feeling great today!" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Health metric added successfully",
  "data": {
    "healthMetric": {
      "id": "uuid",
      "userId": "uuid",
      "date": "2025-09-19",
      "weight": 70.5,
      // ... other fields
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### GET /api/health/metrics
Get health metrics

**Query Parameters:**
- `startDate` (optional): Start date filter (ISO date string)
- `endDate` (optional): End date filter (ISO date string)
- `limit` (optional): Number of results (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "healthMetrics": [
      {
        "id": "uuid",
        "date": "2025-09-19",
        "weight": 70.5,
        "bloodPressureSystolic": 120,
        // ... other fields
        "createdAt": "2025-09-19T05:50:35.412Z"
      }
    ]
  }
}
```

### POST /api/health/nutrition
Add nutrition entry

**Request Body:**
```json
{
  "date": "2025-09-19",
  "mealType": "BREAKFAST", // enum: BREAKFAST, LUNCH, DINNER, SNACK
  "foodName": "Oatmeal with berries",
  "quantity": 1,
  "unit": "bowl",
  "calories": 350, // optional
  "protein": 12.5, // optional
  "carbohydrates": 65.0, // optional
  "fat": 8.5, // optional
  "fiber": 8.0, // optional
  "sugar": 15.0, // optional
  "sodium": 200 // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Nutrition entry added successfully",
  "data": {
    "nutritionEntry": {
      "id": "uuid",
      "userId": "uuid",
      "date": "2025-09-19",
      "mealType": "BREAKFAST",
      "foodName": "Oatmeal with berries",
      // ... other fields
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### GET /api/health/nutrition
Get nutrition entries

**Query Parameters:**
- `date` (optional): Filter by specific date (ISO date string, defaults to today)

**Response:**
```json
{
  "success": true,
  "data": {
    "nutritionEntries": [
      {
        "id": "uuid",
        "mealType": "BREAKFAST",
        "foodName": "Oatmeal with berries",
        "calories": 350,
        // ... other fields
        "createdAt": "2025-09-19T05:50:35.412Z"
      }
    ]
  }
}
```

### POST /api/health/exercise
Add exercise entry

**Request Body:**
```json
{
  "date": "2025-09-19",
  "exerciseName": "Morning Run",
  "exerciseType": "CARDIO", // enum: CARDIO, STRENGTH, FLEXIBILITY, SPORTS, OTHER
  "durationMinutes": 30, // optional
  "caloriesBurned": 300, // optional
  "intensity": "MODERATE", // optional, enum: LOW, MODERATE, HIGH
  "sets": null, // optional, for strength training
  "reps": null, // optional, for strength training
  "weightUsed": null, // optional, for strength training
  "distance": 5.0, // optional, for cardio
  "notes": "Great morning run!" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Exercise added successfully",
  "data": {
    "exercise": {
      "id": "uuid",
      "userId": "uuid",
      "date": "2025-09-19",
      "exerciseName": "Morning Run",
      "exerciseType": "CARDIO",
      // ... other fields
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### GET /api/health/exercise
Get exercise entries

**Query Parameters:**
- `startDate` (optional): Start date filter (ISO date string)
- `endDate` (optional): End date filter (ISO date string)
- `limit` (optional): Number of results (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": "uuid",
        "exerciseName": "Morning Run",
        "exerciseType": "CARDIO",
        "durationMinutes": 30,
        // ... other fields
        "createdAt": "2025-09-19T05:50:35.412Z"
      }
    ]
  }
}
```

### GET /api/health/dashboard
Get health dashboard summary

**Response:**
```json
{
  "success": true,
  "data": {
    "dashboard": {
      "todayMetrics": {
        "weight": 70.5,
        "calories": 1850,
        "exercise": 45,
        "waterIntake": 2.5,
        "sleepHours": 8.0
      },
      "weeklyTrends": {
        "weightChange": -0.5,
        "averageCalories": 1800,
        "totalExercise": 300,
        "averageSleep": 7.5
      },
      "achievements": [
        {
          "type": "EXERCISE_STREAK",
          "message": "7-day exercise streak!",
          "unlockedAt": "2025-09-19T05:50:35.412Z"
        }
      ]
    }
  }
}
```

---

## AI-Powered Features
*All endpoints require authentication*

### POST /api/ai/symptom-check
Get AI assessment of symptoms

**Request Body:**
```json
{
  "symptoms": ["headache", "fatigue", "nausea"],
  "symptomDuration": "2 days", // optional
  "symptomSeverity": 6, // optional, 1-10 scale
  "additionalInfo": "Symptoms started after poor sleep" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Symptom assessment completed",
  "data": {
    "symptomCheck": {
      "id": "uuid",
      "symptoms": ["headache", "fatigue", "nausea"],
      "aiAssessment": "Based on your symptoms, this could be related to...",
      "aiRecommendations": ["Get adequate rest", "Stay hydrated", "Monitor symptoms"],
      "urgencyLevel": "LOW", // enum: LOW, MEDIUM, HIGH, EMERGENCY
      "shouldSeeDoctor": false,
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### POST /api/ai/mental-health-chat
Chat with AI mental health assistant

**Request Body:**
```json
{
  "message": "I'm feeling stressed about work lately",
  "sessionType": "CHAT", // optional, enum: CHAT, MOOD_CHECK, STRESS_ASSESSMENT, GUIDED_MEDITATION
  "moodBefore": 4 // optional, 1-10 scale
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I understand that work stress can be overwhelming. Here are some strategies that might help...",
    "session": {
      "id": "uuid",
      "sessionType": "CHAT",
      "conversationSummary": "User discussed work-related stress...",
      "topicsDiscussed": ["work stress", "coping strategies"],
      "aiInsights": ["High stress levels detected", "Recommends relaxation techniques"],
      "recommendations": ["Practice deep breathing", "Take regular breaks"],
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### POST /api/ai/generate-meal-plan
Generate personalized meal plan

**Request Body:**
```json
{
  "preferences": {
    "dietary": ["vegetarian", "low-carb"],
    "allergies": ["nuts"],
    "dislikedFoods": ["mushrooms"]
  },
  "targetCalories": 2000,
  "duration": 7 // days, optional, defaults to 7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meal plan generated successfully",
  "data": {
    "mealPlan": {
      "id": "uuid",
      "name": "7-Day Vegetarian Low-Carb Plan",
      "duration": 7,
      "targetCaloriesPerDay": 2000,
      "generatedPlan": {
        "day1": {
          "breakfast": { "name": "Veggie Omelet", "calories": 350 },
          "lunch": { "name": "Greek Salad", "calories": 450 },
          "dinner": { "name": "Grilled Tofu", "calories": 500 },
          "snacks": [{ "name": "Almonds", "calories": 200 }]
        }
        // ... other days
      },
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### POST /api/ai/generate-workout-plan
Generate personalized workout plan

**Request Body:**
```json
{
  "fitnessLevel": "INTERMEDIATE", // enum: BEGINNER, INTERMEDIATE, ADVANCED
  "goals": ["weight_loss", "muscle_gain"],
  "availableEquipment": ["dumbbells", "resistance_bands"],
  "timeAvailable": 45, // minutes per session
  "frequency": 4, // sessions per week
  "duration": 4 // weeks
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workout plan generated successfully",
  "data": {
    "workoutPlan": {
      "id": "uuid",
      "name": "4-Week Intermediate Weight Loss & Muscle Gain",
      "duration": 4,
      "frequency": 4,
      "difficultyLevel": "INTERMEDIATE",
      "generatedPlan": {
        "week1": {
          "day1": {
            "name": "Upper Body Strength",
            "exercises": [
              {
                "name": "Dumbbell Press",
                "sets": 3,
                "reps": "8-12",
                "restTime": "60 seconds"
              }
            ]
          }
        }
        // ... other weeks
      },
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

---

## Plans Management
*All endpoints require authentication*

### GET /api/plans/meals
Get user's meal plans

**Response:**
```json
{
  "success": true,
  "data": {
    "mealPlans": [
      {
        "id": "uuid",
        "name": "7-Day Vegetarian Plan",
        "duration": 7,
        "isActive": true,
        "createdAt": "2025-09-19T05:50:35.412Z"
      }
    ]
  }
}
```

### GET /api/plans/meals/:id
Get specific meal plan

**Response:**
```json
{
  "success": true,
  "data": {
    "mealPlan": {
      "id": "uuid",
      "name": "7-Day Vegetarian Plan",
      "duration": 7,
      "targetCaloriesPerDay": 2000,
      "generatedPlan": { /* full meal plan object */ },
      "isActive": true,
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### PUT /api/plans/meals/:id
Update meal plan

**Request Body:**
```json
{
  "name": "Updated Plan Name",
  "isActive": false,
  "generatedPlan": { /* updated plan object */ }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meal plan updated successfully",
  "data": {
    "mealPlan": { /* updated meal plan object */ }
  }
}
```

### DELETE /api/plans/meals/:id
Delete meal plan

**Response:**
```json
{
  "success": true,
  "message": "Meal plan deleted successfully"
}
```

### GET /api/plans/workouts
Get user's workout plans

**Response:**
```json
{
  "success": true,
  "data": {
    "workoutPlans": [
      {
        "id": "uuid",
        "name": "4-Week Strength Training",
        "duration": 4,
        "frequency": 3,
        "isActive": true,
        "createdAt": "2025-09-19T05:50:35.412Z"
      }
    ]
  }
}
```

### GET /api/plans/workouts/:id
Get specific workout plan

**Response:**
```json
{
  "success": true,
  "data": {
    "workoutPlan": {
      "id": "uuid",
      "name": "4-Week Strength Training",
      "duration": 4,
      "frequency": 3,
      "difficultyLevel": "INTERMEDIATE",
      "generatedPlan": { /* full workout plan object */ },
      "isActive": true,
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### PUT /api/plans/workouts/:id
Update workout plan

**Request Body:**
```json
{
  "name": "Updated Workout Plan",
  "isActive": false,
  "generatedPlan": { /* updated plan object */ }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workout plan updated successfully",
  "data": {
    "workoutPlan": { /* updated workout plan object */ }
  }
}
```

### DELETE /api/plans/workouts/:id
Delete workout plan

**Response:**
```json
{
  "success": true,
  "message": "Workout plan deleted successfully"
}
```

---

## Health Reports
*All endpoints require authentication*

### POST /api/reports/generate
Generate health report

**Request Body:**
```json
{
  "reportType": "WEEKLY", // enum: WEEKLY, MONTHLY, QUARTERLY, ANNUAL
  "startDate": "2025-09-12", // optional
  "endDate": "2025-09-19" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Health report generated successfully",
  "data": {
    "report": {
      "id": "uuid",
      "reportType": "WEEKLY",
      "startDate": "2025-09-12",
      "endDate": "2025-09-19",
      "reportData": {
        "summary": {
          "averageWeight": 70.2,
          "totalCalories": 12600,
          "totalExercise": 210,
          "averageSleep": 7.8
        },
        "trends": {
          "weightTrend": "decreasing",
          "activityTrend": "increasing"
        },
        "achievements": ["7-day exercise streak"],
        "recommendations": ["Increase water intake", "Add more protein"]
      },
      "createdAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

### GET /api/reports
Get user's health reports

**Query Parameters:**
- `type` (optional): Filter by report type
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "uuid",
        "reportType": "WEEKLY",
        "startDate": "2025-09-12",
        "endDate": "2025-09-19",
        "reportData": { /* report data object */ },
        "createdAt": "2025-09-19T05:50:35.412Z"
      }
    ]
  }
}
```

### POST /api/reports/share
Share report with healthcare professional

**Request Body:**
```json
{
  "reportId": "uuid",
  "healthcareProfessionalEmail": "doctor@example.com",
  "accessLevel": "VIEW", // enum: VIEW, COMMENT
  "message": "Here's my weekly health report for review" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report shared successfully",
  "data": {
    "sharedReport": {
      "id": "uuid",
      "reportId": "uuid",
      "accessLevel": "VIEW",
      "sharedAt": "2025-09-19T05:50:35.412Z"
    }
  }
}
```

---

## Notifications
*All endpoints require authentication*

### GET /api/notifications
Get user notifications

**Query Parameters:**
- `unreadOnly` (optional): Filter for unread notifications only (boolean)
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "REMINDER", // enum: REMINDER, ACHIEVEMENT, HEALTH_ALERT, SYSTEM, REPORT_READY
        "title": "Time for your workout!",
        "message": "Your scheduled workout starts in 15 minutes",
        "isRead": false,
        "createdAt": "2025-09-19T05:50:35.412Z"
      }
    ]
  }
}
```

### PUT /api/notifications/:id/read
Mark notification as read

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### PUT /api/notifications/read-all
Mark all notifications as read

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### DELETE /api/notifications/:id
Delete notification

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## Error Codes

### Authentication Errors
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Invalid token
- `AUTH_004`: Account not verified
- `AUTH_005`: Account locked

### Validation Errors
- `VAL_001`: Required field missing
- `VAL_002`: Invalid format
- `VAL_003`: Value out of range
- `VAL_004`: Invalid enum value

### Resource Errors
- `RES_001`: Resource not found
- `RES_002`: Resource already exists
- `RES_003`: Access denied
- `RES_004`: Resource locked

### Server Errors
- `SRV_001`: Internal server error
- `SRV_002`: Database connection error
- `SRV_003`: External service error
- `SRV_004`: Rate limit exceeded

---

## Data Types and Enums

### Gender
- `MALE`
- `FEMALE`
- `OTHER`
- `PREFER_NOT_TO_SAY`

### Activity Level
- `SEDENTARY`
- `LIGHTLY_ACTIVE`
- `MODERATELY_ACTIVE`
- `VERY_ACTIVE`
- `EXTREMELY_ACTIVE`

### User Role
- `USER`
- `HEALTHCARE_PROFESSIONAL`
- `ADMIN`

### Meal Type
- `BREAKFAST`
- `LUNCH`
- `DINNER`
- `SNACK`

### Exercise Type
- `CARDIO`
- `STRENGTH`
- `FLEXIBILITY`
- `SPORTS`
- `OTHER`

### Intensity
- `LOW`
- `MODERATE`
- `HIGH`

### Difficulty Level
- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`

### Urgency Level
- `LOW`
- `MEDIUM`
- `HIGH`
- `EMERGENCY`

### Mental Health Session Type
- `CHAT`
- `MOOD_CHECK`
- `STRESS_ASSESSMENT`
- `GUIDED_MEDITATION`

### Report Type
- `WEEKLY`
- `MONTHLY`
- `QUARTERLY`
- `ANNUAL`

### Notification Type
- `REMINDER`
- `ACHIEVEMENT`
- `HEALTH_ALERT`
- `SYSTEM`
- `REPORT_READY`

---

## Rate Limits
- Authentication endpoints: 5 requests per minute per IP
- General API endpoints: 100 requests per 15 minutes per user
- AI endpoints: 10 requests per minute per user

## Notes
- All dates should be in ISO format (YYYY-MM-DD or full ISO 8601 for timestamps)
- Numeric values for health metrics should be reasonable (weight in kg, height in cm, etc.)
- File uploads are supported for profile pictures and document attachments (separate upload endpoint)
- Real-time notifications are available via WebSocket connection (separate documentation)
