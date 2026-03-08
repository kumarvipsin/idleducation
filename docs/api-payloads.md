# IDL Education API Reference

This document provides examples for the mobile-facing and external client APIs.

## Authentication

### Login
**Endpoint:** `POST /api/auth/login`  
**Description:** Authenticates a user and returns their profile.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

### Signup
**Endpoint:** `POST /api/auth/signup`  
**Description:** Registers a new user (Student or Teacher).

**Request Body (Student):**
```json
{
  "name": "Full Name",
  "email": "student@example.com",
  "password": "secure_password",
  "role": "student"
}
```

**Request Body (Teacher):**
```json
{
  "name": "Teacher Name",
  "email": "teacher@example.com",
  "password": "secure_password",
  "role": "teacher",
  "designation": "Subject Expert",
  "experience": "X+ Years"
}
```

## Courses

### Get Free Courses
**Endpoint:** `GET /api/courses/free`  
**Description:** Returns all free courses with signed image URLs.

### View Lessons
**Endpoint:** `GET /api/courses/free/[id]/lessons`  
**Description:** Returns the curriculum (chapters and videos) for a specific course.

---
*Note: All private image/file URLs are returned as temporary signed links valid for 15 minutes.*
