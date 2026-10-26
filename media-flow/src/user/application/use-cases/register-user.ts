import { USER_REPOSITORY } from '../ports/user.repository.port';
import type { UserRepository } from '../ports/user.repository.port';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { Role } from '../../domain/constants';
import { randomUUID } from 'node:crypto';
import type { IdentityProvider } from '../ports/identity-provider.port';
import { IDENTITY_PROVIDER } from '../ports/identity-provider.port';

export interface RegisterUserInput {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable()
export class RegisterUser {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(IDENTITY_PROVIDER)
    private readonly identityProvider: IdentityProvider,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const data =
      (await this.userRepository.findBySub(input.externalId)) ??
      (await this.userRepository.findByEmail(input.email));

    if (data) {
      return data;
    }

    const user = User.register({
      id: randomUUID(),
      sub: input.externalId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: Role.USER,
    });

    await this.userRepository.save(user);
    await this.identityProvider.syncRole(input.externalId, Role.USER);
    return user;
  }
}
