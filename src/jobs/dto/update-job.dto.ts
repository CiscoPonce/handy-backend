import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobPriority, JobStatus } from '../job.entity';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsEnum(JobPriority)
  @ApiPropertyOptional({ enum: JobPriority })
  priority?: JobPriority;

  @IsOptional()
  @IsEnum(JobStatus)
  @ApiPropertyOptional({ enum: JobStatus })
  status?: JobStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isCompleted?: boolean;
}
