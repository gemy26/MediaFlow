import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MediaStatus, MediaType } from '../../domain';

export class MediaQueryDto {
  @ApiPropertyOptional({ description: 'Filter by media owner ID' })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({ enum: MediaType, description: 'Filter by media type' })
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @ApiPropertyOptional({
    enum: MediaStatus,
    isArray: true,
    description: 'Filter by one or more media statuses',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsEnum(MediaStatus, { each: true })
  status?: MediaStatus[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether to include private media',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includePrivate?: boolean;

  @ApiPropertyOptional({
    description: 'The nextCursor value from the previous page',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
