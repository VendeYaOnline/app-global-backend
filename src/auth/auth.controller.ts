import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    const { token, user } = await this.authService.login(createAuthDto);
    return { user, token };
  }

  @Post('logout')
  async logout() {
    return { message: 'Logout exitoso' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req) {
    return this.authService.me(req.user.sub);
  }
}
