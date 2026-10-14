import { Media, MediaType } from '../../domain';

export class MediaResponseDto {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  duration: number;
  createdAt: Date;

  static fromDomain(entity: Media): MediaResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      duration: entity?.duration ?? 0,
      createdAt: entity.createdAt,
    };
  }
}
