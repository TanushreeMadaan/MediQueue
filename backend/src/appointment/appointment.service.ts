import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepo.create(createAppointmentDto);
    return this.appointmentRepo.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      relations: ['patient', 'doctor'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    
    if (!appointment) {
      throw new NotFoundException(`404:Appointment with ID ${id} was not found`);
    }
    
    return appointment;
  }

  async update(id: number, updateAppointmentDto: any): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepo.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepo.remove(appointment);
  }

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return this.appointmentRepo.save(appointment);
  }

  async findByPatient(patientId: number): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: { patient_id: patientId },
      relations: ['patient', 'doctor'],
      order: { appointment_date: 'ASC' },
    });
  }

  async findByDoctor(doctorId: number): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: { doctor_id: doctorId },
      relations: ['patient', 'doctor'],
      order: { appointment_date: 'ASC' },
    });
  }

  async findByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: { status },
      relations: ['patient', 'doctor'],
      order: { appointment_date: 'ASC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: {
        appointment_date: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      relations: ['patient', 'doctor'],
      order: { appointment_date: 'ASC' },
    });
  }
} 