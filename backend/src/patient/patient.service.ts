import { Patient } from '../entities/patient.entity'
import { CreatePatientDto, UpdatePatientDto} from './dto/index'
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PatientService {
    constructor (
        @InjectRepository(Patient)
        private patientRepo: Repository<Patient>,
    ){}

    async create(createPatientDto : CreatePatientDto): Promise<Patient>{
        const patient = this.patientRepo.create(createPatientDto);
        return this.patientRepo.save(patient);
    }

    async findAll(): Promise<Patient[]>{
        return this.patientRepo.find();
    }

    async findOne(id: number): Promise<Patient>{
        const patient = await this.patientRepo.findOne({where : {id}});
        if(!patient){
            throw new  NotFoundException(`404: Patient id ${id} was not found`);
        }
        return patient;
    }

    async update(id : number, updatePatientDto: UpdatePatientDto): Promise<Patient>{
        const patient = await this.findOne(id);
        Object.assign(patient,updatePatientDto);
        return this.patientRepo.save(patient);
    }

    async remove(id:number): Promise<void>{
        const patient = await this.findOne(id);
        await this.patientRepo.remove(patient);
    }
}

