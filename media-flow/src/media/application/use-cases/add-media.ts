import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { MediaRepositoryPort } from '../ports/media.repository.port';
import { STORAGE } from '../ports/storage.port';
import type { StoragePort } from '../ports/storage.port';
import { Media, MediaType, PART_SIZE } from '../../domain';
import { randomUUID } from 'node:crypto';
import { PresignedPartUrl } from '../../infrastructure/adapters/s3-storage.adapter';

export interface AddMediaInput {
  ownerId: string;
  title: string;
  description: string;
  mediaSize: number;
  isPrivate?: boolean;
  mediaType: MediaType;
}

export interface AddMediaOutput {
  mediaId: string;
  partSize: number;
  totalParts: number;
  uploadId: string;
  uploadUrls: PresignedPartUrl[];
}

@Injectable()
export class AddMedia {
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
    @Inject(STORAGE) private readonly storageService: StoragePort,
  ) {}
  async execute(input: AddMediaInput): Promise<AddMediaOutput> {
    const data = await this.mediaRepository.findByTitle(input.title);
    if (data != null)
      throw new ConflictException('Media already exists with this title');

    const totalParts = Math.ceil(input.mediaSize / PART_SIZE);
    const media: Media = Media.create({
      id: randomUUID(),
      ownerId: input.ownerId,
      title: input.title,
      description: input.description,
      type: input.mediaType,
      size: input.mediaSize,
      totalParts: totalParts,
      isPrivate: input.isPrivate,
    });

    await this.mediaRepository.save(media);

    const UploadId = await this.storageService.createMultipartUpload(
      media.sourceKey,
    );

    media.attachUploadId(UploadId);

    const urls = await this.storageService.presignPartUrls({
      key: media.sourceKey,
      uploadId: media.uploadId!,
      from: 0,
      count: 20,
    });

    return {
      mediaId: media.id,
      uploadUrls: urls,
      partSize: PART_SIZE,
      uploadId: UploadId,
      totalParts: totalParts,
    };
  }
}
