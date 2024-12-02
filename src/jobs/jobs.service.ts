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
    const user = await this.usersService.findOne(createJobDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const job = this.jobsRepository.create({
      ...createJobDto,
      user,
      status: JobStatus.PENDING,
      isCompleted: false,
    });

    return this.jobsRepository.save(job);
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
    comment?: string;
    isCompleted?: boolean;
    status?: JobStatus;
  }): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, updateJobDto);
    return this.jobsRepository.save(job);
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOne(id);
    await this.jobsRepository.remove(job);
  }
}
