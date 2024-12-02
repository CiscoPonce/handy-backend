import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job, JobPriority, JobStatus } from './job.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobDto } from './dto/create-job.dto';

@ApiTags('jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'The job has been successfully created.', type: Job })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async create(@Body() createJobDto: CreateJobDto): Promise<Job> {
    try {
      return await this.jobsService.create(createJobDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error creating job:', error);
      throw new BadRequestException(error.message || 'Could not create job');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'Return all jobs.', type: [Job] })
  findAll(): Promise<Job[]> {
    return this.jobsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job by id' })
  @ApiResponse({ status: 200, description: 'Return a job by id.', type: Job })
  findOne(@Param('id') id: string): Promise<Job> {
    return this.jobsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all jobs for a user' })
  @ApiResponse({ status: 200, description: 'Return all jobs for a user.', type: [Job] })
  findByUser(@Param('userId') userId: string): Promise<Job[]> {
    return this.jobsService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job' })
  @ApiResponse({ status: 200, description: 'The job has been successfully updated.', type: Job })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or state transition.' })
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto
  ): Promise<Job> {
    try {
      return await this.jobsService.update(id, updateJobDto);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update job status' })
  @ApiResponse({ status: 200, description: 'The job status has been successfully updated.', type: Job })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  @ApiResponse({ status: 400, description: 'Invalid status transition.' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: JobStatus
  ): Promise<Job> {
    try {
      return await this.jobsService.updateStatus(id, status);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job' })
  @ApiResponse({ status: 200, description: 'The job has been successfully deleted.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.jobsService.remove(id);
  }
}
