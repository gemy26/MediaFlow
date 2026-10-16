import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Media } from '../../domain';
import type { MediaRepositoryPort } from '../ports/media.repository.port';
import { MEDIA_REPOSITORY } from '../ports/media.repository.port';
@Injectable()
export class ListMedia {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly userRepository: MediaRepositoryPort,
  ) {}
  async execute(): Promise<Media[]> {
    //TODO: SHOULD HANDLE PRIVATE AND DELETED MEDIA
    const data = await this.userRepository.findAll();
    if (!data) throw new NotFoundException(`No Media found`);
    return data;
  }
}
