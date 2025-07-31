import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue, QueueStatus } from '../entities/queue.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepo: Repository<Queue>,
  ) {}

  async addToQueue(patientId: number, doctorId?: number): Promise<Queue> {
    // Get highest queue number aka the person who joined last
    const lastQueue = await this.queueRepo.findOne({
      where: {},
      order: { queue_number: 'DESC' },
    });
    
    const nextQueueNum = lastQueue ? lastQueue.queue_number + 1 : 1;

    const queueEntry = this.queueRepo.create({
      queue_number: nextQueueNum,
      patient_id: patientId,
      doctor_id: doctorId,
      status: QueueStatus.WAITING,
      joined_at: new Date(),
    });

    return this.queueRepo.save(queueEntry);
  }

  async updateStatus(id: number, status: QueueStatus, doctorId?: number): Promise<Queue> {
    const queueEntry = await this.findOne(id);
    
    queueEntry.status = status;
    
    if (status === QueueStatus.WITH_DOCTOR) {
      queueEntry.called_at = new Date();
      if (doctorId) queueEntry.doctor_id = doctorId;
    } else if (status === QueueStatus.COMPLETED) {
      queueEntry.completed_at = new Date();
    }

    return this.queueRepo.save(queueEntry);
  }

  async findAll(): Promise<Queue[]> {
    return this.queueRepo.find({
      //eager-loading - fetch patient data with related queue onject
      relations: ['patient'],
      order: { queue_number: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Queue> {
    const queueEntry = await this.queueRepo.findOne({ 
      where: { id },
      relations: ['patient'],
    });
    
    if (!queueEntry) {
      throw new NotFoundException(`404: Entry with ID ${id} was not found`);
    }
    
    return queueEntry;
  }

  async getCurrentQueue(): Promise<Queue[]> {
    return this.queueRepo.find({
      where: { status: QueueStatus.WAITING },
      relations: ['patient'],
      order: { queue_number: 'ASC' },
    });
  }

  async removeFromQueue(id: number): Promise<void> {
    const queueEntry = await this.findOne(id);
    await this.queueRepo.remove(queueEntry);
  }

  async getQueueByStatus(status: QueueStatus): Promise<Queue[]> {
    return this.queueRepo.find({
      where: { status },
      relations: ['patient'],
      order: { queue_number: 'ASC' },
    });
  }
} 