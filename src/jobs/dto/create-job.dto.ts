import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobPriority } from '../job.entity';

export class CreateJobDto {
  @IsString()
  @ApiProperty({ description: 'Name of the job' })
  name: string;

  @IsEnum(JobPriority)
  @ApiProperty({ 
    enum: JobPriority,
    description: 'Priority level of the job',
    example: JobPriority.MEDIUM
  })
  priority: JobPriority;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Additional comments about the job' })
  comment?: string;

  @IsUUID()
  @ApiProperty({ description: 'UUID of the user creating the job' })
  userId: string;
}
