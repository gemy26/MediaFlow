import { Media } from '../../domain';
import { MediaFilter } from '../../infrastructure/adapters/drizzle-media.repository';
export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');

export interface MediaRepositoryPort {
  save(media: Media): Promise<void>;
  delete(mediaId: string): Promise<void>;
  findOne(mediaId: string, filter?: MediaFilter): Promise<Media | null>;
  findMany(filter: MediaFilter): Promise<Media[] | null>;
  findByTitle(title: string): Promise<Media[] | null>;
}
