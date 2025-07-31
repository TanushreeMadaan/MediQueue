const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  // Create tables if they don't exist (matching entity schemas)
  // await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  //   await connection.query('DROP TABLE IF EXISTS queue');
  //   await connection.query('DROP TABLE IF EXISTS appointments');
  //   await connection.query('DROP TABLE IF EXISTS appointment');
  //   await connection.query('DROP TABLE IF EXISTS doctor');
  //   await connection.query('DROP TABLE IF EXISTS patient');
  //   await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'front_desk',
      name VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      specialization VARCHAR(255) NOT NULL,
      gender VARCHAR(10) NOT NULL,
      location VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      availability JSON,
      is_available BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255),
      address VARCHAR(255),
      date_of_birth DATE,
      gender VARCHAR(10),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      doctor_id INT NOT NULL,
      appointment_date DATETIME NOT NULL,
      status ENUM('booked','completed','cancelled','no_show') DEFAULT 'booked',
      notes TEXT,
      fee DECIMAL(10,2),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS queue (
      id INT AUTO_INCREMENT PRIMARY KEY,
      queue_number INT NOT NULL,
      patient_id INT NOT NULL,
      status ENUM('waiting','with_doctor','completed','cancelled') DEFAULT 'waiting',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      called_at DATETIME,
      completed_at DATETIME,
      doctor_id INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    );
  `);

  // Clear existing data (optional, for clean slate)
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  await connection.query('TRUNCATE TABLE queue');
  await connection.query('TRUNCATE TABLE appointments');
  await connection.query('TRUNCATE TABLE patients');
  await connection.query('TRUNCATE TABLE doctors');
  await connection.query('TRUNCATE TABLE users');
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');

  // Insert Users
  await connection.query(`
    INSERT INTO users (email, password, role, name) VALUES
      ('frontdesk1@clinic.com', '$2b$10$qEth6TeUGrx1vs7ipWOo9ulwpu7RFDfAA1S1kzJu0oUIx0zKvpbZi', 'front_desk', 'Front Desk User'),
      ('admin1@clinic.com', '$2b$10$qEth6TeUGrx1vs7ipWOo9ulwpu7RFDfAA1S1kzJu0oUIx0zKvpbZi', 'admin', 'Admin User')
  `);

  // Insert Doctors
  await connection.query(`
    INSERT INTO doctors (name, specialization, gender, location, phone, email, availability, is_available) VALUES
      ('Dr. Alice', 'Cardiology', 'Female', 'Room 101', '111-222-3333', 'alice@clinic.com',
        '[{"day":"Monday","start_time":"09:00","end_time":"13:00"},{"day":"Wednesday","start_time":"14:00","end_time":"18:00"}]', true),
      ('Dr. Bob', 'Dermatology', 'Male', 'Room 102', '222-333-4444', 'bob@clinic.com',
        '[{"day":"Tuesday","start_time":"10:00","end_time":"16:00"}]', true)
  `);

  // Insert Patients
  await connection.query(`
    INSERT INTO patients (name, phone, email, address, date_of_birth, gender) VALUES
      ('John Doe', '1234567890', 'john@example.com', '123 Main St', '1990-01-01', 'Male'),
      ('Jane Smith', '0987654321', 'jane@example.com', '456 Elm St', '1995-05-15', 'Female')
  `);

  // Insert Appointments
  await connection.query(`
    INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes, fee) VALUES
      (1, 1, '2024-06-01 10:00:00', 'booked', 'First appointment', 100.00),
      (2, 2, '2024-06-01 11:00:00', 'booked', 'Follow-up', 120.00)
  `);

  // Insert Queue
  await connection.query(`
    INSERT INTO queue (queue_number, patient_id, status, joined_at, doctor_id) VALUES
      (1, 1, 'waiting', NOW(), 1),
      (2, 2, 'waiting', NOW(), 2)
  `);

  console.log('Database updated successfully!');
  await connection.end();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
});
