import { Media } from '../../domain';

export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');
export interface MediaRepositoryPort {
  save(media: Media): Promise<void>;
  delete(mediaId: string): Promise<void>;
  findOne(mediaId: string): Promise<Media | null>;
  findAll(): Promise<Media[] | null>;
  findByTitle(title: string): Promise<Media[] | null>;
}
