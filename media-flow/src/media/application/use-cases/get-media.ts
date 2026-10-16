import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { MediaRepositoryPort } from '../ports/media.repository.port';
import { MEDIA_REPOSITORY } from '../ports/media.repository.port';
@Injectable()
export class GetMedia {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly userRepository: MediaRepositoryPort,
  ) {}
  async execute(id: string) {
    const data = await this.userRepository.findOne(id);
    if (!data) throw new NotFoundException(`Media with id ${id} not found`);
    //TODO: SHOULD HANDLE PRIVATE AND DELETED MEDIA
    return data;
  }
}
