import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó el header Authorization');
    }

    // authHeader → "Bearer eyJhbGciOi..."
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Formato de Authorization inválido');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = payload; // dejamos user disponible para controladores
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
