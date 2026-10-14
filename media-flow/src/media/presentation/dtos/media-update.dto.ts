import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class MediaUpdateDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;
}
