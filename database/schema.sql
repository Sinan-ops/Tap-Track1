-- Database Schema for Tap-Track

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee' CHECK(role IN ('admin', 'employee', 'manager')),
    department VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, roll_number)
);

-- Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'absent' CHECK(status IN ('present', 'absent', 'late')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, student_id, date)
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_classes_user_id ON classes(user_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance_records(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance_records(class_id, date);

-- Sample Data
INSERT INTO users (name, email, password_hash, role, department) VALUES
('Admin User', 'admin@tap-track.local', '$2a$10$wIxB7rH6vjJdigQIYAsGfOZ/3Ff3p6fJMsMxXEHvxGTWmNy0On0m6', 'admin', 'Management'),
('John Doe', 'john@example.com', '$2a$10$wIxB7rH6vjJdigQIYAsGfOZ/3Ff3p6fJMsMxXEHvxGTWmNy0On0m6', 'employee', 'Engineering'),
('Jane Smith', 'jane@example.com', '$2a$10$wIxB7rH6vjJdigQIYAsGfOZ/3Ff3p6fJMsMxXEHvxGTWmNy0On0m6', 'employee', 'Marketing'),
('Bob Johnson', 'bob@example.com', '$2a$10$wIxB7rH6vjJdigQIYAsGfOZ/3Ff3p6fJMsMxXEHvxGTWmNy0On0m6', 'manager', 'Operations');

INSERT INTO departments (name, description) VALUES
('Engineering', 'Software Development'),
('Marketing', 'Marketing and Communications'),
('Operations', 'Business Operations'),
('Management', 'Company Management');
