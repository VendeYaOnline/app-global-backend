import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(createAuthDto);
    res.cookie('acces_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 9 * 60 * 60 * 1000,
    });

    return user;
  }
}
