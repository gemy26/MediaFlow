import {
  AuthenticatedIdentity,
  AuthServicePort,
} from '../../application/ports/auth.port';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { WORKOS_PROVIDER } from '../../../shared/infrastructure/auth/workos/workos.provider';
import { WorkOS } from '@workos-inc/node';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class WorkosAuthProvider implements AuthServicePort {
  constructor(
    @Inject(WORKOS_PROVIDER) private readonly workos: WorkOS,
    private readonly configService: ConfigService,
  ) {}
  login(state?: string): string {
    return this.workos.userManagement.getAuthorizationUrl({
      provider: 'authkit',
      clientId: this.configService.getOrThrow('WORKOS_CLIENT_ID'),
      redirectUri: this.configService.getOrThrow('WORKOS_REDIRECT_URI'),
      state,
    });
  }

  async authenticateWithCode(code: string): Promise<AuthenticatedIdentity> {
    const { sealedSession, user } =
      await this.workos.userManagement.authenticateWithCode({
        code,
        clientId: this.configService.getOrThrow('WORKOS_CLIENT_ID'),
        session: {
          sealSession: true,
          cookiePassword: this.configService.getOrThrow(
            'WORKOS_COOKIE_PASSWORD',
          ),
        },
      });

    if (!sealedSession) {
      throw new InternalServerErrorException(
        'Auth Provider did not return a sealed session',
      );
    }

    return {
      sealedSession,
      externalId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
