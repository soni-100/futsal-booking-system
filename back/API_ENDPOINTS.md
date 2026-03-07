# API Endpoints Reference

## Base URL
`http://localhost:8000/api`

## Authentication Endpoints

### User Registration
```
POST /api/auth/register/
Body: {
  "email": "user@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
Response: {
  "token": "abc123...",
  "user": {...},
  "message": "User registered successfully"
}
```

### User Login
```
POST /api/auth/login/
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "token": "abc123...",
  "user": {...},
  "message": "Login successful"
}
```

### Admin Login
```
POST /api/auth/admin/login/
Body: {
  "email": "admin@example.com",
  "password": "admin123"
}
Response: {
  "token": "abc123...",
  "admin": {...},
  "message": "Admin login successful"
}
```

### Get Current User
```
GET /api/auth/user/
Headers: {
  "Authorization": "Token abc123..."
}
Response: {
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  ...
}
```

### Get Current Admin
```
GET /api/auth/admin/user/
Headers: {
  "Authorization": "Token abc123..."
}
Response: {
  "id": 1,
  "email": "admin@example.com",
  ...
}
```

### Logout
```
POST /api/auth/logout/
Headers: {
  "Authorization": "Token abc123..."
}
Response: {
  "message": "Logout successful"
}
```

## Court Endpoints

### List All Active Courts
```
GET /api/courts/
Response: [
  {
    "id": 1,
    "name": "Elite Futsal Arena",
    "location": "Downtown",
    "price_per_hour": "50.00",
    ...
  }
]
```

### Get Court Details
```
GET /api/courts/<id>/
Response: {
  "id": 1,
  "name": "Elite Futsal Arena",
  "time_slots": [...],
  ...
}
```

### Admin: List All Courts
```
GET /api/courts/manage/
Headers: {
  "Authorization": "Token abc123..."
}
```

### Admin: Create Court
```
POST /api/courts/manage/
Headers: {
  "Authorization": "Token abc123..."
}
Body: {
  "name": "New Court",
  "location": "Location",
  "price_per_hour": "50.00",
  "capacity": 10,
  ...
}
```

### Admin: Update Court
```
PUT /api/courts/manage/<id>/
Headers: {
  "Authorization": "Token abc123..."
}
Body: {
  "name": "Updated Court",
  ...
}
```

### Admin: Delete Court
```
DELETE /api/courts/manage/<id>/
Headers: {
  "Authorization": "Token abc123..."
}
```

## Booking Endpoints

### List User's Bookings
```
GET /api/bookings/
Headers: {
  "Authorization": "Token abc123..."
}
Response: [
  {
    "id": 1,
    "court": {...},
    "booking_date": "2024-01-15",
    "start_time": "14:00:00",
    ...
  }
]
```

### Create Booking
```
POST /api/bookings/
Headers: {
  "Authorization": "Token abc123..."
}
Body: {
  "court_id": 1,
  "booking_date": "2024-01-15",
  "start_time": "14:00:00",
  "end_time": "16:00:00",
  "duration": 2
}
```

### Get Booking Details
```
GET /api/bookings/<id>/
Headers: {
  "Authorization": "Token abc123..."
}
```

### Update Booking
```
PUT /api/bookings/<id>/
Headers: {
  "Authorization": "Token abc123..."
}
Body: {
  "status": "cancelled"
}
```

### Delete Booking
```
DELETE /api/bookings/<id>/
Headers: {
  "Authorization": "Token abc123..."
}
```

### Admin: List All Bookings
```
GET /api/bookings/manage/?status=confirmed
Headers: {
  "Authorization": "Token abc123..."
}
```

### Admin: Update Booking Status
```
PUT /api/bookings/manage/<id>/
Headers: {
  "Authorization": "Token abc123..."
}
Body: {
  "status": "confirmed"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```
{
  "error": "Error message",
  "field_name": ["Field-specific error"]
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
