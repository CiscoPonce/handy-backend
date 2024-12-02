import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobPriority, JobStatus } from './job.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private usersService: UsersService,
  ) {}

  async create(createJobDto: {
    name: string;
    priority: JobPriority;
    comment?: string;
    userId: string;
  }): Promise<Job> {
    try {
      console.log('Creating job with dto:', createJobDto);
      
      const user = await this.usersService.findOne(createJobDto.userId);
      console.log('Found user:', user);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const job = this.jobsRepository.create({
        name: createJobDto.name,
        priority: createJobDto.priority,
        comment: createJobDto.comment,
        status: JobStatus.PENDING,
        isCompleted: false,
        user: user,
        userId: user.id
      });
      
      console.log('Created job entity:', job);
      
      const savedJob = await this.jobsRepository.save(job);
      console.log('Saved job:', savedJob);
      
      return savedJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async findAll(): Promise<Job[]> {
    return this.jobsRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async findByUser(userId: string): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async update(id: string, updateJobDto: {
    name?: string;
    priority?: JobPriority;
    status?: JobStatus;
    comment?: string;
    isCompleted?: boolean;
  }): Promise<Job> {
    const job = await this.findOne(id);
    
    // Validate status transition
    if (updateJobDto.status) {
      if (job.status === JobStatus.REFUSED && updateJobDto.status !== JobStatus.PENDING) {
        throw new Error('Refused jobs can only be set back to pending');
      }
      if (job.isCompleted && updateJobDto.status !== job.status) {
        throw new Error('Cannot change status of completed jobs');
      }
    }

    // Validate completion
    if (updateJobDto.isCompleted) {
      if (job.status !== JobStatus.ACCEPTED) {
        throw new Error('Only accepted jobs can be marked as completed');
      }
    }

    // Update the job
    Object.assign(job, updateJobDto);
    
    return this.jobsRepository.save(job);
  }

  async updateStatus(id: string, status: JobStatus): Promise<Job> {
    const job = await this.findOne(id);
    job.status = status;
    return this.jobsRepository.save(job);
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOne(id);
    await this.jobsRepository.remove(job);
  }
}
