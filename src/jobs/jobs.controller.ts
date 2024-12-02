import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job, JobPriority, JobStatus } from './job.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'The job has been successfully created.', type: Job })
  create(@Body() createJobDto: {
    name: string;
    priority: JobPriority;
    comment?: string;
    userId: string;
  }): Promise<Job> {
    return this.jobsService.create(createJobDto);
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
  update(
    @Param('id') id: string,
    @Body() updateJobDto: {
      name?: string;
      priority?: JobPriority;
      comment?: string;
      isCompleted?: boolean;
      status?: JobStatus;
    },
  ): Promise<Job> {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job' })
  @ApiResponse({ status: 200, description: 'The job has been successfully deleted.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.jobsService.remove(id);
  }
}
