import { Module } from '@nestjs/common';
import { MEDIA_REPOSITORY } from './application/ports/media.repository.port';
import { DrizzleMediaRepository } from './infrastructure/adapters/drizzle-media.repository';

@Module({
  providers: [
    {
      provide: MEDIA_REPOSITORY,
      useValue: DrizzleMediaRepository,
    },
  ],
})
export class MediaModule {}