import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../ports/auth.port';
import type { AuthServicePort } from '../ports/auth.port';
import { RegisterUser } from '../../../user/application/use-cases/register-user';
import { User } from '../../../user/domain/user.entity';

@Injectable()
export class Authentication {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthServicePort,
    private readonly registerUser: RegisterUser,
  ) {}

  redirect(state?: string): string {
    return this.authService.login(state);
  }

  async callback(code: string): Promise<{ sealedSession: string; user: User }> {
    const identity = await this.authService.authenticateWithCode(code);
    console.log('[callback Use-Case]: identity: ', identity);
    const user = await this.registerUser.execute({
      externalId: identity.externalId,
      firstName: identity.firstName ?? '',
      lastName: identity.lastName ?? '',
      email: identity.email,
    });

    const refreshed = await this.authService.refreshSession(
      identity.sealedSession,
    );

    if (
      !refreshed.authenticated ||
      !refreshed.sealedSession ||
      refreshed.appUserId !== user.id
    ) {
      throw new InternalServerErrorException(
        'Refreshed WorkOS session is missing the matching app user ID claim',
      );
    }

    return { sealedSession: refreshed.sealedSession, user };
  }
}
