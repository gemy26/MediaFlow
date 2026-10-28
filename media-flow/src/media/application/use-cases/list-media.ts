import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Media } from '../../domain';
import type { MediaRepositoryPort, Page } from '../ports/media.repository.port';
import { MEDIA_REPOSITORY } from '../ports/media.repository.port';
import {
  MediaFilter,
  paginationFilter,
} from '../../infrastructure/adapters/drizzle-media.repository';
@Injectable()
export class ListMedia {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly userRepository: MediaRepositoryPort,
  ) {}
  async execute(
    filter: MediaFilter,
    paginationFilter: paginationFilter,
  ): Promise<Page<Media>> {
    const data = await this.userRepository.findMany(filter, paginationFilter);
    if (!data) throw new NotFoundException(`No Media found`);
    return data;
  }
}
