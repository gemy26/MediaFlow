import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { Login } from '../application/use-cases/login';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: Login) {}

  @Get('login')
  @Redirect()
  login(@Query('state') state?: string) {
    return { url: this.loginUseCase.redirect(state) };
  }

  @Get('callback')
  @Redirect()
  async callback(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!code) {
      throw new BadRequestException('No code provided');
    }

    const { sealedSession } = await this.loginUseCase.callback(code);
    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    //TODO: CHANGE THAT REDIRECT TO HOME PAGE
    return { url: '/user/' };
  }

  //TODO: ADD WEBHOOK TO HANDLE USER UPDATES
}
