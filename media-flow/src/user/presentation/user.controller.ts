import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteUser } from '../application/use-cases/delete-user';
import { GetUser } from '../application/use-cases/get-user';
import { ListUsers } from '../application/use-cases/list-users';
import { RegisterUser } from '../application/use-cases/register-user';
import { UserResponseDto } from './dtos/user-response.dto';
import { Role } from '../domain/constants';
import { Roles } from '../../shared/presentation/decorator/roles.decorator';
import { ExternalId } from '../../shared/presentation/decorator/get-external-id.decorator';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly listUsers: ListUsers,
    private readonly getUser: GetUser,
    private readonly deleteUser: DeleteUser,
  ) {}

  @Get('me')
  async me(@ExternalId() sub: string): Promise<UserResponseDto> {
    return UserResponseDto.fromDomain(await this.getUser.executeBySub(sub));
  }

  @Roles([Role.ADMIN])
  @Get('/admin')
  admin() {
    return 'yes that user is an admin';
  }

  @Roles([Role.ADMIN])
  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  async findAll() {
    return (await this.listUsers.execute()).map((user) =>
      UserResponseDto.fromDomain(user),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return UserResponseDto.fromDomain(await this.getUser.execute(id));
  }

  @Roles([Role.ADMIN])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUser.execute(id);
  }
}
