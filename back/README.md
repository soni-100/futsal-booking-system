# Futsal Booking Backend (Django)

Django REST API backend for the Futsal Booking System.

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Database Setup

#### Option A: SQLite (Default - for development)
No additional setup needed. SQLite will be used automatically.

#### Option B: PostgreSQL (Recommended for production)
1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE futsal_booking;
```
3. Update `settings.py` to use PostgreSQL (uncomment PostgreSQL config)
4. Create `.env` file from `.env.example` and fill in database credentials

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/admin/login/` - Admin login
- `GET /api/auth/user/` - Get current user (requires authentication)
- `GET /api/auth/admin/user/` - Get current admin (requires admin authentication)
- `POST /api/auth/logout/` - Logout (requires authentication)

### Courts

- `GET /api/courts/` - List all active courts
- `GET /api/courts/<id>/` - Get court details
- `GET /api/courts/manage/` - List all courts (admin)
- `POST /api/courts/manage/` - Create court (admin)
- `PUT /api/courts/manage/<id>/` - Update court (admin)
- `DELETE /api/courts/manage/<id>/` - Delete court (admin)

### Bookings

- `GET /api/bookings/` - List user's bookings (requires authentication)
- `POST /api/bookings/` - Create booking (requires authentication)
- `GET /api/bookings/<id>/` - Get booking details (requires authentication)
- `PUT /api/bookings/<id>/` - Update booking (requires authentication)
- `DELETE /api/bookings/<id>/` - Cancel booking (requires authentication)
- `GET /api/bookings/manage/` - List all bookings (admin)
- `PUT /api/bookings/manage/<id>/` - Update booking status (admin)

## Database Schema

See `database_schema.sql` for the complete database schema.

## Models

- **User** - Custom user model with phone and admin flag
- **Court** - Futsal court information
- **TimeSlot** - Available time slots for courts
- **Booking** - User bookings
- **Payment** - Payment records
- **Review** - Court reviews and ratings
- **Notification** - User notifications

## Authentication

The API uses Token Authentication. Include the token in the Authorization header:

```
Authorization: Token <your-token>
```

## Admin Panel

Access Django admin at `http://localhost:8000/admin/` using superuser credentials.
