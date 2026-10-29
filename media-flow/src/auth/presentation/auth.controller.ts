import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Authentication } from '../application/use-cases/authentication';
import type { Response, Request } from 'express';
import { Public } from '../../shared/presentation/decorator/public.decorator';
import { Logout } from '../application/use-cases/logout';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: Authentication,
    private readonly logoutUseCase: Logout,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('login')
  @Redirect()
  login(@Query('state') state?: string) {
    return { url: this.loginUseCase.redirect(state) };
  }

  @Public()
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
    console.log('[callback Controller]: sealedSession', sealedSession);
    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return { url: '/user/me' };
  }

  @Get('logout')
  @Redirect()
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sealedSession = request.cookies?.['wos-session'];
    response.clearCookie('wos-session');

    console.log('[logout Controller]: sealedSession:', sealedSession);
    const returnTo: string =
      this.configService.getOrThrow<string>('APP_LOGIN_URL');

    console.log('[logout Controller]: returnTo:', returnTo);
    const url = await this.logoutUseCase.execute(sealedSession, returnTo);
    console.log('[logout Controller]: url:', url);
    return { url };
  }

  //TODO: ADD WEBHOOK TO HANDLE USER UPDATES
}
