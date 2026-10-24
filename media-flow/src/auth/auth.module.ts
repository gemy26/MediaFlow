import { Global, Module } from '@nestjs/common';
import { AUTH_SERVICE } from './application/ports/auth.port';
import { WorkosAuthProvider } from './infrastructure/adapters/workos-auth.adapter';
import { AuthController } from './presentation/auth.controller';
import { Login } from './application/use-cases/login';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: WorkosAuthProvider,
    },
    Login,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
