import { MediaResponseDto } from './media-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Media } from '../../domain';
import { Page } from '../../application/ports/media.repository.port';

export class PaginatedMediaResponseDto {
  @ApiProperty({ type: MediaResponseDto, isArray: true })
  items: MediaResponseDto[];

  @ApiProperty({
    type: String,
    nullable: true,
    description:
      'Pass as ?cursor= to get the next page. null on the last page.',
  })
  nextCursor: string | null;

  static fromPage(page: Page<Media>): PaginatedMediaResponseDto {
    const dto = new PaginatedMediaResponseDto();
    dto.items = page.items.map((m) => MediaResponseDto.fromDomain(m));
    dto.nextCursor = page.nextCursor;
    return dto;
  }
}
