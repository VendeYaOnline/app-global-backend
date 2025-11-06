import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptUtil } from 'src/common/utils/bcrypt.util';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UnauthorizedError } from 'src/common/errors/unauthorized.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Credenciales invalidas');
    } else {
      const isValid = await BcryptUtil.compare(password, user.password);
      if (!isValid) throw new UnauthorizedError('Credenciales invalidas');
      const payload = { sub: user.id, role: user.role };
      const token = await this.jwt.signAsync(payload);
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.email,
          role: user.role,
        },
      };
    }
  }
}
