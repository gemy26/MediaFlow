import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleMediaRepository } from '../../infrastructure/adapters/drizzle-media.repository';

export interface UpdateMediaInput {
  title?: string;
  description?: string;
  isPrivate?: boolean;
}
@Injectable()
export class UpdateMedia {
  constructor(private readonly mediaRepository: DrizzleMediaRepository) {}
  async execute(id: string, input: UpdateMediaInput): Promise<void> {
    const data = await this.mediaRepository.findOne(id);
    if (data === null)
      throw new NotFoundException(`Media with id ${id} not found`);
    data.updateDetails(input);
    return await this.mediaRepository.save(data);
  }
}
