import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from './patient.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  WITH_DOCTOR = 'with_doctor',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('queue')
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  queue_number: number;

  @Column()
  patient_id: number;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING
  })
  status: QueueStatus;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  joined_at: Date;

  @Column({ type: 'datetime', nullable: true })
  called_at: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ nullable: true })
  doctor_id: number;

  @ManyToOne(() => Patient, patient => patient.queue_entries)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}