-- Futsal Booking System Database Schema
-- This SQL file contains all essential tables for the futsal booking system

-- ============================================
-- USERS TABLE
-- ============================================
-- Note: Django uses its own User model, but this shows the structure
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COURTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 10,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TIME SLOTS TABLE
-- ============================================
-- Defines available time slots for booking
CREATE TABLE IF NOT EXISTS time_slots (
    id SERIAL PRIMARY KEY,
    court_id INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day_of_week INTEGER NOT NULL, -- 0=Monday, 6=Sunday
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    court_id INTEGER NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- in hours
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, refunded
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    CONSTRAINT check_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    CONSTRAINT check_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded'))
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- cash, card, online
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    court_id INTEGER NOT NULL,
    booking_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- booking_confirmed, booking_cancelled, payment_received, etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_court_id ON bookings(court_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_courts_is_active ON courts(is_active);
CREATE INDEX IF NOT EXISTS idx_time_slots_court_id ON time_slots(court_id);
CREATE INDEX IF NOT EXISTS idx_reviews_court_id ON reviews(court_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================
-- Insert sample courts
INSERT INTO courts (name, location, description, price_per_hour, capacity, image_url) VALUES
('Elite Futsal Arena', 'Downtown', 'Premium futsal court with excellent facilities', 50.00, 10, 'https://via.placeholder.com/400x300?text=Elite+Futsal+Arena'),
('Pro Futsal Center', 'City Center', 'Professional grade futsal court', 45.00, 10, 'https://via.placeholder.com/400x300?text=Pro+Futsal+Center'),
('Champions Futsal', 'Sports Complex', 'Top-tier futsal facility', 55.00, 10, 'https://via.placeholder.com/400x300?text=Champions+Futsal')
ON CONFLICT DO NOTHING;

-- Insert sample time slots (9 AM to 10 PM, Monday to Sunday)
INSERT INTO time_slots (court_id, start_time, end_time, day_of_week, is_available)
SELECT 
    c.id,
    t.start_time,
    t.end_time,
    d.day_of_week,
    TRUE
FROM courts c
CROSS JOIN (
    VALUES 
    ('09:00:00'::TIME, '10:00:00'::TIME),
    ('10:00:00'::TIME, '11:00:00'::TIME),
    ('11:00:00'::TIME, '12:00:00'::TIME),
    ('12:00:00'::TIME, '13:00:00'::TIME),
    ('13:00:00'::TIME, '14:00:00'::TIME),
    ('14:00:00'::TIME, '15:00:00'::TIME),
    ('15:00:00'::TIME, '16:00:00'::TIME),
    ('16:00:00'::TIME, '17:00:00'::TIME),
    ('17:00:00'::TIME, '18:00:00'::TIME),
    ('18:00:00'::TIME, '19:00:00'::TIME),
    ('19:00:00'::TIME, '20:00:00'::TIME),
    ('20:00:00'::TIME, '21:00:00'::TIME),
    ('21:00:00'::TIME, '22:00:00'::TIME)
) AS t(start_time, end_time)
CROSS JOIN (
    VALUES (0), (1), (2), (3), (4), (5), (6)
) AS d(day_of_week)
ON CONFLICT DO NOTHING;
