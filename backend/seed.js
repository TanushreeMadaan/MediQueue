// seed.js

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Connected to the database.');

  // Define the plaintext password and hash it dynamically
  const plainTextPassword = 'pass123';
  const saltRounds = 10;
  console.log(`Hashing the password "${plainTextPassword}"...`);
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  console.log('Password hashed successfully.');

  // 1. Clean the Database
  console.log('Truncating all tables...');
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  await connection.query('TRUNCATE TABLE queue');
  await connection.query('TRUNCATE TABLE appointments');
  await connection.query('TRUNCATE TABLE patients');
  await connection.query('TRUNCATE TABLE doctors');
  await connection.query('TRUNCATE TABLE users');
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('Tables truncated successfully.');

  // 2. Insert Users
  console.log('Inserting new users...');
  // We use the dynamically hashed password for all users
  await connection.query(`
    INSERT INTO users (name, email, password, role) VALUES
      ('Charvi', 'charvi@allohealth.care', ?, 'front_desk'),
      ('Priyanshi', 'priyanshi@allohealth.care', ?, 'front_desk'),
      ('user1', 'user@example.com', ?, 'front_desk')
  `, [hashedPassword, hashedPassword, hashedPassword]);
  console.log('Users inserted.');

  // 3. Insert Doctors
  console.log('Inserting new doctors...');
  await connection.query(`
    INSERT INTO doctors (name, specialization, gender, location, phone, email, availability, is_available) VALUES
      ('Dr. Emily Carter', 'Pediatrics', 'Female', 'Room 201', '555-0101', 'emily.carter@clinic.com',
        '[{"day":"Monday","start_time":"09:00","end_time":"17:00"},{"day":"Wednesday","start_time":"09:00","end_time":"17:00"}]', true),
      ('Dr. Michael Chen', 'Orthopedics', 'Male', 'Room 202', '555-0102', 'michael.chen@clinic.com',
        '[{"day":"Tuesday","start_time":"10:00","end_time":"18:00"},{"day":"Thursday","start_time":"10:00","end_time":"18:00"}]', true),
      ('Dr. Anjali Sharma', 'Neurology', 'Female', 'Room 203', '555-0103', 'anjali.sharma@clinic.com',
        '[{"day":"Friday","start_time":"08:00","end_time":"16:00"}]', true),
      ('Dr. David Rodriguez', 'Oncology', 'Male', 'Room 301', '555-0104', 'david.rodriguez@clinic.com',
        '[{"day":"Monday","start_time":"09:30","end_time":"17:30"},{"day":"Tuesday","start_time":"09:30","end_time":"17:30"}]', false),
      ('Dr. Sophia Lee', 'Dermatology', 'Female', 'Room 302', '555-0105', 'sophia.lee@clinic.com',
        '[{"day":"Wednesday","start_time":"11:00","end_time":"19:00"},{"day":"Thursday","start_time":"11:00","end_time":"19:00"}]', true)
  `);
  console.log('Doctors inserted.');

  // 4. Insert Patients
  console.log('Inserting new patients...');
  await connection.query(`
    INSERT INTO patients (name, phone, email, address, date_of_birth, gender) VALUES
      ('Liam Miller', '555-0201', 'liam.miller@example.com', '123 Oak Avenue', '1985-03-12', 'Male'),
      ('Olivia Davis', '555-0202', 'olivia.davis@example.com', '456 Pine Street', '1992-07-22', 'Female'),
      ('Noah Garcia', '555-0203', 'noah.garcia@example.com', '789 Maple Drive', '1978-11-05', 'Male'),
      ('Emma Wilson', '555-0204', 'emma.wilson@example.com', '101 Birch Lane', '2001-01-30', 'Female'),
      ('James Martinez', '555-0205', 'james.martinez@example.com', '212 Cedar Court', '1988-09-18', 'Male')
  `);
  console.log('Patients inserted.');
  
  console.log('✅ Database seeded successfully!');
  await connection.end();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
