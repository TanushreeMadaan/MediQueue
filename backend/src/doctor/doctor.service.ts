import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { CreateDoctorDto, UpdateDoctorDto } from './dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  //async create(createDoctorDto: any): Promise<Doctor> {
  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepo.create(createDoctorDto);
    return this.doctorRepo.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`404: Doctor with id ${id} was not found`);
    }
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, updateDoctorDto);
    return this.doctorRepo.save(doctor);
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepo.remove(doctor);
  }

  async findBySpecialization(specialization: string): Promise<Doctor[]> {
    return this.doctorRepo.find({ where: { specialization } });
  }

  async findAvailable(): Promise<Doctor[]> {
    return this.doctorRepo.find({ where: { is_available: true } });
  }
} 