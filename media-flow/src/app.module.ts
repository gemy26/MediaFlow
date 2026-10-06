import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(process.cwd(), '.env'),
      isGlobal: true,
    }),
    DrizzleModule,
    UserModule,
  ],
})
export class AppModule {}
