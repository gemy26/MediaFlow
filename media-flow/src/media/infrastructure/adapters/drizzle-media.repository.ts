import { MediaRepositoryPort } from '../../application/ports/media.repository.port';
import { Media, MediaStatus, MediaType } from '../../domain';
import { DRIZZLE } from '../../../shared/infrastructure/database/postgres/drizzle.provider';
import type { DrizzleDB } from '../../../shared/infrastructure/database/postgres/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { media } from '../../../shared/infrastructure/database/postgres/schema/media.schema';
import { and, eq } from 'drizzle-orm';
type MediaRow = typeof media.$inferSelect;
type MediaInsert = typeof media.$inferInsert;

export function toDomain(row: MediaRow): Media {
  return Media.create({
    id: row.id,
    ownerId: row.ownerId,
    title: row.title,
    description: row.description,
    type: row.mediaType as MediaType,
    uploadId: row.uploadId,
    totalParts: row.totalParts,
    sourceKey: row.sourceKey,
    duration: row.duration,
    size: row.mediaSize,
    status: row.status as MediaStatus,
    isPrivate: row.isPrivate,
    isDeleted: row.isDeleted,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    statusUpdatedAt: row.statusUpdatedAt,
  });
}

export function toPersistence(entity: Media): MediaInsert {
  return {
    id: entity.id,
    ownerId: entity.ownerId,
    title: entity.title,
    description: entity.description,
    mediaType: entity.type,
    uploadId: entity.uploadId,
    totalParts: entity.totalParts,
    sourceKey: entity.sourceKey,
    duration: entity.duration,
    mediaSize: entity.size,
    status: entity.status,
    isPrivate: entity.isPrivate,
    isDeleted: entity.isDeleted,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    statusUpdatedAt: entity.statusUpdatedAt,
  };
}
@Injectable()
export class DrizzleMediaRepository implements MediaRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  async delete(mediaId: string): Promise<void> {
    await this.db
      .update(media)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(media.id, mediaId));
  }

  async save(entity: Media): Promise<void> {
    await this.db
      .update(media)
      .set(toPersistence(entity))
      .where(eq(media.id, entity.id));
  }

  async findOne(mediaId: string): Promise<Media | null> {
    const [data] = await this.db
      .select()
      .from(media)
      .where(and(eq(media.id, mediaId), eq(media.isDeleted, false)));
    if (!data) {
      return null;
    }
    return toDomain(data);
  }

  async findAll(): Promise<Media[] | null> {
    const data = await this.db.select().from(media);
    if (!data) {
      return null;
    }
    return data.map((d) => toDomain(d));
  }

  async findByTitle(title: string): Promise<Media[] | null> {
    title = title.toLowerCase();
    const data = await this.db.select().from(media).where(eq(media.id, title));
    return data.map((d) => toDomain(d));
  }
}
