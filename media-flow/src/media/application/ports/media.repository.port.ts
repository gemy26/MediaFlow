import { Media } from '../../domain';
import {
  MediaFilter,
  paginationFilter,
} from '../../infrastructure/adapters/drizzle-media.repository';
export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface MediaRepositoryPort {
  save(media: Media): Promise<void>;
  delete(mediaId: string): Promise<void>;
  findOne(mediaId: string, filter?: MediaFilter): Promise<Media | null>;
  findMany(
    filter: MediaFilter,
    pagination?: paginationFilter,
  ): Promise<Page<Media>>;
  findByTitle(title: string): Promise<Media[] | null>;
  // findPage(
  //   filter: MediaFilter,
  //   pagination: paginationFilter,
  // ): Promise<Page<Media>>;
}
