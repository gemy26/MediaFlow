import { Injectable, NotFoundException } from '@nestjs/common';
import type { MediaRepositoryPort } from '../ports/media.repository.port';
import { Media } from '../../domain';

@Injectable()
export class ListMedia {
  constructor(private readonly userRepository: MediaRepositoryPort) {}
  async execute(): Promise<Media[]> {
    const data = await this.userRepository.findAll();
    if (!data) throw new NotFoundException(`No Media found`);
    return data;
  }
}
