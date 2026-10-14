import { PresignedPartUrl } from '../../infrastructure/adapters/s3-storage.adapter';
import { AddMediaOutput } from '../../application/use-cases/add-media';

export class PresignedPartUrlDto {
  // @ApiProperty({ example: 1, description: 'Part number (starts at 1)' })
  partNumber: number;

  // @ApiProperty({ description: 'Presigned PUT URL for this part' })
  url: string;
}

export class AddMediaResponseDto {
  mediaId: string;
  partSize: number;
  totalParts: number;
  uploadUrls: PresignedPartUrl[];
  uploadId: string;
  ownerId: string;

  static from(output: AddMediaOutput): AddMediaResponseDto {
    const dto = new AddMediaResponseDto();
    dto.mediaId = output.mediaId;
    dto.partSize = output.partSize;
    dto.totalParts = output.totalParts;
    dto.uploadUrls = output.uploadUrls;
    dto.uploadId = output.uploadId;
    return dto;
  }
}
