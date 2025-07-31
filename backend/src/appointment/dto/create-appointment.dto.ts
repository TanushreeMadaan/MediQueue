import { AppointmentStatus } from '../../entities/appointment.entity';

export class CreateAppointmentDto {
  patient_id: number;
  doctor_id: number;
  appointment_date: Date;
  status?: AppointmentStatus; 
  notes?: string; 
  fee?: number;
} 