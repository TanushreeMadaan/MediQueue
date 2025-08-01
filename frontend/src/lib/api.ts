import axios from 'axios';
import type { 
  LoginCredentials, 
  AuthResponse, 
  Doctor, 
  Patient, 
  Appointment, 
  QueueEntry 
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor that adds the auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor on response w error - global "catch" block
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getProtectedData: async () => {
    const response = await api.get('/auth/protected-route');
    return response.data;
  },
};

// Doctor APIs
export const doctorApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await api.get('/doctors');
    return response.data;
  },
  
  getById: async (id: number): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  
  create: async (doctor: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.post('/doctors', doctor);
    return response.data;
  },
  
  update: async (id: number, doctor: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.patch(`/doctors/${id}`, doctor);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/doctors/${id}`);
  },

  getAvailable: async (): Promise<Doctor[]> => {
    const response = await api.get('/doctors/available');
    return response.data;
  },

  getBySpecialization: async (specialization: string): Promise<Doctor[]> => {
    const response = await api.get(`/doctors?specialization=${specialization}`);
    return response.data;
  },
  
};

// Patient APIs
export const patientApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get('/patients');
    return response.data;
  },
  
  getById: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  
  create: async (patient: Partial<Patient>): Promise<Patient> => {
    const response = await api.post('/patients', patient);
    return response.data;
  },
  
  update: async (id: number, patient: Partial<Patient>): Promise<Patient> => {
    const response = await api.patch(`/patients/${id}`, patient);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};

// Queue APIs
export const queueApi = {
  getAll: async (status?: string): Promise<QueueEntry[]> => {
    let url = '/queue';
    if (status) url += `?status=${status}`;
    const response = await api.get(url);
    return response.data;
  },
  
  getCurrent: async (): Promise<QueueEntry[]> => {
    const response = await api.get('/queue/current');
    return response.data;
  },
  
  getById: async (id: number): Promise<QueueEntry> => {
    const response = await api.get(`/queue/${id}`);
    return response.data;
  },
  
  add: async (patientId: number, doctorId?: number): Promise<QueueEntry> => {
    const response = await api.post('/queue/add', { patientId, doctorId });
    return response.data;
  },
  
  updateStatus: async (id: number, status: string, doctorId?: number): Promise<QueueEntry> => {
    const response = await api.patch(`/queue/${id}/status`, { 
      status, 
      ...(doctorId && { doctorId }) 
    });
    return response.data;
  },
  
  remove: async (id: number): Promise<void> => {
    await api.delete(`/queue/${id}`);
  },
};

// Appointment APIs
export const appointmentApi = {
  getAll: async (patientId?: number, doctorId?: number, status?: string): Promise<Appointment[]> => {
    let url = '/appointments';
    const params = new URLSearchParams();
    if (patientId) params.append('patientId', patientId.toString());
    if (doctorId) params.append('doctorId', doctorId.toString());
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  getByPatient: async (patientId: number): Promise<Appointment[]> => {
    const response = await api.get(`/appointments?patientId=${patientId}`);
    return response.data;
  },
  
  getByDoctor: async (doctorId: number): Promise<Appointment[]> => {
    const response = await api.get(`/appointments?doctorId=${doctorId}`);
    return response.data;
  },
  
  getByStatus: async (status: string): Promise<Appointment[]> => {
    const response = await api.get(`/appointments?status=${status}`);
    return response.data;
  },
  
  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  
  create: async (appointment: {
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    notes?: string;
  }): Promise<Appointment> => {
    const response = await api.post('/appointments', appointment);
    return response.data;
  },
  
  update: async (id: number, appointment: Partial<Appointment>): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}`, appointment);
    return response.data;
  },
  
  updateStatus: async (id: number, status: string): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },
  
  cancel: async (id: number): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/cancel`);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};