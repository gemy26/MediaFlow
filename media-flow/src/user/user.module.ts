import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { DrizzleUserRepository } from './infrastructure/adapters/drizzle-user.repository';
import { RegisterUser } from './application/user-cases/register-user';
import { ListUsers } from './application/user-cases/list-users';
import { GetUser } from './application/user-cases/get-user';
import { DeleteUser } from './application/user-cases/delete-user';
import { UserController } from './presentation/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    RegisterUser,
    ListUsers,
    GetUser,
    DeleteUser,
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
  ],
})
export class UserModule {}
