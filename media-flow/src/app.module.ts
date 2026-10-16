import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { S3Module } from './shared/infrastructure/Storage/s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(process.cwd(), '.env'),
      isGlobal: true,
    }),
    DrizzleModule,
    S3Module,
    UserModule,
    MediaModule,
  ],
})
export class AppModule {}
