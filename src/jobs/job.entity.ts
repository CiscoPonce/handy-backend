import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum JobPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum JobStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused'
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: JobPriority,
    default: JobPriority.MEDIUM
  })
  priority: JobPriority;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.PENDING
  })
  status: JobStatus;

  @ManyToOne(() => User, user => user.jobs, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
