import { USER_REPOSITORY } from '../ports/user.repository.port';
import type { UserRepository } from '../ports/user.repository.port';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { Role } from '../../domain/constants';
import { randomUUID } from 'node:crypto';

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable()
export class RegisterUser {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const data = await this.userRepository.findByEmail(input.email);
    if(data) {
      throw new ConflictException('A user with this email already exists');
    }
    
    const user = User.register({
      id: randomUUID(),
      sub: null,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: Role.USER,
    });

    await this.userRepository.save(user);
    return user;
  }
}
