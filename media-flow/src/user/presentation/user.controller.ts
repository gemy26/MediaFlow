import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { DeleteUser } from '../application/user-cases/delete-user';
import { GetUser } from '../application/user-cases/get-user';
import { ListUsers } from '../application/user-cases/list-users';
import { RegisterUser } from '../application/user-cases/register-user';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly listUsers: ListUsers,
    private readonly getUser: GetUser,
    private readonly deleteUser: DeleteUser,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiConflictResponse({ description: 'Email address is already registered' })
  async register(@Body() dto: RegisterUserDto) {
    return UserResponseDto.fromDomain(await this.registerUser.execute(dto));
  }

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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUser.execute(id);
  }
}
