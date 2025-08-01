export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  gender: string;
  location: string;
  phone: string;
  email: string;
  availability: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  status: 'booked' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  fee?: number;
  patient: Patient;
  doctor: Doctor;
  created_at: string;
  updated_at: string;
}

export interface QueueEntry {
  id: number;
  queue_number: number;
  patient_id: number;
  status: 'waiting' | 'with_doctor' | 'completed' | 'cancelled';
  joined_at: string;
  called_at?: string;
  completed_at?: string;
  doctor_id?: number;
  patient: Patient;
  doctor?: Doctor; 
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string; 
}

export interface CreatePatientDto {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface CreateAppointmentDto {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  fee?: number;
}

export interface AddToQueueDto {
  patient_id: number;
  doctor_id?: number;
}

export interface CreateDoctorDto {
  name: string;
  specialization: string;
  gender: string;
  location: string;
  phone: string;
  email: string;
  availability?: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  is_available?: boolean;
}

export interface UpdateDoctorDto {
  name?: string;
  specialization?: string;
  gender?: string;
  location?: string;
  phone?: string;
  email?: string;
  availability?: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  is_available?: boolean;
}

export interface UpdateAppointmentDto {
  appointment_date?: string; 
  status?: 'booked' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  patient_id?: number;
  doctor_id?: number;
}
