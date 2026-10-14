import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MediaType } from '../../domain';

export class AddMediaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  description: string;

  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  mediaSize: number; //MB

  @IsNotEmpty()
  @IsEnum(MediaType)
  mediaType: MediaType;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
