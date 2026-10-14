import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { STORAGE } from '../ports/storage.port';
import type { StoragePort } from '../ports/storage.port';
import type { MediaRepositoryPort } from '../ports/media.repository.port';

@Injectable()
export class CompleteUpload {
  constructor(
    @Inject(STORAGE) private readonly storageService: StoragePort,
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}
  async execute(mediaId: string): Promise<void> {
    const media = await this.mediaRepository.findOne(mediaId);
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    const uploadedParts = await this.storageService.listUploadedParts(
      media.sourceKey,
      media.uploadId!,
    );
    await this.storageService.completeMultipartUpload({
      key: media.sourceKey,
      uploadId: media.uploadId!,
      parts: uploadedParts,
    });
  }
}
